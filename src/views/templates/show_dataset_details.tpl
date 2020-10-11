<div id="welcome">
    <label>Dataset</label>
    <table id="datasetTable">
        <tr><td class="fieldLabel">ID</td><td id="dsdID"></td></tr>
        <tr><td class="fieldLabel">Name</td><td id="dsdName"></td></tr>
        <tr><td class="fieldLabel">Title</td><td id="dsdTitle"></td></tr>
        <tr><td class="fieldLabel">Description</td><td id="dsdDescription"></td></tr>
        <tr><td class="dsTableHeader" colspan="2">Owner</td></tr>
        <tr><td class="fieldLabel">Name</td><td id="dsdOwnerName"></td></tr>
        <tr><td class="fieldLabel">Email</td><td id="dsdOwnerEmail"></td></tr>
        <tr><td  class="dsTableHeader"colspan="2">Contact</td></tr>
        <tr><td class="fieldLabel">Name</td><td id="dsdContactName"></td></tr>
        <tr><td class="fieldLabel">Email</td><td id="dsdContactEmail"></td></tr>
        <tr><td  class="dsTableHeader"colspan="2">Provenance</td></tr>
        <tr><td class="fieldLabel">Title</td><td id="dsdProvenanceTitle"></td></tr>
        <tr><td class="fieldLabel">Body</td><td id="dsdProvenanceBody"></td></tr>
    </table>
    <div id="buttonConsole">
        <button onclick="myDatasets()">Back</button>
        <button onclick="editDataset()">Edit</button>
        <button onclick="delete_dataset()">Delete</button>
    </div>
    <input type="hidden" id="hsid" name="hsid" value="{$hsid}">
    <input type="hidden" id="repo" name="repo" value="{$repo}">
    <input type="hidden" id="actiontype" name="actiontype" value="{$actiontype}">
    <input type="hidden" id="dataset_id" name="dataset_id" value="{$dataset_id}">
</div>