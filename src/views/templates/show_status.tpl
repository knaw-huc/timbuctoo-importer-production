<div id="welcome">
    <form id="status_form">
        <input type="hidden" id="hsid" name="hsid" value="{$hsid}">
        <input type="hidden" id="repo" name="repo" value="{$repo}">
        <input type="hidden" id="actiontype" name="actiontype" value="{$actiontype}">
        <input type="hidden" id="dataset_id" name="dataset_id" value="{$dataset_id}">
    </form>
    <div id="uploadStatus">
        <div id="uploadProgress">
            <p id="importHeader">Timbuctoo processing file(s)</p>
            <img id="spinner" src="img/spinner.gif"><br/>
            <div id="fileStatus"></div>
            <div id="uploadError" class="errorMsg">

            </div>
        </div>
    </div>
</div>