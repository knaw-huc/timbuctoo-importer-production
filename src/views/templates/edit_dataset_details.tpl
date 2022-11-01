<div id="welcome" xmlns="http://www.w3.org/1999/html">
    <label>Dataset</label>
    <table id="datasetTable">
        <tr><td class="fieldLabel">ID</td><td id="dsdID"></td></tr>
        <tr><td class="fieldLabel">Name</td><td id="dsdName"></td></tr>
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