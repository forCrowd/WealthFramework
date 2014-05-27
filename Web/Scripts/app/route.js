(function () {
    'use strict';

    angular.module('main')
        .config(routeConfig);

    function routeConfig($routeProvider, $locationProvider) {

        // Routes
        $routeProvider

            .when('/', { templateUrl: '/ViewsNg/home/index.html' })
            .when('/Home', { templateUrl: '/ViewsNg/home/index.html' })
            .when('/Overview', { templateUrl: '/ViewsNg/Home/Overview.html' })
            .when('/Technologies', { templateUrl: '/ViewsNg/Home/Technologies.html' })

            .when('/Chapters/1', { templateUrl: '/ViewsNg/Chapters/Chapter1.html', controller: 'chapter1Controller as vm' })
            .when('/Chapters/2', { templateUrl: '/ViewsNg/Chapters/Chapter2.html' })
            .when('/Chapters/3', { templateUrl: '/ViewsNg/Chapters/Chapter3.html' })
            .when('/Chapters/4', { templateUrl: '/ViewsNg/Chapters/Chapter4.html', controller: 'chapter4Controller as vm' })
            .when('/Chapters/5', { templateUrl: '/ViewsNg/Chapters/Chapter5.html', controller: 'chapter5Controller as vm' })
            .when('/Chapters/6', { templateUrl: '/ViewsNg/Chapters/Chapter6.html' })
            .when('/Chapters/7', { templateUrl: '/ViewsNg/Chapters/Chapter7.html' })
            .when('/Chapters/8', { templateUrl: '/ViewsNg/Chapters/Chapter8.html' })
            .when('/Chapters/9', { templateUrl: '/ViewsNg/Chapters/Chapter9.html' })
            .when('/Chapters/10', { templateUrl: '/ViewsNg/Chapters/Chapter10.html' })

            .when('/User/Login', { templateUrl: '/ViewsNg/User/Login.html', controller: 'loginController as vm' })
            .when('/User/Register', { templateUrl: '/ViewsNg/User/Register.html', controller: 'registerController as vm' })
            .when('/User/AccountEdit/:Id', { templateUrl: '/ViewsNg/User/AccountEdit.html', controller: 'accountEditController as vm' })
            .when('/User/ChangePassword', { templateUrl: '/ViewsNg/User/ChangePassword.html', controller: 'changePasswordController as vm' })

            .when('/License', { templateUrl: '/ViewsNg/list/licenseList.html', controller: 'licenseListController as vm' })
            .when('/License/new', { templateUrl: '/ViewsNg/edit/licenseEdit.html', controller: 'licenseEditController as vm' })
            .when('/License/edit/:Id', { templateUrl: '/ViewsNg/edit/LicenseEdit.html', controller: 'licenseEditController as vm' })
            .when('/Organization', { templateUrl: '/ViewsNg/list/organizationList.html', controller: 'organizationListController as vm' })
            .when('/Organization/new', { templateUrl: '/ViewsNg/edit/organizationEdit.html', controller: 'organizationEditController as vm' })
            .when('/Organization/edit/:Id', { templateUrl: '/ViewsNg/edit/OrganizationEdit.html', controller: 'organizationEditController as vm' })
            .when('/ResourcePool', { templateUrl: '/ViewsNg/list/resourcePoolList.html', controller: 'resourcePoolListController as vm' })
            .when('/ResourcePool/new', { templateUrl: '/ViewsNg/edit/resourcePoolEdit.html', controller: 'resourcePoolEditController as vm' })
            .when('/ResourcePool/edit/:Id', { templateUrl: '/ViewsNg/edit/ResourcePoolEdit.html', controller: 'resourcePoolEditController as vm' })
            .when('/Sector', { templateUrl: '/ViewsNg/list/sectorList.html', controller: 'sectorListController as vm' })
            .when('/Sector/new', { templateUrl: '/ViewsNg/edit/sectorEdit.html', controller: 'sectorEditController as vm' })
            .when('/Sector/edit/:Id', { templateUrl: '/ViewsNg/edit/SectorEdit.html', controller: 'sectorEditController as vm' })
            .when('/User', { templateUrl: '/ViewsNg/list/userList.html', controller: 'userListController as vm' })
            .when('/User/new', { templateUrl: '/ViewsNg/edit/userEdit.html', controller: 'userEditController as vm' })
            .when('/User/edit/:Id', { templateUrl: '/ViewsNg/edit/UserEdit.html', controller: 'userEditController as vm' })
            .when('/UserLicenseRating', { templateUrl: '/ViewsNg/list/userLicenseRatingList.html', controller: 'userLicenseRatingListController as vm' })
            .when('/UserLicenseRating/new', { templateUrl: '/ViewsNg/edit/userLicenseRatingEdit.html', controller: 'userLicenseRatingEditController as vm' })
            .when('/UserLicenseRating/edit/:Id', { templateUrl: '/ViewsNg/edit/UserLicenseRatingEdit.html', controller: 'userLicenseRatingEditController as vm' })
            .when('/UserOrganization', { templateUrl: '/ViewsNg/list/userOrganizationList.html', controller: 'userOrganizationListController as vm' })
            .when('/UserOrganization/new', { templateUrl: '/ViewsNg/edit/userOrganizationEdit.html', controller: 'userOrganizationEditController as vm' })
            .when('/UserOrganization/edit/:Id', { templateUrl: '/ViewsNg/edit/UserOrganizationEdit.html', controller: 'userOrganizationEditController as vm' })
            .when('/UserResourcePool', { templateUrl: '/ViewsNg/list/userResourcePoolList.html', controller: 'userResourcePoolListController as vm' })
            .when('/UserResourcePool/new', { templateUrl: '/ViewsNg/edit/userResourcePoolEdit.html', controller: 'userResourcePoolEditController as vm' })
            .when('/UserResourcePool/edit/:Id', { templateUrl: '/ViewsNg/edit/UserResourcePoolEdit.html', controller: 'userResourcePoolEditController as vm' })
            .when('/UserSectorRating', { templateUrl: '/ViewsNg/list/userSectorRatingList.html', controller: 'userSectorRatingListController as vm' })
            .when('/UserSectorRating/new', { templateUrl: '/ViewsNg/edit/userSectorRatingEdit.html', controller: 'userSectorRatingEditController as vm' })
            .when('/UserSectorRating/edit/:Id', { templateUrl: '/ViewsNg/edit/UserSectorRatingEdit.html', controller: 'userSectorRatingEditController as vm' })

            .when('/TotalCostIndex', { templateUrl: '/ViewsNg/UserResourcePool/TotalCostIndex.html', controller: 'userResourcePoolController as vm' })
            .when('/KnowledgeIndex', { templateUrl: '/ViewsNg/UserResourcePool/KnowledgeIndex.html', controller: 'userResourcePoolController as vm' })
            .when('/QualityIndex', { templateUrl: '/ViewsNg/UserResourcePool/QualityIndex.html', controller: 'userResourcePoolController as vm' })
            .when('/EmployeeSatisfactionIndex', { templateUrl: '/ViewsNg/UserResourcePool/EmployeeSatisfactionIndex.html', controller: 'userResourcePoolController as vm' })
            .when('/CustomerSatisfactionIndex', { templateUrl: '/ViewsNg/UserResourcePool/CustomerSatisfactionIndex.html', controller: 'userResourcePoolController as vm' })
            .when('/SectorIndex', { templateUrl: '/ViewsNg/UserResourcePool/SectorIndex.html', controller: 'userResourcePoolController as vm' })
            .when('/DistanceIndex', { templateUrl: '/ViewsNg/UserResourcePool/DistanceIndex.html', controller: 'userResourcePoolController as vm' })
            .when('/AllInOne', { templateUrl: '/ViewsNg/UserResourcePool/AllInOne.html', controller: 'userResourcePoolController as vm' })

            .when('/SectorChart', { templateUrl: '/ViewsNg/Sector/SectorChart.html', controller: 'sectorChartController as vm' })

            .otherwise({ redirectTo: '/' });

        // Html5Mode is on, if supported (# will not be used)
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode(true);
        }
    }
})();
