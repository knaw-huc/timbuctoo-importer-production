<div id="welcome">
    <form id="upload_form" method="get" action="{$home_path}index.php">
        <label>Step 3: Create new dataset</label>
        <span class="label">Name:</span>
        <input type="text" id="ds_name" name="name" size="40"  placeholder="Only lowercase, digits and underscores allowed">
        <div id="nameError" class="errorMsg"></div>
        <span class="label">Base URI (optional):</span>
        <input type="text" id="ds_baseuri" name="baseuri" size="40">
        <br/>
        <input type="button" value="Back" onclick="history.back()">&nbsp;
        <input id="submitBtn" type="button" value="Next" onclick="validateName()">
        <input type="hidden" id="hsid" name="hsid" value="{$hsid}">
        <input type="hidden" id="repo" name="repo" value="{$repo}">
        <input type="hidden" id="actiontype" name="actiontype" value="{$actiontype}">
    </form>
</div>