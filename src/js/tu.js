const login_server = 'https://secure.huygens.knaw.nl/saml2/login';
const home = "http://www.huc.localhost/timbuctoo_uploader/";
//const home = "https://timporter.sd.di.huc.knaw.nl/";

const defaultMetadata = [{
    key: 'title',
    label: 'Title',
    type: 'single'
}, {
    key: 'description',
    label: 'Description',
    type: 'multi'
}, {
    key: 'imageUrl',
    label: 'Image URL',
    type: 'single'
}, {
    key: 'license',
    label: 'License',
    type: 'uri'
}, {
    key: 'owner',
    label: 'Owner',
    type: [{
        key: 'name',
        label: 'Name',
        type: 'single'
    }, {
        key: 'email',
        label: 'Email',
        type: 'single'
    }]
}, {
    key: 'contact',
    label: 'Contact',
    type: [{
        key: 'name',
        label: 'Name',
        type: 'single'
    }, {
        key: 'email',
        label: 'Email',
        type: 'single'
    }]
}, {
    key: 'provenanceInfo',
    label: 'Provenance',
    type: [{
        key: 'title',
        label: 'Title',
        type: 'single'
    }, {
        key: 'body',
        label: 'Body',
        type: 'multi'
    }]
}];

const gaMetadata = [{
    key: 'title',
    label: 'Title',
    type: 'single'
}, {
    key: 'description',
    label: 'Description',
    type: 'multi'
}, {
    key: 'image',
    label: 'Image URL',
    type: 'uri'
}, {
    key: 'license',
    label: 'License',
    type: 'uri'
}, {
    key: 'publisher',
    label: 'Publisher',
    type: 'single'
}, {
    key: 'creator',
    label: 'Creator',
    type: 'single'
}, {
    key: 'contributor',
    label: 'Contributor',
    type: 'single'
}, {
    key: 'dataProvider',
    label: 'Data provider',
    type: 'single'
}, {
    key: 'subject',
    label: 'Subject',
    type: 'single'
}, {
    key: 'source',
    label: 'Source',
    type: 'single'
}, {
    key: 'created',
    label: 'Created',
    type: 'single'
}, {
    key: 'modified',
    label: 'Modified',
    type: 'single'
}, {
    key: 'sparqlEndpoint',
    label: 'SPARQL endpoint',
    type: 'uri'
}];

const resources = {
    loc: {url: "http://localhost:8080/v5/", name: "Local Timbuctoo", metadata: defaultMetadata},
    tim: {url: "https://repository.huygens.knaw.nl/v5/", name: "Huygens Timbuctoo", metadata: defaultMetadata},
    gol: {url: "https://repository.goldenagents.org/v5/", name: "Golden Agents", metadata: gaMetadata}
}

const mimeTypes = {
    ttl: 'text/turtle',
    trig: 'application/trig',
    nt: 'application/n-triples',
    nq: 'application/n-quads',
    n3: 'text/n3',
    xml: 'application/rdf+xml'
}
let user_id = '';
let acceptedFiles = 0;

function init() {
    //$("#login").html("Logged in");
    if ($("#repo").length) {
        $("#uploadMetadata").removeClass("noView");
        create_metadata('Repository', resources[$("#repo").val()].name);
        whoAmI($("#hsid").val());
        get_creds($("#hsid").val());
    }
    if ($("#actiontype").length) {
        create_metadata('Action', selectAction($("#actiontype").val()));
        if (!$("#ds").length) {
            if ($("#actiontype").val() === "existing") {
                get_dataset_names();
            }
            if ($("#actiontype").val() === "alles") {
                get_dataset_names();
            }
            if ($("#actiontype").val() === "show_dataset") {
                get_dataset_details();
            }
            if ($("#actiontype").val() === "edit_metadata") {
                get_dataset_details();
            }
            if ($("#actiontype").val() === "show_status") {
                get_dataset_details();
                check_process();
            }
        } else {
            create_metadata("Dataset", $("#ds_name").val());
        }

    }
}

