
(function () {
    'use strict';

    var serviceId = 'elementService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', '$http', '$rootScope', 'dataContext', 'logger', elementService]);
        });

    function elementService($delegate, $http, $rootScope, dataContext, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        //$delegate.getResourcePoolCustom = getResourcePoolCustom;
        $delegate.decreaseMultiplier = decreaseMultiplier;
        $delegate.increaseMultiplier = increaseMultiplier;
        $delegate.resetMultiplier = resetMultiplier;
        //$delegate.updateResourcePoolRate = updateResourcePoolRate;

        // Overwrites the base resourcePoolService.saveChanges() function
        //$delegate.saveChanges = saveChanges;

        return $delegate;

        /*** Implementations ***/

        //function getResourcePoolCustom(resourcePoolId, valueFilter) {
        //    var url = '/api/ResourcePoolCustom/GetResourcePool/' + resourcePoolId;

        //    if (typeof valueFilter !== 'undefined')
        //        url += '/' + valueFilter;

        //    return $http.get(url);
        //}

        function decreaseMultiplier(elementId, eventSource) {
            if (typeof eventSource === 'undefined') { eventSource = ''; }
            var url = '/api/ElementCustom/DecreaseMultiplier/' + elementId;
            return $http.post(url)
                .success(function () {
                    // Raise the event
                    $rootScope.$broadcast('element_MultiplierDecreased', elementId, eventSource);
                });
        }

        function increaseMultiplier(elementId, eventSource) {
            if (typeof eventSource === 'undefined') { eventSource = ''; }
            var url = '/api/ElementCustom/IncreaseMultiplier/' + elementId;
            return $http.post(url)
                .success(function () {
                    // Raise the event
                    $rootScope.$broadcast('element_MultiplierIncreased', elementId, eventSource);
                });
        }

        function resetMultiplier(elementId, eventSource) {
            if (typeof eventSource === 'undefined') { eventSource = ''; }
            var url = '/api/ElementCustom/ResetMultiplier/' + elementId;
            return $http.post(url)
                .success(function () {
                    // Raise the event
                    $rootScope.$broadcast('element_MultiplierReset', elementId, eventSource);
                });
        }

        //function saveChanges(eventSource) {
        //    if (typeof eventSource === 'undefined') { eventSource = ''; }
        //    return dataContext.saveChanges()
        //        .then(function (result) {
        //            for (var i = 0; i < result.entities.length; i++) {
        //                var entity = result.entities[i];
        //                if (entity.entityAspect._entityKey.entityType.shortName === 'Element') {
        //                    // Raise the event
        //                    $rootScope.$broadcast('element_Saved', entity._backingStore.Id, eventSource);
        //                }
        //            }

        //            // Return
        //            return result;
        //        });
        //}
    }
})();
