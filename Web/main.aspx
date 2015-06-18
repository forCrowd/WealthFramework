<!DOCTYPE html>
<html data-ng-app="main">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title data-ng-bind="'Wealth Economy' + (viewTitle !== '' ? ' - ' + viewTitle : '')"></title>
    <base href="/" />

    <!-- External CSS -->
    <link href="/Content/bootstrap.min.css?v=024" rel="stylesheet" />
    <link href="/Content/breeze.directives.css?v=024" rel="stylesheet" />
    <link href="/Content/toastr.css?v=024" rel="stylesheet" />

    <!-- Internal CSS -->
    <link href="/Content/site.css?v=030" rel="stylesheet" />
    <link href="/App/directives/resourcePoolEditor.css?v=028" rel="stylesheet" />

    <!-- jQuery -->
    <script src="/Scripts/jquery-2.1.4.min.js"></script>

    <!-- Modernizr - TODO Not in use at the moment -->
    <!--
    <script src="/Scripts/modernizr-2.8.3.js"></script>-->

    <!-- Google Analytics -->
    <script>
        (function (i, s, o, g, r, a, m) {
            //return;
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
                    <%--<span><img src="/Content/images/forCrowd_logo_20x20.jpg?v=0292" /></span>--%>
                    Wealth Economy
                </a>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li class="dropdown hide" data-dropdown>
                        <a href="" class="dropdown-toggle" data-dropdown-toggle>Content <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="/content/overview">Overview</a></li>
                            <li><a href="/content/technologies">Technologies</a></li>
                        </ul>
                    </li>
                    <li class="dropdown hide" data-dropdown data-ng-show="vm.isAuthenticated()">
                        <a href="" class="dropdown-toggle" data-dropdown-toggle>Manage <b class="caret"></b></a>
                        <!-- Manage Menu - Generated -->
                        <script src="/App/includes/manageMenu.js?v=027"></script>
                    </li>
                    <li data-ng-show="vm.isAuthenticated()">
                        <a href="/manage/custom/resourcePool">CMRP</a>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown" data-dropdown data-ng-if="vm.isAuthenticated()">
                        <a href="" class="dropdown-toggle" data-dropdown-toggle><span data-ng-bind="'User: ' + vm.currentUser.Email"></span><b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="/account/accountEdit">Edit</a></li>
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
                    <img src="/Content/images/forCrowd_logo_34x34.jpg?v=0292" class="brandLinkImage" />
                    <span class="brandLinkText">
                        <span class="brandLinkPrimary">forCrowd</span><br />
                        <span class="brandLinkSecondary">FOUNDATION</span>
                    </span>
                </a>
            </p>
        </footer>
    </div>

    <%--<script src="/Scripts/bootstrap.min.js?v=024"></script>--%>
    <script src="/Scripts/respond.min.js?v=024"></script>
    <script src="/Scripts/datajs-1.1.3.min.js?v=024"></script>
    <script src="/Scripts/toastr.min.js?v=024"></script>

    <script src="/Scripts/angular.min.js?v=024"></script>
    <script src="/Scripts/angular-route.min.js?v=024"></script>
    <script src="/Scripts/angular-sanitize.min.js?v=024"></script>

    <script src="/App/external/ui-bootstrap-tpls-0.13.0.min.js?v=030"></script>

    <script src="/Scripts/breeze.min.js?v=024"></script>
    <script src="/Scripts/breeze.bridge.angular.js?v=024"></script>
    <script src="/Scripts/breeze.directives.js?v=024"></script>

    <!-- Highcharts - TODO Try to find (or create) nuget package for these two -->
    <script src="/App/external/highcharts.js?v=024"></script>
    <script src="/App/external/highcharts-ng.js?v=024"></script>

    <!-- Main -->
    <script src="/App/main.js?v=030"></script>
    <script src="/App/logger.js?v=029"></script>
    <script src="/App/route.js?v=030"></script>
    <script src="/App/authorization.js?v=029"></script>

    <!-- Entities -->
    <script src="/App/entities/resourcePool.js?v=029"></script>
    <script src="/App/entities/element.js?v=030"></script>
    <script src="/App/entities/elementCell.js?v=029"></script>
    <script src="/App/entities/elementField.js?v=029"></script>
    <script src="/App/entities/elementItem.js?v=028"></script>
    <script src="/App/entities/userElementCell.js?v=027"></script>

    <!-- breezeJS -->
    <script src="/App/entityManagerFactory.js?v=027"></script>
    <script src="/App/dataContext.js?v=0292"></script>

    <script src="/App/services/mainService.js?v=022"></script>

    <!-- Manage Scripts - Generated (Services, Controllers) -->
    <script src="/App/includes/manageScripts.js?v=029"></script>

    <!-- Service extensions -->
    <script src="/App/services/userService.js?v=029"></script>
    <script src="/App/services/resourcePoolService.js?v=029"></script>

    <!-- Content -->
    <script src="/App/controllers/content/mainController.js?v=029"></script>
    <script src="/App/controllers/content/introductionController.js?v=029"></script>
    <script src="/App/controllers/content/basicsController.js?v=029"></script>
    <script src="/App/controllers/content/sectorIndexSampleController.js?v=029"></script>
    <script src="/App/controllers/content/knowledgeIndexSampleController.js?v=029"></script>
    <script src="/App/controllers/content/totalCostIndexSampleController.js?v=029"></script>
    <script src="/App/controllers/content/fairShareIndexSampleController.js?v=029"></script>
    <script src="/App/controllers/content/indexesPieSampleController.js?v=029"></script>
    <script src="/App/controllers/content/resourcePoolRateSampleController.js?v=029"></script>
    <script src="/App/controllers/content/closingNotesController.js?v=029"></script>

    <!-- Account -->
    <script src="/App/controllers/account/loginController.js?v=029"></script>
    <script src="/App/controllers/account/registerController.js?v=029"></script>
    <script src="/App/controllers/account/accountEditController.js?v=029"></script>
    <script src="/App/controllers/account/changePasswordController.js?v=022"></script>

    <!-- Manage Scripts - Custom -->
    <script src="/App/controllers/manage/resourcePool/resourcePoolCustomListController.js?v=022"></script>
    <script src="/App/controllers/manage/resourcePool/resourcePoolCustomViewController.js?v=027"></script>

    <!-- Directives -->
    <script src="/App/directives/resourcePoolEditor.js?v=030"></script>

    <!-- Filters -->
    <script src="/App/filters/angular-percentage.js?v=022"></script>

</body>
</html>
