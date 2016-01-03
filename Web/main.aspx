<!DOCTYPE html>
<html data-ng-app="main">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title data-ng-bind="'Wealth Economy' + (viewTitle !== '' ? ' - ' + viewTitle : '')"></title>
    <base href="/" />

    <!-- External CSS -->
    <link href="/Content/bootstrap.min.css?v=0.35.1" rel="stylesheet" />
    <link href="/Content/breeze.directives.css?v=0.24" rel="stylesheet" />
    <link href="/Content/toastr.css?v=0.24" rel="stylesheet" />

    <!-- Internal CSS -->
    <link href="/Content/site.css?v=0.37" rel="stylesheet" />
    <link href="/App/directives/resourcePoolEditor/resourcePoolEditor.css?v=0.37" rel="stylesheet" />

    <!-- jQuery -->
    <script src="/Scripts/jquery-2.1.4.min.js"></script>

    <!-- Modernizr - TODO Not in use at the moment -->
    <!--
    <script src="/Scripts/modernizr-2.8.3.js"></script>-->

    <!-- Google Analytics -->
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-62498767-2', 'auto');
        ga('send', 'pageview');

    </script>
</head>
<body data-ng-app="main" data-ng-controller="mainController as vm">
    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a href="/" class="navbar-brand">
                    <!--<span><img src="/Content/images/forCrowd_logo_20x20.jpg?v=0.29.2" /></span>-->
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
                        <script src="/App/includes/manageMenu.js?v=0.37"></script>
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
                            <li><a href="/account/changePassword">Change password</a></li>
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
                    <img src="/Content/images/forCrowd_logo_34x34.jpg?v=0.29.2" class="brandLinkImage" />
                    <span class="brandLinkText">
                        <span class="brandLinkPrimary">forCrowd</span><br />
                        <span class="brandLinkSecondary">FOUNDATION</span>
                    </span>
                </a>
            </p>
        </footer>
    </div>

    <!--<script src="/Scripts/bootstrap.min.js?v=0.37"></script>-->
    <script src="/Scripts/respond.min.js?v=0.24"></script>
    <script src="/Scripts/datajs-1.1.3.min.js?v=0.24"></script>
    <script src="/Scripts/toastr.min.js?v=0.24"></script>

    <script src="/Scripts/angular.min.js?v=0.35.1"></script>
    <script src="/Scripts/angular-route.min.js?v=0.35.1"></script>
    <script src="/Scripts/angular-sanitize.min.js?v=0.35.1"></script>

    <!-- Angular UI -->
    <script src="/Scripts/angular-ui/ui-bootstrap-tpls.min.js?v=0.37"></script>

    <!-- breeze -->
    <script src="/Scripts/breeze.min.js?v=0.24"></script>
    <script src="/Scripts/breeze.bridge.angular.js?v=0.24"></script>
    <script src="/Scripts/breeze.directives.js?v=0.24"></script>

    <!-- Highcharts -->
    <script src="/Scripts/highcharts/4.1.5/highcharts.js?v=0.37"></script>
    <!-- TODO Try to find (or create) nuget package for this - or wait for ASP.NET 5 & bower? -->
    <script src="/App/external/highcharts-ng.js?v=0.37"></script>

    <!-- Main -->
    <script src="/App/main.js?v=0.39"></script>
    <script src="/App/logger.js?v=0.40"></script>
    <script src="/App/route.js?v=0.41"></script>
    <script src="/App/authorization.js?v=0.29"></script>
    <script src="/App/exceptionHandlerExtension.js?v=0.39"></script>

    <!-- Entities -->
    <script src="/App/entities/ResourcePool.js?v=0.40"></script>
    <script src="/App/entities/Element.js?v=0.40"></script>
    <script src="/App/entities/ElementCell.js?v=0.40"></script>
    <script src="/App/entities/ElementField.js?v=0.40"></script>
    <script src="/App/entities/ElementItem.js?v=0.40"></script>
    <script src="/App/entities/UserElementCell.js?v=0.40"></script>
    <script src="/App/entities/Enums.js?v=0.37"></script>
    <script src="/App/entities/LocationItem.js?v=0.38"></script>

    <!-- breezeJS -->
    <script src="/App/entityManagerFactory.js?v=0.37"></script>
    <script src="/App/dataContext.js?v=0.41"></script>
    <script src="/App/factories/mainFactory.js?v=0.37"></script>

    <!-- Manage Scripts - Generated (Factories, Controllers) -->
    <script src="/App/includes/manageScripts.js?v=0.37"></script>

    <!-- Factory extensions -->
    <script src="/App/factories/userFactory.js?v=0.41"></script>
    <script src="/App/factories/resourcePoolFactory.js?v=0.40"></script>

    <!-- Content -->
    <script src="/App/controllers/content/mainController.js?v=0.41"></script>
    <script src="/App/controllers/content/introductionController.js?v=0.40"></script>
    <script src="/App/controllers/content/basicsController.js?v=0.38"></script>
    <script src="/App/controllers/content/sectorIndexSampleController.js?v=0.37"></script>
    <script src="/App/controllers/content/knowledgeIndexSampleController.js?v=0.37"></script>
    <script src="/App/controllers/content/totalCostIndexSampleController.js?v=0.37"></script>
    <script src="/App/controllers/content/fairShareIndexSampleController.js?v=0.37"></script>
    <script src="/App/controllers/content/indexesPieSampleController.js?v=0.37"></script>
    <script src="/App/controllers/content/resourcePoolRateSampleController.js?v=0.29"></script>
    <script src="/App/controllers/content/closingNotesController.js?v=0.37"></script>

    <!-- Resource Pool -->
    <script src="/App/controllers/resourcePool/resourcePoolEditController.js?v=0.40"></script>
    <script src="/App/controllers/resourcePool/resourcePoolListController.js?v=0.37"></script>
    <script src="/App/controllers/resourcePool/resourcePoolViewController.js?v=0.38"></script>

    <!-- Account -->
    <script src="/App/controllers/account/registerController.js?v=0.40"></script>
    <script src="/App/controllers/account/loginController.js?v=0.38.4"></script>
    <script src="/App/controllers/account/externalLoginController.js?v=0.41"></script>
    <script src="/App/controllers/account/accountEditController.js?v=0.40"></script>
    <script src="/App/controllers/account/changeEmailController.js?v=0.40"></script>
    <script src="/App/controllers/account/changePasswordController.js?v=0.37"></script>
    <script src="/App/controllers/account/confirmEmailController.js?v=0.41"></script>

    <!-- Directives -->
    <script src="/App/directives/resourcePoolEditor/resourcePoolEditor.js?v=0.40"></script>

    <!-- Filters -->
    <script src="/App/filters/angular-enum.js?v=0.37"></script>
    <script src="/App/filters/angular-numberSymbol.js?v=0.36.1"></script>
    <script src="/App/filters/angular-percentage.js?v=0.22"></script>

</body>
</html>
