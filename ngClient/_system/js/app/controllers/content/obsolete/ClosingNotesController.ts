module Main.Controller {
    'use strict';

    var controllerId = 'ClosingNotesController';

    export class ClosingNotesController {

        static $inject = ['dataContext', 'logger', '$location', '$rootScope', '$scope'];

        constructor(dataContext: any, logger: any, $location: any, $rootScope: any, $scope: any) {

            // Logger
            logger = logger.forSource(controllerId);

            // View model
            var vm:any = this;
            vm.currentUser = {
                isAuthenticated() {
                    return false;
                }
            };

            $scope.$on('dataContext_currentUserChanged', currentUserChanged);

            _init();

            /*** Implementations ***/

            function _init() {
                vm.currentUser = dataContext.getCurrentUser();
            }

            function currentUserChanged(event: any, newUser: any);
            function currentUserChanged(event, newUser) {
                vm.currentUser = newUser;
            }
        }
    }

    angular.module('main').controller(controllerId, ClosingNotesController);
}