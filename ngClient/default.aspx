<!DOCTYPE html>
<html data-ng-app="main">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title data-ng-bind="'Wealth Economy' + (viewTitle !== '' ? ' - ' + viewTitle : '')"></title>
    <base href="/" />

    <!-- lib.css -->
    <link href="/css/lib/lib.min.css?v=0.43.2" rel="stylesheet" />

    <!-- app.css -->
    <link href="/css/app.min.css?v=0.43.2" rel="stylesheet" />

</head>
<body data-ng-controller="DefaultController as vm">
    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a href="/" class="navbar-brand">
                    <!--<span><img src="/images/forCrowd_logo_20x20.jpg?v=0.29.2" /></span>-->
                    Wealth Economy
                </a>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li class="dropdown hide" data-uib-dropdown>
                        <a href="" class="dropdown-toggle" data-uib-dropdown-toggle>Content <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="/content/overview">Overview</a></li>
                            <li><a href="/content/technologies">Technologies</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="/resourcePool">CMRP</a>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown" data-uib-dropdown data-ng-if="vm.isAuthenticated()">
                        <a href="" class="dropdown-toggle" data-uib-dropdown-toggle><span data-ng-bind="vm.currentUserText()"></span><b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="/account/accountEdit">Edit</a></li>
                            <li><a href="/account/changeEmail">Change email</a></li>
                            <li><a href="/account/confirmEmail" data-ng-if="!vm.currentUser.EmailConfirmed">Confirm email</a></li>
                            <li data-ng-if="vm.hasPassword()"><a href="/account/changePassword">Change password</a></li>
                            <li data-ng-if="!vm.hasPassword()"><a href="/account/addPassword">Add password</a></li>
                            <li><a href="" data-ng-click="vm.logout()">Logout</a></li>
                        </ul>
                    </li>
                    <li data-ng-if="!vm.isAuthenticated()">
                        <div class="navbar-text nofloat">
                            <a href="/account/register">Register</a>
                            &nbsp;
                            <a href="/account/login">Login</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="container body-content">

        <div data-ng-view></div>

        <hr />
        <footer>
            <p class="small">
                <span data-ng-bind="vm.applicationInfo.CurrentVersionText"></span>
            </p>
            <p class="brandLink">
                <a href="http://forcrowd.org" target="_blank">
                    <img src="/images/forCrowd_logo_34x34.jpg?v=0.29.2" class="brandLinkImage" />
                    <span class="brandLinkText">
                        <span class="brandLinkPrimary">forCrowd</span><br />
                        <span class="brandLinkSecondary">FOUNDATION</span>
                    </span>
                </a>
            </p>
        </footer>
    </div>

    <!-- lib.js -->
    <script src="/js/lib/lib.min.js?v=0.43.2"></script>

    <!-- app.js -->
    <script src="/js/app/app.min.js?v=0.43.4"></script>

    <!-- appSettings -->
    <script src="/js/appSettings/appSettings.js?v=0.43.2"></script>

</body>
</html>
