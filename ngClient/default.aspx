<!DOCTYPE html>
<html data-ng-app="main">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title data-ng-bind="'Wealth Economy' + (viewTitle !== '' ? ' - ' + viewTitle : '')"></title>
    <base href="/" />

    <!-- lib.css -->
    <link href="/css/lib/lib.min.css?v=0.43.5" rel="stylesheet" />

    <!-- app.css -->
    <link href="/css/app.min.css?v=0.47.0" rel="stylesheet" />

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
                <a href="/" class="navbar-brand">Wealth Economy
                </a>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li>
                        <a href="/resourcePool/new">Create CMRP (New)</a>
                    </li>
                    <li>
                        <a href="/resourcePool">CMRP List</a>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown" data-uib-dropdown data-ng-if="vm.currentUser.isAuthenticated()">
                        <a href="" class="dropdown-toggle" data-uib-dropdown-toggle><span data-ng-bind="'User: ' + vm.currentUser.Email"></span><b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="/account/accountEdit">Edit</a></li>
                            <li><a href="/account/changeEmail">Change email</a></li>
                            <li><a href="/account/confirmEmail" data-ng-if="!vm.currentUser.EmailConfirmed">Confirm email</a></li>
                            <li data-ng-if="vm.currentUser.hasPassword()"><a href="/account/changePassword">Change password</a></li>
                            <li data-ng-if="!vm.currentUser.hasPassword()"><a href="/account/addPassword">Add password</a></li>
                            <li><a href="" data-ng-click="vm.logout()">Logout</a></li>
                        </ul>
                    </li>
                    <li data-ng-if="!vm.currentUser.isAuthenticated()">
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

        <footer>
            <div class="row buffer-top" data-ng-if="vm.displayFooterIcons">
                <div class="col-md-12"></div>
                <hr />
                <div class="row">
                    <div class="col-md-4">
                        <a class="btn btn-block btn-default" role="button" href="https://twitter.com/forCrowd" target="_blank">
                            <span class="fa fa-twitter fa-lg"></span>
                            Follow us on Twitter
                        </a>
                    </div>
                    <div class="col-md-4">
                        <a class="btn btn-block btn-default" role="button" href="https://gitter.im/forCrowd/WealthEconomy" target="_blank">
                            <span class="fa fa-git fa-lg"></span>
                            Chat with us on Gitter
                        </a>
                    </div>
                    <div class="col-md-4">
                        <a class="btn btn-block btn-default" role="button" href="mailto:contact@forcrowd.org" target="_blank">
                            <span class="fa fa-envelope fa-lg"></span>
                            Contact us by contact@forcrowd.org
                        </a>
                    </div>
                </div>
                <div class="row buffer-top">
                    <div class="col-md-4">
                        <a class="btn btn-block btn-default" role="button" href="https://github.com/forCrowd/WealthEconomy" target="_blank">
                            <span class="fa fa-github fa-lg"></span>
                            View project on Github
                        </a>
                    </div>
                    <div class="col-md-4">
                        <a class="btn btn-block btn-default" role="button" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YPBCBJ3ANDL4Q" target="_blank">
                            <span class="fa fa-paypal fa-lg"></span>
                            Invest in us with Paypal
                        </a>
                    </div>
                    <div class="col-md-4">
                        <a class="btn btn-block btn-default" role="button" href="" data-ng-click="vm.toggleBankTransfer()">
                            <span class="fa fa-bank fa-lg"></span>
                            Or with bank transfer
                        </a>
                        <div class="bs-callout bs-callout-info" data-ng-if="vm.displayBankTransfer">
                            <h4>Bank Transfer - Euro</h4>
                            <p>
                                Bank: Triodos Bank NV, Netherlands<br />
                                IBAN: NL20 TRIO 0254 4012 87
                            </p>
                        </div>
                    </div>

                    <!--<a class="btn btn-primary" href="https://flattr.com/profile/forCrowd" role="button" target="_blank">Flattr</a>-->
                    <!--<a class="btn btn-primary" href="https://gratipay.com/forCrowd/" role="button" target="_blank">Gratipay</a>-->
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div data-ng-if="vm.disqusLoadedOn">
                        <hr />
                        <dir-disqus disqus-shortname="{{ vm.disqusShortname }}"
                            disqus-identifier="{{ vm.disqusId }}"
                            disqus-url="{{ vm.disqusUrl }}"
                            ready-to-bind="{{ vm.disqusLoadedOn }}">
                        </dir-disqus>
                    </div>
                    <hr />
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
                </div>
            </div>
        </footer>
    </div>

    <!-- lib.js -->
    <script src="/js/lib/lib.min.js?v=0.46.0"></script>

    <!-- app.js -->
    <script src="/js/app/app.min.js?v=0.47.0"></script>

    <!-- appSettings.js -->
    <script src="/js/appSettings/appSettings.js?v=0.43.2"></script>

</body>
</html>
