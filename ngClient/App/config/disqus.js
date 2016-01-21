(function () {
    'use strict';

    angular.module('main')
        .run(['disqus_shortname', 'logger', disqusRun]);

    function disqusRun(disqusShortname, logger) {

        // Logger
        logger = logger.forSource('disqusRun');

        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqusShortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    }

})();
