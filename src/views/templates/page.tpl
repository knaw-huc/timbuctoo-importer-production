<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Timbuctoo Dataset Uploader</title>
    <link rel="stylesheet" href="{$home_path}css/tu.css" type="text/css" />
    <script src="{$home_path}js/jquery-3.5.1.min.js"></script>
    <script src="{$home_path}js/tu.js"></script>
    {if $logged_in}
        <script>
            $('document').ready(function(){literal}{{/literal}
                init();
                {literal}}{/literal});
        </script>
    {/if}
</head>
<body>
<div id="header"><a href="#" onclick="goHome()"><img id="logo" alt="logo huygens ING" src="{$home_path}img/huygens.png"></a>
<div id="login">{if !$logged_in}<div id="loginBtn" onclick="login()">Login</div>{else}{if isset($repo)}<div id="loginBtn" onclick="myDatasets()">My datasets</div>{/if}{/if}</div>
</div>
<div id="content">
    {$content}
</div>
<div id="uploadMetadata" class="noView">

</div>
</div>
<div id="powered"><img alt="Powered by Timbuctoo" src="{$home_path}img/powered.png"></div>
</body>
</html>