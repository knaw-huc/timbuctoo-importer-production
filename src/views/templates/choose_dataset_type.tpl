<div id="welcome">
    <form id="upload_form" method="get" action="{$home_path}index.php">
        <label>Step 2: Choose action</label>
        <div id="radioDiv">
        <input type="radio" checked value="new" name="actiontype" id="new"><span class="radioSpan"> Upload data to a new dataset</span><br/>
        <input type="radio" value="existing" name="actiontype" id="existing"><span class="radioSpan"> Upload data to an existing dataset</span><br/>
        </div>
        <input type="button" value="Back" onclick="history.back()">&nbsp;
        <input id="submitBtn" type="submit" value="Next">
        <input type="hidden" name="hsid" id="hsid" value="{$hsid}">
        <input type="hidden" name="repo" id="repo" value="{$repo}">
    </form>
</div>