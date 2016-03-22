(function () {
    'use strict';

    var controllerId = 'ProfileController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$location', '$routeParams', '$scope', ProfileController]);

    function ProfileController(dataContext, logger, $location, $routeParams, $scope) {

        // Logger
        logger = logger.forSource(controllerId);

        var userName = $routeParams.userName;
        var vm = this;
        vm.currentUser = { Id: 0 };
        vm.user = { Id: 0, UserName: '', Email: '' };

        // Events
        $scope.$on('dataContext_currentUserChanged', currentUserChanged);

        _init();

        function _init() {
            dataContext.getUser(userName)
                .then(function (user) {

                    // Not found, navigate to 404
                    if (user === null) {
                        $location.url('/_system/content/404');
                        return;
                    }

                    vm.user = user;
                    dataContext.getCurrentUser()
                        .then(function (currentUser) {
                            vm.currentUser = currentUser;
                        });
                });
        }

        function currentUserChanged(event, newUser) {
            vm.currentUser = newUser;
        }
    }
})();
