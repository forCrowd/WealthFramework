module Main.Config {
    'use strict';

    angular.module('main')
        .config(['breezeProvider', breezeConfig])
        .config(['zDirectivesConfigProvider', breezeDirectiveConfig]);

    function breezeConfig(breezeProvider: any) {
        breeze.config.initializeAdapterInstance('uriBuilder', 'odata');

        // Use Web API OData to query and save
        var adapter = breeze.config.initializeAdapterInstance('dataService', 'webApiOData', true);
        adapter.getRoutePrefix = getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x;

        // convert between server-side PascalCase and client-side camelCase
        // breeze.NamingConvention.camelCase.setAsDefault();

        function getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x(dataService: any) {

            // Copied from breeze.debug and modified for Web API OData v.5.3.1.
            var parser = document.createElement('a');
            parser.href = dataService.serviceName;

            // THE CHANGE FOR 5.3.1: Add '/' prefix to pathname
            var prefix = parser.pathname;
            if (prefix[0] !== '/') {
                prefix = '/' + prefix;
            } // add leading '/'  (only in IE)
            if (prefix.substr(-1) !== '/') {
                prefix += '/';
            } // ensure trailing '/'

            return prefix;
        }
    }

    function breezeDirectiveConfig(config: any) {

            // Custom template with warning icon before the error message
            config.zRequiredTemplate = '';
            config.zValidateTemplate = '<span class="help-block">%error%!</span>';
        
    }
}