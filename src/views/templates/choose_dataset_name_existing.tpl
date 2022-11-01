<div id="welcome">
    <form id="upload_form" method="get" action="{$home_path}index.php">
        <label>Step 3: Select dataset</label>
        <select id="ds_select" name="ds">

        </select>
<br/>
        <input type="button" value="Back" onclick="history.back()">&nbsp;
        <input id="submitBtn" type="submit" value="Next">
        <input type="hidden" id="hsid" name="hsid" value="{$hsid}">
        <input type="hidden" id="repo" name="repo" value="{$repo}">
        <input type="hidden" id="actiontype" name="actiontype" value="{$actiontype}">
    </form>
</div>