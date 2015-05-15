(function () {
    'use strict';

    var controllerId = 'CacheController';
    angular.module('main')
        .controller(controllerId, ['$cacheFactory', '$templateCache', 'logger', CacheController]);

    function CacheController($cacheFactory, $templateCache, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.keys = [];
        vm.cache = $cacheFactory('cacheId');
        vm.templates = $cacheFactory.get('templates');
        vm.templateCache = $templateCache;
        vm.put = function (key, value) {
            if (vm.cache.get(key) === undefined) {
                vm.keys.push(key);
            }
            vm.cache.put(key, value === undefined ? null : value);
        };

        //logger.log('$cacheFactory', $cacheFactory);
        //logger.log('$cacheFactory', $cacheFactory.info());
        //logger.log('$cacheFactory', $cacheFactory.info().templates);

        //logger.log('$templateCache', $templateCache);
        //logger.log('$templateCache', $templateCache.info());
        //logger.log('$templateCache', $templateCache.get());


        //logger.log('$cacheFactory', $cacheFactory);
        //logger.log('$cacheFactory', $cacheFactory.info());
        //logger.log('$cacheFactory', $cacheFactory.info().templates);

        //logger.log('$templateCache', $templateCache);
        //logger.log('$templateCache', $templateCache.info());

        $templateCache.put('templateId.html', 'This is the content of the template');

        logger.log('$templateCache.length', $templateCache.length);
        logger.log('$templateCache.info().info()', $templateCache.info());

        logger.log('vm.templates', vm.templates);
        logger.log('vm.templates.length', vm.templates.length);

        logger.log('$templateCache.info().length', $templateCache.info().length);

        logger.log('$templateCache', $templateCache.get('/App/views/content/cache.html'));
        logger.log('$templateCache', $templateCache.get('templateId.html'));
        // logger.log('$templateCache', $templateCache.get('cache.html'));

        for (var i = 0; i < $templateCache.length; i++) {
            //var item = $templateCache[i];
            logger.log('item', $templateCache[i]);
        }

        //logger.log('$templateCache', $templateCache.get('templateId.html'));

    };
})();
