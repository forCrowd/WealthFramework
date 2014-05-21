(function () {
    'use strict';

    angular.module('main')
        .config(routeConfig);

    function routeConfig($routeProvider, $locationProvider) {

        // Routes
        $routeProvider

            .when('/', { templateUrl: 'ViewsNg/home/index.html' })
            .when('/Home', { templateUrl: 'ViewsNg/home/index.html' })
            .when('/Overview', { templateUrl: 'ViewsNg/Home/Overview.html' })
            .when('/Technologies', { templateUrl: 'ViewsNg/Home/Technologies.html' })

            .when('/User/Login', { controller: 'loginController as vm', templateUrl: '/ViewsNg/User/Login.html' })
            .when('/User/Register', { controller: 'registerController as vm', templateUrl: '/ViewsNg/User/Register.html' })
            .when('/User/AccountEdit/:Id', { controller: 'accountEditController as vm', templateUrl: '/ViewsNg/User/AccountEdit.html' })
            .when('/User/ChangePassword', { controller: 'changePasswordController as vm', templateUrl: '/ViewsNg/User/ChangePassword.html' })

            .when('/License', { controller: 'licenseListController as vm', templateUrl: '/ViewsNg/list/licenseList.html' })
            .when('/License/new', { controller: 'licenseEditController as vm', templateUrl: '/ViewsNg/edit/licenseEdit.html' })
            .when('/License/edit/:Id', { controller: 'licenseEditController as vm', templateUrl: '/ViewsNg/edit/LicenseEdit.html' })
            .when('/Organization', { controller: 'organizationListController as vm', templateUrl: '/ViewsNg/list/organizationList.html' })
            .when('/Organization/new', { controller: 'organizationEditController as vm', templateUrl: '/ViewsNg/edit/organizationEdit.html' })
            .when('/Organization/edit/:Id', { controller: 'organizationEditController as vm', templateUrl: '/ViewsNg/edit/OrganizationEdit.html' })
            .when('/ResourcePool', { controller: 'resourcePoolListController as vm', templateUrl: '/ViewsNg/list/resourcePoolList.html' })
            .when('/ResourcePool/new', { controller: 'resourcePoolEditController as vm', templateUrl: '/ViewsNg/edit/resourcePoolEdit.html' })
            .when('/ResourcePool/edit/:Id', { controller: 'resourcePoolEditController as vm', templateUrl: '/ViewsNg/edit/ResourcePoolEdit.html' })
            .when('/Sector', { controller: 'sectorListController as vm', templateUrl: '/ViewsNg/list/sectorList.html' })
            .when('/Sector/new', { controller: 'sectorEditController as vm', templateUrl: '/ViewsNg/edit/sectorEdit.html' })
            .when('/Sector/edit/:Id', { controller: 'sectorEditController as vm', templateUrl: '/ViewsNg/edit/SectorEdit.html' })
            .when('/User', { controller: 'userListController as vm', templateUrl: '/ViewsNg/list/userList.html' })
            .when('/User/new', { controller: 'userEditController as vm', templateUrl: '/ViewsNg/edit/userEdit.html' })
            .when('/User/edit/:Id', { controller: 'userEditController as vm', templateUrl: '/ViewsNg/edit/UserEdit.html' })
            .when('/UserLicenseRating', { controller: 'userLicenseRatingListController as vm', templateUrl: '/ViewsNg/list/userLicenseRatingList.html' })
            .when('/UserLicenseRating/new', { controller: 'userLicenseRatingEditController as vm', templateUrl: '/ViewsNg/edit/userLicenseRatingEdit.html' })
            .when('/UserLicenseRating/edit/:Id', { controller: 'userLicenseRatingEditController as vm', templateUrl: '/ViewsNg/edit/UserLicenseRatingEdit.html' })
            .when('/UserOrganization', { controller: 'userOrganizationListController as vm', templateUrl: '/ViewsNg/list/userOrganizationList.html' })
            .when('/UserOrganization/new', { controller: 'userOrganizationEditController as vm', templateUrl: '/ViewsNg/edit/userOrganizationEdit.html' })
            .when('/UserOrganization/edit/:Id', { controller: 'userOrganizationEditController as vm', templateUrl: '/ViewsNg/edit/UserOrganizationEdit.html' })
            .when('/UserResourcePool', { controller: 'userResourcePoolListController as vm', templateUrl: '/ViewsNg/list/userResourcePoolList.html' })
            .when('/UserResourcePool/new', { controller: 'userResourcePoolEditController as vm', templateUrl: '/ViewsNg/edit/userResourcePoolEdit.html' })
            .when('/UserResourcePool/edit/:Id', { controller: 'userResourcePoolEditController as vm', templateUrl: '/ViewsNg/edit/UserResourcePoolEdit.html' })
            .when('/UserSectorRating', { controller: 'userSectorRatingListController as vm', templateUrl: '/ViewsNg/list/userSectorRatingList.html' })
            .when('/UserSectorRating/new', { controller: 'userSectorRatingEditController as vm', templateUrl: '/ViewsNg/edit/userSectorRatingEdit.html' })
            .when('/UserSectorRating/edit/:Id', { controller: 'userSectorRatingEditController as vm', templateUrl: '/ViewsNg/edit/UserSectorRatingEdit.html' })

            .when('/TotalCostIndex', { controller: 'userResourcePoolController as vm', templateUrl: '/ViewsNg/UserResourcePool/TotalCostIndex.html' })
            .when('/KnowledgeIndex', { controller: 'userResourcePoolController as vm', templateUrl: '/ViewsNg/UserResourcePool/KnowledgeIndex.html' })
            .when('/QualityIndex', { controller: 'userResourcePoolController as vm', templateUrl: '/ViewsNg/UserResourcePool/QualityIndex.html' })
            .when('/EmployeeSatisfactionIndex', { controller: 'userResourcePoolController as vm', templateUrl: '/ViewsNg/UserResourcePool/EmployeeSatisfactionIndex.html' })
            .when('/CustomerSatisfactionIndex', { controller: 'userResourcePoolController as vm', templateUrl: '/ViewsNg/UserResourcePool/CustomerSatisfactionIndex.html' })
            .when('/SectorIndex', { controller: 'userResourcePoolController as vm', templateUrl: '/ViewsNg/UserResourcePool/SectorIndex.html' })
            .when('/DistanceIndex', { controller: 'userResourcePoolController as vm', templateUrl: '/ViewsNg/UserResourcePool/DistanceIndex.html' })
            .when('/AllInOne', { controller: 'userResourcePoolController as vm', templateUrl: '/ViewsNg/UserResourcePool/AllInOne.html' })

            .when('/SectorChart', { controller: 'sectorChartController as vm', templateUrl: '/ViewsNg/Sector/SectorChart.html' })

            .otherwise({ redirectTo: '/' });

        // Html5Mode is on, if supported (# will not be used)
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode(true);
        }
    }
})();
