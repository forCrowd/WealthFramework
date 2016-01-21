<!DOCTYPE html>
<html data-ng-app="main">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title data-ng-bind="'Wealth Economy' + (viewTitle !== '' ? ' - ' + viewTitle : '')"></title>
    <base href="/" />

    <!-- External CSS -->
    <link href="/bower_components/bootstrap/dist/css/bootstrap.min.css?v=0.42" rel="stylesheet" />
    <link href="/bower_components/font-awesome/css/font-awesome.min.css?v=0.42" rel="stylesheet" />
    <link href="/bower_components/breeze-client-labs/breeze.directives.css?v=0.42" rel="stylesheet" />
    <link href="/bower_components/toastr/toastr.min.css?v=0.42" rel="stylesheet" />
    <link href="/bower_components/bootstrap-social/bootstrap-social.css?v=0.42" rel="stylesheet" />

    <!-- Internal CSS -->
    <link href="/css/site.min.css?v=0.43" rel="stylesheet" />

    <!-- jQuery -->
    <script src="/bower_components/jquery/dist/jquery.min.js?v=0.42"></script>

</head>
<body data-ng-app="main" data-ng-controller="MainController as vm">
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
                    <li class="dropdown hide" data-uib-dropdown data-ng-show="vm.isAuthenticated()">
                        <a href="" class="dropdown-toggle" data-uib-dropdown-toggle>Manage <b class="caret"></b></a>
                        <!-- Manage Menu - Generated -->
                        <script src="/app/includes/manageMenu.js?v=0.37"></script>
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

    <!--<script src="/Scripts/bootstrap.min.js?v=0.37"></script>-->
    <!-- Is this useful, since bootstrap.min.js is commented out? -->
    <script src="/bower_components/respond/dest/respond.min.js?v=0.42"></script>
    
    <script src="/bower_components/datajs/datajs.min.js?v=0.42"></script>
    <script src="/bower_components/toastr/toastr.min.js?v=0.42"></script>

    <script src="/bower_components/angular/angular.min.js?v=0.42"></script>
    <script src="/bower_components/angular-route/angular-route.min.js?v=0.42"></script>
    <script src="/bower_components/angular-sanitize/angular-sanitize.min.js?v=0.42"></script>

    <!-- breeze -->
    <script src="/bower_components/breeze-client/build/breeze.min.js?v=0.42"></script>
    <script src="/bower_components/breeze-client/build/adapters/breeze.bridge.angular.js?v=0.42"></script>
    <script src="/bower_components/breeze-client-labs/breeze.directives.js?v=0.42"></script>

    <!-- Angular Google Analytics -->
    <script src="bower_components/angular-google-analytics/dist/angular-google-analytics.min.js?v=0.43"></script>

    <!-- Angular UI -->
    <script src="/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js?v=0.42"></script>

    <!-- Highcharts -->
    <script src="/bower_components/highcharts/highcharts.js?v=0.42"></script>
    <script src="/bower_components/highcharts-ng/dist/highcharts-ng.min.js?v=0.42"></script>

    <!-- App -->
    <script src="/app/main.min.js?v=0.43"></script>

    <!-- Settings -->
    <script src="/app/settings/serviceAppUrl.js?v=0.43"></script>
    <script src="/app/settings/googleAnalytics.js?v=0.43"></script>

</body>
</html>
