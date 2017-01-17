<!DOCTYPE html>
<html>
<head>
    <title>Wealth Economy</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="/" />

    <link rel="shortcut icon" href="/favicon.ico?v=0.65.0" />
    <link href="/app/css/app.min.css?v=0.67.0" rel="stylesheet" />
</head>
<body>
    <app>
        
    </app>

    <script>window.module = "aot";</script>
    <!-- build:publish-default-aspx -->
    <!-- This block will be replaced with "app.min.js" script during "build" tasks in gulpfile -->
    <%--<script src="/app/app.min.js"></script>--%>
    <script src="/app/lib.js"></script>
    <script src="/node_modules/reflect-metadata/Reflect.js"></script>
    <script src="/node_modules/systemjs/dist/system.src.js"></script>
    <script src="/systemjs.config.js"></script>
    <script>
        System.import("app")
            .catch(function (error) {
                console.error(error);
            });
    </script>
    <!-- endbuild -->
</body>
</html>
