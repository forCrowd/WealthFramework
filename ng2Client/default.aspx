<!DOCTYPE html>
<html>
<head>
    <title>Wealth Economy</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="/" />

    <link rel="shortcut icon" href="/favicon.ico?v=0.65.0" />
    <link href="/app/css/lib/lib.min.css?v=0.65.1" rel="stylesheet" />
    <link href="/app/css/app.min.css?v=0.65.0" rel="stylesheet" />
</head>
<body>
    <app>
        
    </app>

    <script src="/app/lib.min.js?v=0.65.0"></script>
    <!-- build:publish-default-aspx -->
    <!-- This block will be replaced during "publish" tasks in gulpfile with "app.min.js" script -->
    <%--<script src="/app/app.min.js?v=0.66.0"></script>--%>
    <script src="/systemjs.config.js?v=0.66.0"></script>
    <script>
        System.import("app")
            .catch(function (error) {
                console.error(error);
            });
    </script>
    <!-- endbuild -->
</body>
</html>
