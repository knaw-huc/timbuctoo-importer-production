<div id="welcome" xmlns="http://www.w3.org/1999/html">
    <label>Dataset</label>
    <table id="datasetTable">
        <tr><td class="fieldLabel">ID</td><td id="dsdID"></td></tr>
        <tr><td class="fieldLabel">Name</td><td id="dsdName"></td></tr>
        <tr><td class="fieldLabel">Title</td><td><input id="dsdTitle" type="text" size="100"/></td></tr>
        <tr><td class="fieldLabel">Description</td><td><input id="dsdDescription" type="text" size="100"/></td></tr>
        <tr><td class="dsTableHeader" colspan="2">Owner</td></tr>
        <tr><td class="fieldLabel">Name</td><td><input id="dsdOwnerName" type="text" size="80"/></td></tr>
        <tr><td class="fieldLabel">Email</td><td><input id="dsdOwnerEmail" type="text" size="60"/></td></tr>
        <tr><td  class="dsTableHeader"colspan="2">Contact</td></tr>
        <tr><td class="fieldLabel">Name</td><td><input id="dsdContactName" type="text" size="80"/></td></tr>
        <tr><td class="fieldLabel">Email</td><td><input id="dsdContactEmail" type="text" size="60"/></td></tr>
        <tr><td  class="dsTableHeader"colspan="2">Provenance</td></tr>
        <tr><td class="fieldLabel">Title</td><td><input id="dsdProvenanceTitle" type="text" size="80"/></td></tr>
        <tr><td class="fieldLabel">Body</td><td><textarea id="dsdProvenanceBody" rows="8" cols="60"></textarea></td></tr>
    </table>
    <div id="buttonConsole">
        <button onclick="myDatasets()">Back</button>
        <button onclick="sendDataSetData()">Submit</button>
    </div>
    <input type="hidden" id="hsid" name="hsid" value="{$hsid}">
    <input type="hidden" id="repo" name="repo" value="{$repo}">
    <input type="hidden" id="actiontype" name="actiontype" value="{$actiontype}">
    <input type="hidden" id="dataset_id" name="dataset_id" value="{$dataset_id}">
</div>