function correct_mimetype(ext) {
    for (var key in mimeTypes) {
        if (key === ext) {
            return true;
        }
    }
    return false;
}

function resetFileUploadError() {
    $("#fileError").html("");
}

function validateFiles() {
    const owner_id = $("#owner_id").val();
    const files = $("#uploadfiles")[0].files;
    if (files.length === 0) {
        $("#fileError").html("No files selected!");
    } else {
        create_upload_status_element();
        makePreparationsAndSend(owner_id, files);
    }
}

async function makePreparationsAndSend(owner_id, files) {
    const allFiles = Array.from(files).map(file => {
        const codedFileName = file.name.split('.').join('_');
        const extension = file.name.split('.').slice(-1)[0];
        if (extension === 'gz') {
            fileType = file.name.split('.').slice(-2)[0];
            if (correct_mimetype(fileType)) {
                createFileStatusLine(codedFileName, file.name);
                return send_file(file, owner_id, $("#ds_name").val());
            }
        } else {
            createFileStatusLine(codedFileName, file.name);
            return send_file(file, owner_id, $("#ds_name").val());
        }
    });
    await Promise.all(allFiles);
    $("#importHeader").html("Import completed");
    $("#spinner").remove();
}

async function check_process() {
    const url = resources[$("#repo").val()].url + "graphql";
    const dataset = $("#dataset_id").val();
    const hsid = $("#hsid").val();
    query = 'query {dataSetMetadata(dataSetId: "' + dataset + '") {dataSetImportStatus {id status source progress {label status progress speed} errorObjects {dateStamp file method message error}}}}';
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({"query": query}),
        headers: {
            authorization: hsid,
            VRE_ID: dataset,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        let json = await response.json();
        editStatus(json);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

function create_upload_status_element() {
    $("#upload_form").addClass("noView");
    $("#uploadStatus").removeClass("noView");
}

function editStatus(json) {
    let isDone = true;
    for (const importStatus of json.data.dataSetMetadata.dataSetImportStatus) {
        if ($('#' + importStatus.source).length === 0 && importStatus.status !== 'DONE') {
            createFileStatusLine(importStatus.source, importStatus.source);
        }
        if ($('#' + importStatus.source).length > 0) {
            let status;
            switch (importStatus.status) {
                case 'PENDING':
                    isDone = false;
                    status = 'Waiting in queue to be processed';
                    break;
                case 'IMPORTING':
                    isDone = false;
                    const quadstore = importStatus.progress.find(item => item.label === 'BdbQuadStore');
                    status = quadstore
                        ? `Processing file (Quads processed: ${quadstore.progress}; Speed: ${quadstore.speed})`
                        : 'Processing file';
                    break;
                case 'DONE':
                    status = 'File has been successfully processed!';
                    break;
            }

            $("#" + importStatus.source).html(status);
            if (importStatus.errorObjects.length) {
                $("#" + name).html("ERROR! (File not imported)");
                const errorMsg = importStatus.errorObjects[0].error.split("\n").join("<br/>");
                $("#" + name + "_error").html(errorMsg);
            }
        }
    }

    if (isDone) {
        $("#importHeader").html("All files are processed!");
        $("#spinner").remove();
    } else {
        setTimeout(check_process, 1000);
    }

}

function createFileStatusLine(codedFileName, fileName) {
    let line = document.createElement('div');
    $(line).addClass("fileStatus");
    let cell = document.createElement('div');
    $(cell).addClass("fileStatusName");
    $(cell).html(fileName + ":");
    $(line).append(cell);
    cell = document.createElement('div');
    $(cell).addClass("progess");
    $(cell).attr("id", codedFileName);
    $(cell).html("Uploading file to Timbuctoo");
    $(line).append(cell);
    $("#fileStatus").append(line);
    line = document.createElement('div');
    $(line).addClass("fileStatusError");
    $(line).attr("id", codedFileName + "_error");
    $("#fileStatus").append(line);

}

async function send_file(file, owner_id, datasetName) {
    const codedFileName = file.name.split('.').join('_');
    const mimeType = getMimeType(file);
    const url = resources[$("#repo").val()].url + owner_id + "/" + datasetName + "/upload/rdf?async=true";
    const hsid = $("#hsid").val();
    const data = new FormData();
    acceptedFiles++;

    data.append('file', file);
    data.append('fileMimeTypeOverride', mimeType);
    data.append('encoding', 'UTF-8');

    $("#uploadStatus").removeClass("noView");

    const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            authorization: hsid,
            VRE_ID: owner_id + "__" + datasetName,
        }
    });

    if (response.ok) {
        $("#" + codedFileName).html('Uploaded!')
    } else {
        $("#" + codedFileName).html('ERROR! (File not imported)')
    }
}

