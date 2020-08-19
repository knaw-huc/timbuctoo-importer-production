const login_server = 'https://secure.huygens.knaw.nl/saml2/login';
//const home = "https://www.huc.localhost/timbuctoo_uploader/";
const home = "https://timporter.sd.di.huc.knaw.nl/";
const resources = {
    loc: {url: "http://localhost:8080/v5/", name: "Local Timbuctoo"},
    tim: {url: "https://repository.huygens.knaw.nl/v5/", name: "Huygens Timbuctoo"},
    gol: {url: "https://repository.goldenagents.org/v5/", name: "Golden Agents"}
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
let user_name = '';
let acceptedFiles = 0;
let startStatusIndex = 0;

function init() {
    //$("#login").html("Logged in");
    if ($("#repo").length) {
        $("#uploadMetadata").removeClass("noView");
        create_metadata('Repository', resources[$("#repo").val()].name);
        whoAmI($("#hsid").val());
    }
    if ($("#actiontype").length) {
        create_metadata('Action', selectAction($("#actiontype").val()));
        if (!$("#ds").length) {
            if ($("#actiontype").val() === "existing") {
                get_dataset_names();
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
        startSending(owner_id, files);

    }

}

async function startSending(owner_id, files) {
    const url = resources[$("#repo").val()].url + "graphql";
    const dataset = $("#ds").val();
    const hsid = $("#hsid").val();
    query = 'query {dataSetMetadata(dataSetId: "' + dataset + '") {dataSetImportStatus {id status source progress {label status progress} errorObjects {dateStamp file method message error}}}}';
    console.log(query);
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
        makePreparationsAndSend(json, owner_id, files);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

function makePreparationsAndSend(json, owner_id, files) {
    startStatusIndex = json.data.dataSetMetadata.dataSetImportStatus.length;
    for (var i = 0; i < files.length; i++) {
            const extension = files[i].name.split('.').slice(-1)[0];
            if (extension === 'gz') {
                fileType = files[i].name.split('.').slice(-2)[0];
                if (correct_mimetype(fileType)) {
                    createFileStatusLine(files[i]);
                    send_file(files[i], owner_id, $("#ds_name").val());
                } else {
                    create_metadata('Rejected file', files[i].name);
                }
            } else {
                createFileStatusLine(files[i]);
                send_file(files[i], owner_id, $("#ds_name").val());
            }
        }
        check_process();
}

async function check_process() {
    const url = resources[$("#repo").val()].url + "graphql";
    const dataset = $("#ds").val();
    const hsid = $("#hsid").val();
    query = 'query {dataSetMetadata(dataSetId: "' + dataset + '") {dataSetImportStatus {id status source progress {label status progress} errorObjects {dateStamp file method message error}}}}';
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
    let allExist = true;
    let status = 'DONE';
    for (var i = startStatusIndex; i < startStatusIndex + acceptedFiles; i++) {
        if (json.data.dataSetMetadata.dataSetImportStatus[i] !== undefined) {
            $("#" + json.data.dataSetMetadata.dataSetImportStatus[i].source.substring(37)).html(json.data.dataSetMetadata.dataSetImportStatus[i].status);
            if (json.data.dataSetMetadata.dataSetImportStatus[i].status !== 'DONE') {
                status = json.data.dataSetMetadata.dataSetImportStatus[i].status;
            } else {
                if (json.data.dataSetMetadata.dataSetImportStatus[i].errorObjects.length) {
                    $("#" + json.data.dataSetMetadata.dataSetImportStatus[i].source.substring(37)).html("ERROR! (File not imported)");
                    const errorMsg = json.data.dataSetMetadata.dataSetImportStatus[i].errorObjects[0].error.split("\n").join("<br/>");
                    $("#" + json.data.dataSetMetadata.dataSetImportStatus[i].source.substring(37) + "_error").html(errorMsg);
                }
            }
        } else {
            allExist = false;
        }
    }

    if (allExist && status === 'DONE') {
        $("#importHeader").html("Import completed");
        $("#spinner").remove();
    } else {
        setTimeout(check_process, 5000);
    }

}

function createFileStatusLine(file) {
    const codedFileName = file.name.split('.').join('_');
    let line = document.createElement('div');
    $(line).addClass("fileStatus");
    let cell = document.createElement('div');
    $(cell).addClass("fileStatusName");
    $(cell).html(file.name + ":");
    $(line).append(cell);
    cell = document.createElement('div');
    $(cell).addClass("progess");
    $(cell).attr("id", codedFileName);
    $(cell).html("UPLOADING");
    $(line).append(cell);
    $("#fileStatus").append(line);
    line = document.createElement('div');
    $(line).addClass("fileStatusError");
    $(line).attr("id", codedFileName + "_error");
    $("#fileStatus").append(line);

}

async function send_file(file, owner_id, datasetName) {
    const mimeType = getMimeType(file);
    const url = resources[$("#repo").val()].url + owner_id + "/" + datasetName + "/upload/rdf";
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
        create_metadata('Uploaded', file.name);
        //$("#uploadStatus").addClass("noView");
    }
    else {
        const paragragh = document.createElement("p");
        paragraph.html(response.statusText);
        $("#uploadError").append(paragraph);
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
        create_dataset($("#ds_name").val(), $("#hsid").val());
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
        for (var key in result.data.aboutMe.dataSetMetadataList) {
            var option = document.createElement('option');
            $(option).attr("value", result.data.aboutMe.dataSetMetadataList[key].dataSetId);
            $(option).html(result.data.aboutMe.dataSetMetadataList[key].dataSetName);
            $("#ds_select").append(option);
        }
    } else {
        console.log(response.statusText);
    }
}

async function create_dataset(name, hsid) {
    const query = "mutation {createDataSet(dataSetName: \"" + name + "\") {dataSetId dataSetName ownerId}}";
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