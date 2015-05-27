<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Wealth Economy</title>
    <base href="/" />

    <!-- External CSS -->
    <link href="/Content/bootstrap.min.css?v=024" rel="stylesheet" />
    <link href="/Content/breeze.directives.css?v=024" rel="stylesheet" />
    <link href="/Content/toastr.css?v=024" rel="stylesheet" />

    <!-- Internal CSS -->
    <link href="/Content/site.css?v=022" rel="stylesheet" />
    <link href="/App/directives/resourcePoolEditor.css?v=022" rel="stylesheet" />

    <!-- jQuery -->
    <script src="/Scripts/jquery-2.1.4.min.js"></script>

    <!-- Modernizr - TODO Not in use at the moment -->
    <!--
    <script src="/Scripts/modernizr-2.8.3.js"></script>-->

</head>
<body data-ng-app="main" data-ng-controller="mainController as vm">
    <!-- propertyTests -->
    <div class="hide">
        <div>
            {{ vm.resourcePool2.testField }}
        </div>
        <div>
            {{ vm.resourcePool2.testPropOnlyGet }}
        </div>
        <div>
            {{ vm.resourcePool2.testProp }}
        </div>
        <div>
            {{ vm.resourcePool2.testPropGetSet }}
        </div>
        <div>
            {{ vm.resourcePool2.testPropWithEnumConf }}
        </div>
        <div>
            {{ vm.resourcePool2.testPropWithEnumConfBack }}
        </div>
        <div>
            {{ vm.resourcePool2.testPropWithEnumConfProt }}
        </div>
        <div>
            {{ vm.resourcePool2.testPropWithEnumConfProtBack }}
        </div>
        <hr />
        <div>
            {{ vm.resourcePool3.testField }}
        </div>
        <div>
            {{ vm.resourcePool3.testPropOnlyGet }}
        </div>
        <div>
            {{ vm.resourcePool3.testProp }}
        </div>
        <div>
            {{ vm.resourcePool3.testPropGetSet }}
        </div>
        <div>
            {{ vm.resourcePool3.testPropWithEnumConf }}
        </div>
        <div>
            {{ vm.resourcePool3.testPropWithEnumConfBack }}
        </div>
        <div>
            {{ vm.resourcePool3.testPropWithEnumConfProt }}
        </div>
        <div>
            {{ vm.resourcePool3.testPropWithEnumConfProtBack }}
        </div>
    </div>
    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a href="/" class="navbar-brand">Wealth Economy</a>
                <%--<span class="navbar-brand"><span class="small">BETA</span></span>--%>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li class="dropdown hide">
                        <a href="" class="dropdown-toggle" data-toggle="dropdown">Content <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="/content/overview">Overview</a></li>
                            <li><a href="/content/technologies">Technologies</a></li>
                        </ul>
                    </li>
                    <li class="dropdown hide">
                        <a href="" class="dropdown-toggle" data-toggle="dropdown">Chapters <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="/content/chapter0">Prologue</a></li>
                            <li><a href="/content/chapter1">Chapter 1</a></li>
                            <li><a href="/content/chapter2">Chapter 2</a></li>
                            <li><a href="/content/chapter3">Chapter 3</a></li>
                            <li><a href="/content/chapter4">Chapter 4</a></li>
                            <li><a href="/content/chapter5">Chapter 5</a></li>
                            <li><a href="/content/chapter6">Chapter 6</a></li>
                            <li><a href="/content/chapter7">Chapter 7</a></li>
                            <li><a href="/content/chapter8">Chapter 8</a></li>
                            <li><a href="/content/chapter9">Chapter 9</a></li>
                            <li><a href="/content/chapter10">Chapter 10</a></li>
                        </ul>
                    </li>
                    <li class="dropdown hide" data-ng-show="vm.userInfo !== null">
                        <a href="" class="dropdown-toggle" data-toggle="dropdown">Manage <b class="caret"></b></a>
                        <!-- Manage Menu - Generated -->
                        <script src="/App/includes/manageMenu.js"></script>
                    </li>
                    <li class="dropdown" data-ng-show="vm.userInfo !== null">
                        <a href="/manage/custom/resourcePool">CMRP</a>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown" data-ng-if="(vm.userInfo !== null)">
                        <a href="" class="dropdown-toggle" data-toggle="dropdown">User: {{ vm.userInfo.Email }} <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="/account/accountEdit">Edit</a></li>
                            <li><a href="/account/changePassword">Change password</a></li>
                            <li><a href="" data-ng-click="vm.logout()">Logout</a></li>
                        </ul>
                    </li>
                    <li data-ng-if="vm.userInfo === null">
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
                {{ vm.applicationInfo.CurrentVersion }} - Beta<br />
                {{ vm.applicationInfo.Organization }}<br />
            </p>
        </footer>
    </div>

    <script src="/Scripts/bootstrap.min.js?v=024"></script>
    <script src="/Scripts/respond.min.js?v=024"></script>

    <script src="/Scripts/angular.min.js?v=024"></script>
    <script src="/Scripts/angular-route.min.js?v=024"></script>
    <script src="/Scripts/angular-sanitize.min.js?v=024"></script>
    <script src="/Scripts/datajs-1.1.3.min.js?v=024"></script>
    <script src="/Scripts/toastr.min.js?v=024"></script>

    <script src="/Scripts/breeze.min.js?v=024"></script>
    <script src="/Scripts/breeze.bridge.angular.js?v=024"></script>
    <script src="/Scripts/breeze.directives.js?v=024"></script>

    <!-- Highcharts - TODO Try to find (or create) nuget package for these two -->
    <script src="/App/external/highcharts.js?v=024"></script>
    <script src="/App/external/highcharts-ng.js?v=024"></script>

    <!-- Main -->
    <script src="/App/main.js?v=022"></script>
    <script src="/App/logger.js?v=022"></script>
    <script src="/App/route.js?v=026"></script>
    <script src="/App/authorization.js?v=022"></script>

    <!-- Entities -->
    <script src="/App/entities/resourcePool.js?v=0224"></script>
    <script src="/App/entities/element.js?v=025"></script>
    <script src="/App/entities/elementCell.js?v=025"></script>
    <script src="/App/entities/elementField.js?v=022"></script>
    <script src="/App/entities/elementFieldIndex.js?v=025"></script>
    <script src="/App/entities/elementItem.js?v=025"></script>

    <!-- breezeJS -->
    <script src="/App/entityManagerFactory.js?v=022"></script>
    <script src="/App/dataContext.js?v=026"></script>

    <script src="/App/services/mainService.js?v=022"></script>

    <!-- Manage Scripts - Generated (Services, Controllers) -->
    <script src="/App/includes/manageScripts.js?v=0224"></script>

    <!-- Service extensions -->
    <script src="/App/services/userService.js?v=026"></script>
    <script src="/App/services/resourcePoolService.js?v=026"></script>

    <!-- Content -->
    <script src="/App/controllers/content/mainController.js?v=024"></script>
    <script src="/App/controllers/content/introductionController.js?v=0223"></script>
    <script src="/App/controllers/content/basicsController.js?v=0224"></script>
    <script src="/App/controllers/content/sectorIndexSampleController.js?v=022"></script>
    <script src="/App/controllers/content/knowledgeIndexSampleController.js?v=022"></script>
    <script src="/App/controllers/content/totalCostIndexSampleController.js?v=022"></script>
    <script src="/App/controllers/content/fairShareIndexSampleController.js?v=022"></script>
    <script src="/App/controllers/content/indexesPieSampleController.js?v=022"></script>
    <script src="/App/controllers/content/resourcePoolRateSampleController.js?v=022"></script>
    <script src="/App/controllers/content/closingNotesController.js?v=026"></script>

    <!-- Account -->
    <script src="/App/controllers/account/loginController.js?v=022"></script>
    <script src="/App/controllers/account/registerController.js?v=022"></script>
    <script src="/App/controllers/account/accountEditController.js?v=022"></script>
    <script src="/App/controllers/account/changePasswordController.js?v=022"></script>

    <!-- Manage Scripts - Custom -->
    <script src="/App/controllers/manage/resourcePool/resourcePoolCustomListController.js?v=022"></script>
    <script src="/App/controllers/manage/resourcePool/resourcePoolCustomViewController.js?v=022"></script>

    <!-- Directives -->
    <script src="/App/directives/resourcePoolEditor.js?v=026"></script>

    <!-- Filters -->
    <script src="/App/filters/angular-percentage.js?v=022"></script>

    <!-- Google Analytics -->
    <script src="/App/external/googleAnalytics.js"></script>

</body>
</html>
