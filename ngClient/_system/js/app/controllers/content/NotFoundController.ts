module Main.Controller {
    'use strict';

    var controllerId = 'NotFoundController';

    export class NotFoundController {

        static $inject = ['logger', '$location'];

        constructor(logger: any, $location: any) {

            // Logger
            logger = logger.forSource(controllerId);

            _init();

            /*** Implementations ***/

            function _init() {
                var url = $location.search().url;
                if (typeof url !== 'undefined') {
                    throw new Error('Not found: ' + url);
                }
            }
        }
    }

    angular.module('main').controller(controllerId, NotFoundController);
}