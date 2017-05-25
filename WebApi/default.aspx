<!DOCTYPE html>
<html>
<head>
    <title>Wealth Economy API</title>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="favicon.ico?v=0.55.0" />
    <script src="googleanalytics.js"></script>
</head>
<body>
    <header>
        <h1>Wealth Economy API
        </h1>
    </header>
    <p>
        <!--TODO Create sort of api help page?-->
    </p>
    <footer>
        <p>
            <span><%= System.Diagnostics.FileVersionInfo.GetVersionInfo(Reflection.Assembly.GetAssembly(New forCrowd.WealthEconomy.WebApi.Controllers.Api.WebApiInfo().GetType()).Location).ProductVersion %></span>
        </p>
        <p>
            <a href="http://forcrowd.org" target="_blank">forCrowd Foundation
            </a>
        </p>
    </footer>
</body>
</html>
