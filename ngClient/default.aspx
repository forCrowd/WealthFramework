<!DOCTYPE html>
<html>
<head>
    <title data-ng-bind="'Wealth Economy' + (viewTitle !== '' ? ' - ' + viewTitle : '')"></title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <base href="/" />

    <!-- Favicon -->
    <link rel="shortcut icon" href="/favicon.ico?v=0.65.0" />
    <!-- lib.css -->
    <link href="/_system/css/lib/lib.min.css?v=0.65.0" rel="stylesheet" />
    <!-- app.css -->
    <link href="/_system/css/app.min.css?v=0.65.0" rel="stylesheet" />

    <!-- externals -->
    <script src="/node_modules/core-js/client/shim.min.js"></script>
    <script src="/node_modules/zone.js/dist/zone.js"></script>
    <script src="/node_modules/reflect-metadata/Reflect.js"></script>
    <script src="/node_modules/systemjs/dist/system.src.js"></script>

    <script src="/node_modules/highcharts/highcharts.src.js"></script>
    <script src="/node_modules/respond.js/dest/respond.src.js"></script>
    <script src="/node_modules/source-map/dist/source-map.js"></script>

    <script src="/systemjs.config.js"></script>
    <script>
        System.import('app')
            .catch(function (err) {
                console.error(err);
            });
    </script>
</head>
<body data-ng-controller="defaultController as vm">
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a href="/" class="navbar-brand">Wealth Economy
                </a>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li>
                        <a data-ng-href="/{{ vm.currentUser.UserName }}/new"><span class="fa fa-plus fa-lg g-mr-5" aria-hidden="true"></span>Create New</a>
                    </li>
                    <li>
                        <a href="/_system/resourcePool/search"><span class="fa fa-search fa-lg g-mr-5" aria-hidden="true"></span>Search</a>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li data-ng-show="!vm.currentUser.isAuthenticated()">
                        <div class="navbar-text nofloat">
                            <a href="/_system/account/register">Register</a>
                            <a href="/_system/account/login" class="g-ml-20">Login</a>
                        </div>
                    </li>
                    <li data-ng-show="vm.guestAccountInfoVisible">
                        <a href="" data-ng-click="vm.openGuestAccountInfo()"><span class="fa fa-info-circle fa-lg" aria-hidden="true"></span></a>
                    </li>
                    <li data-ng-show="vm.currentUser.isAuthenticated()" class="dropdown" data-uib-dropdown>
                        <a href="" class="dropdown-toggle" data-uib-dropdown-toggle><span data-ng-bind="'User: ' + vm.currentUserText()"></span><b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a data-ng-href="/{{ vm.currentUser.UserName }}">Profile</a></li>
                            <li><a href="/_system/account">Account</a></li>
                            <li><a href="" data-ng-click="vm.logout()">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container body-content">
        <div data-ng-view></div>

        <div class="row">
            <div class="col-md-12">
                <div data-ng-show="vm.disqusConfig.disqus_identifier !== ''">
                    <hr />
                    <dir-disqus config="vm.disqusConfig"></dir-disqus>
                </div>
            </div>
        </div>
    </div>

    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <hr />
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="contacts pull-left">
                        <a href="http://forcrowd.org" target="_blank">
                            <img src="/_system/images/forCrowd_Logo_142x30.jpg?v=0.65.0" alt="Logo" />
                        </a>
                        <a href="https://twitter.com/forCrowd" target="_blank" class="g-ml-40">
                            <i class="fa fa-twitter fa-lg" aria-hidden="true"></i>
                        </a>
                        <a href="https://github.com/forCrowd/WealthEconomy" target="_blank" class="g-ml-20">
                            <i class="fa fa-github fa-lg" aria-hidden="true"></i>
                        </a>
                        <a href="https://gitter.im/forCrowd/WealthEconomy" target="_blank" class="g-ml-20">
                            <i class="fa fa-git fa-lg" aria-hidden="true"></i>
                        </a>
                        <a href="mailto:contact.wealth@forcrowd.org" target="_blank" class="g-ml-20">
                            <i class="fa fa-envelope fa-lg" aria-hidden="true"></i>
                        </a>
                    </div>
                    <div class="pull-right">
                        <a href="/_system/content/contributors">Contributors</a><br />
                        <small>Version: <span data-ng-bind="vm.applicationInfo.CurrentVersion"></span>- Alpha ~ Beta</small>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
