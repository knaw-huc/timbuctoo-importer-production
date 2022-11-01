<div id="welcome">
    <form id="upload_form">
        <label>Step 1: Select repository</label>
        <select id="resource">
            <option value="loc">Local Timbuctoo</option>
            <option value="tim">Huygens Timbuctoo</option>
            <option value="gol">Golden Agents</option>
        </select>
        <br/>
        <input id="submitBtn" type="button" value="Next" onclick="process_repo()">
        <input type="hidden" id="hsid" value="{$hsid}">
    </form>
</div>