module Main.Controllers {
    'use strict';

    var controllerId = 'AccountController';

    export class AccountController {

        static $inject = ['dataContext', 'logger', '$routeParams', '$scope'];

        constructor(dataContext: any, logger: any, $routeParams: any, $scope: any) {

            // Logger
            logger = logger.forSource(controllerId);

            var vm: any = this;
            vm.currentUser = dataContext.getCurrentUser();

            // Events
            $scope.$on('dataContext_currentUserChanged', currentUserChanged);

            _init();

            function _init() {
            }

            function currentUserChanged(event: any, newUser: any);
            function currentUserChanged(event, newUser) {
                vm.currentUser = newUser;
            }   
        }
    }

    angular.module('main').controller(controllerId, AccountController);
}