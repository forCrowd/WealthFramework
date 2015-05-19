<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Wealth Economy - 404</title>

    <!-- External CSS -->
    <link href="/Content/bootstrap.css" rel="stylesheet" />
    <link href="/Content/breeze.directives.css" rel="stylesheet" />
    <link href="/Content/toastr.css" rel="stylesheet" />

    <!-- Internal CSS -->
    <link href="/Content/site.css?v=022" rel="stylesheet" />
    <link href="/App/directives/resourcePoolEditor.css?v=022" rel="stylesheet" />

    <script language="c#" runat="server">
    public void Page_Init(object sender, EventArgs e)
    {
        Response.StatusCode = 404;
    }
    </script>
</head>
<body>
    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a href="/" class="navbar-brand">Wealth Economy</a>
            </div>
        </div>
    </div>
    <div class="container body-content">

        <div class="page-header">
            <h1>Are you lost?</h1>
            <!--<h1>404</h1>
                <h2>Not found</h2>-->
        </div>
        <div class="row">
            <div class="col-md-12">
                <p>
                    The page you were looking for appears to have been moved, deleted or does not exist.<br />
                    Wanna go back to our <a href="/">home</a> page?
                </p>
            </div>
        </div>

        <hr />
        <footer>
            <p>
                forCrowd Foundation<br />
            </p>
        </footer>
    </div>

    <script src="/Scripts/bootstrap.js"></script>
    <script src="/Scripts/respond.js"></script>

</body>
</html>