function getMimeType(file) {
    let ext = file.name.split('.').slice(-1)[0];

    if (ext === 'gz') {
        ext = file.name.split('.').slice(-2)[0];
    }

    for (var key in mimeTypes) {
        if (ext === key) {
            return mimeTypes[key];
        }
    }
    return "";
}


function selectAction(status) {
    if (status === 'new') {
        return "Create new dataset";
    } else {
        return "Select existing dataset";
    }
}

function login() {
    var lform = document.createElement('form');
    lform.action = login_server;
    lform.id = 'loginForm'
    lform.method = 'POST';
    var field = document.createElement('input');
    field.type = 'hidden';
    field.name = 'hsurl';
    field.value = document.location;
    lform.append(field);
    document.getElementById('loginFormDiv').append(lform);
    document.getElementById('loginForm').submit();
}

function get_creds(hsid) {
    console.log('OK');
    $.ajax({
        type: "GET",
        url: "https://secure.huygens.knaw.nl/sessions/" + hsid,
        crossDomain: true,
        dataType: 'jsonp',
        success: function (json) {
            console.log(json);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function create_metadata(label, value) {
    var row = document.createElement('div');
    $(row).attr("class", 'mdRow');
    var line = document.createElement('div');
    $(line).addClass("mdLabel");
    $(line).html(label);
    $(row).append(line);
    line = document.createElement('div');
    $(line).addClass("mdValue");
    $(line).html(value);
    $(row).append(line);
    $("#uploadMetadata").append(row);
}

function process_repo() {
    window.location = home + "?hsid=" + $("#hsid").val() + "&repo=" + $("#resource").val();
}

function validate() {
    if ($("#ds_name").val().trim() === "") {
        $("#nameError").html("No dataset name provided!");
    } else {
        if (!correctExpression($("#ds_name").val())) {
            $("#nameError").html("Invalid dataset name!");
        } else {
            $("#nameError").html("");
        }
    }
    if ($("#ds").val() === "") {
        $("#fileError").html("No dataset file provided!");
    } else {
        $("#fileError").html("");
    }
}

function validateName() {
    let error = false;
    if ($("#ds_name").val().trim() === "") {
        error = true;
        $("#nameError").html("No dataset name provided!");
    } else {
        if (!correctExpression($("#ds_name").val())) {
            error = true;
            $("#nameError").html("Invalid dataset name!");
        } else {
            $("#nameError").html("");
        }
    }
    if (!error) {
        create_dataset($("#ds_name").val(), $("#ds_baseuri").val(), $("#hsid").val());
    }
}

function correctExpression(name) {
    var re = new RegExp('^([a-z_0-9]+)$');
    return re.test(name);
}

function get_dataset_names() {
    url = resources[$("#repo").val()].url + "graphql";
    hsid = $("#hsid").val();
    query = "query {aboutMe {id name dataSetMetadataList(ownOnly: false, permission: WRITE) {uri dataSetId dataSetName}}}";
    timbuctoo_requests(url, query, hsid);
}

function get_dataset_details() {
    url = resources[$("#repo").val()].url + "graphql";
    hsid = $("#hsid").val();
    metadata = resources[$("#repo").val()].metadata;
    query = `query datasetMetaData {dataSets { ${$("#dataset_id").val()} {metadata {dataSetId dataSetName ${get_dataset_details_query(metadata)}}}}}`;
    timbuctoo_requests(url, query, hsid);
}

function get_dataset_details_query(metadata) {
    let query = '';
    for (const md of metadata) {
        query += `${md.key} { `;
        query += Array.isArray(md.type)
            ? get_dataset_details_query(md.type)
            : (md.type === 'uri' ? 'uri' : 'value');
        query += ' } ';
    }
    return query;
}

async function whoAmI(hsid) {
    let response = await fetch(resources[$("#repo").val()].url + "graphql", {
        method: "POST",
        body: JSON.stringify({"query": "{aboutMe {id name}}"}),
        headers: {
            authorization: hsid,
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        result = await response.json();
        user_id = result.data.aboutMe.id;
        create_metadata('Username', result.data.aboutMe.name);
    } else {
        console.log(response.statusText);
    }
}

function myDatasets() {
    window.location = home + "?actiontype=alles&hsid=" + $("#hsid").val() + "&repo=" + $("#repo").val();
}

async function timbuctoo_submit(url, query, vars, hsid) {
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({"query": query, "variables": vars}),
        headers: {
            authorization: hsid,
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        result = await response.json();
        myDatasets();
    }
}

async function timbuctoo_requests(url, query, hsid) {
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({"query": query}),
        headers: {
            authorization: hsid,
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        result = await response.json();
        switch ($("#actiontype").val()) {
            case "existing":
                buildSelect(result);
                break;
            case "alles":
                buildList(result);
                break;
            case "show_dataset":
                dataset_data(result);
                break;
            case "delete_dataset":
                myDatasets();
                break;
            case "edit_metadata":
                dataset_edit_data(result);
                break;
            default:
                home();
        }
    } else {
        console.log(response.statusText);
    }
}

function delete_dataset() {
    if (confirm("Do you want to delete this dataset?")) {
        url = resources[$("#repo").val()].url + "graphql";
        hsid = $("#hsid").val();
        query = "mutation {deleteDataSet(dataSetId: \"" + $("#dataset_id").val() + "\") {dataSetId}}";
        $("#actiontype").val("delete_dataset");
        timbuctoo_requests(url, query, hsid);
    }
}

function sendDataSetData() {
    url = resources[$("#repo").val()].url + "graphql";
    hsid = $("#hsid").val();
    query = "mutation setMetadata($dataSet:String!, $metadata:DataSetMetadataInput!){setDataSetMetadata(dataSetId:$dataSet,metadata:$metadata){dataSetId}}";
    variables = {
        dataSet: $("#dataset_id").val(),
        metadata: createMetadata(resources[$("#repo").val()].metadata, '')
    };
    $("#actiontype").val("submit_data");
    timbuctoo_submit(url, query, variables, hsid);
}

function createMetadata(metadata, key) {
    const obj = {};
    for (const md of metadata) {
        const value = Array.isArray(md.type) ? createMetadata(md.type, key + md.key + '_') : $("#dsd" + key + md.key).val();
        obj[md.key] = Array.isArray(md.type) || value.trim().length > 0 ? value : null;
    }
    return obj;
}

function editDataset() {
    window.location = home + "?hsid=" + $("#hsid").val() + "&dataset_id=" + $("#dataset_id").val() + "&repo=" + $("#repo").val() + "&actiontype=edit_metadata";
}

function showStatus() {
    window.location = home + "?hsid=" + $("#hsid").val() + "&dataset_id=" + $("#dataset_id").val() + "&repo=" + $("#repo").val() + "&actiontype=show_status";
}

function goHome() {
    if ($("#hsid").val !== undefined) {
        window.location = home + "?hsid=" + $("#hsid").val();
    } else {
        window.location = home;
    }
}

function dataset_data(result) {
    $("#dsdID").html(result.data.dataSets[$("#dataset_id").val()].metadata.dataSetId);
    $("#dsdName").html(result.data.dataSets[$("#dataset_id").val()].metadata.dataSetName);

    const metadata = resources[$("#repo").val()].metadata;
    create_metadata_read_table(metadata, result.data.dataSets[$("#dataset_id").val()].metadata, $('#datasetTable'));
}

function create_metadata_read_table(metadata, data, elem) {
    for (const md of metadata) {
        if (Array.isArray(md.type)) {
            elem.append(`<tr><td class="dsTableHeader" colspan="2">${md.label}</td></tr>`);
            create_metadata_read_table(md.type, data[md.key], elem);
        } else {
            const value = data !== null && data[md.key] !== null ?
                (md.type === 'uri' ? data[md.key].uri : data[md.key].value) : '';
            elem.append($(`<tr><td class="fieldLabel">${md.label}</td><td>${value}</td></tr>`));
        }
    }
}

function dataset_edit_data(result) {
    console.log(result);
    $("#dsdID").html(result.data.dataSets[$("#dataset_id").val()].metadata.dataSetId);
    $("#dsdName").html(result.data.dataSets[$("#dataset_id").val()].metadata.dataSetName);

    const metadata = resources[$("#repo").val()].metadata;
    create_metadata_edit_table(metadata, result.data.dataSets[$("#dataset_id").val()].metadata, $('#datasetTable'), '');
}

function create_metadata_edit_table(metadata, data, elem, key) {
    for (const md of metadata) {
        if (Array.isArray(md.type)) {
            elem.append(`<tr><td class="dsTableHeader" colspan="2">${md.label}</td></tr>`);
            create_metadata_edit_table(md.type, data[md.key], elem, key + md.key + '_');
        } else {
            const inputElem = md.type === 'multi'
                ? $(`<textarea id="dsd${key + md.key}" rows="8" cols="60"></textarea>`)
                : $(`<input id="dsd${key + md.key}" type="text" size="100"/>`);
            inputElem.val(data !== null && data[md.key] !== null ?
                (md.type === 'uri' ? data[md.key].uri : data[md.key].value) : '');

            const elemToAppend = $(`<tr><td class="fieldLabel">${md.label}</td><td class="fieldValue"></td></tr>`);
            elemToAppend.find('.fieldValue').append(inputElem);

            elem.append(elemToAppend);
        }
    }
}

function buildSelect(result) {
    for (var key in result.data.aboutMe.dataSetMetadataList) {
        var option = document.createElement('option');
        $(option).attr("value", result.data.aboutMe.dataSetMetadataList[key].dataSetId);
        $(option).html(result.data.aboutMe.dataSetMetadataList[key].dataSetName);
        $("#ds_select").append(option);
    }
}

function buildList(result) {
    for (var key in result.data.aboutMe.dataSetMetadataList) {
        var div = document.createElement('div');
        $(div).addClass("dsSelector");
        var link = document.createElement("a");
        $(link).addClass("ds");
        link.href = home + "?actiontype=show_dataset&dataset_id=" + result.data.aboutMe.dataSetMetadataList[key].dataSetId + "&repo=" + $("#repo").val() + "&hsid=" + $("#hsid").val();
        $(link).html(result.data.aboutMe.dataSetMetadataList[key].dataSetName);
        $(div).attr("value", result.data.aboutMe.dataSetMetadataList[key].dataSetId);
        $(div).append(link);
        $("#myDataSets").append(div);
    }
}

async function create_dataset(name, baseuri, hsid) {
    const query = baseuri
        ? "mutation {createDataSet(dataSetName: \"" + name + "\", baseUri:  \"" + baseuri + "\") {dataSetId dataSetName ownerId}}"
        : "mutation {createDataSet(dataSetName: \"" + name + "\") {dataSetId dataSetName ownerId}}";
    console.log(JSON.stringify({"query": query}));
    let response = await fetch(resources[$("#repo").val()].url + "graphql", {
        method: "POST",
        body: JSON.stringify({"query": query}),
        headers: {
            authorization: hsid,
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        result = await response.json();
        if (!result.data) {
            $("#nameError").html(result.errors[0].message);
        } else {
            create_metadata('Dataset', name);
            window.location = home + "?hsid=" + $("#hsid").val() + "&repo=" + $("#repo").val() + "&actiontype=new&ds=" + result.data.createDataSet.dataSetId;
        }

    } else {
        $("#nameError").html(response.statusText);
    }
}