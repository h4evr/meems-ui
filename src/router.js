/*global define*/
/**
 * Singleton manager of routes and application history.
 *
 * @module meems
 * @submodule router
 */
define(["meems-events"], function (Events) {
    var routes = [],
        findParamRegExp = /\/([:\?])([\w\d]+)/g;

    function getCallbackForRoute(route) {
        var r, m;

        for (var k = 0, len = routes.length; k < len; ++k) {
            r = routes[k];

            if ((m = r.route.exec(route))) {
                var params = {};

                for (var i = 0, len2 = r.params.length; i < len2; ++i) {
                    params[r.params[i]] = m[i+1];
                }

                return {
                    callback: r.callback,
                    params: params
                };
            }
        }

        return null;
    }

    function onHashChanged() {
        Router.goTo(window.location.hash.replace(/^#\/?/, ""), true);
    }

    /**
     * @class Router
     */
    var Router = {
        /**
         * Obtain the current location.
         *
         * @method get
         * @return {string} The current location
         */
        get : function () {
            return window.location.hash.replace(/^#\/?/, "");
        },

        /**
         * Associates a callback with a route.
         *
         * @method on
         * @param route The route to match.
         * @param callback The callback to be invoked.
         */
        on : function (route, callback) {
            var params = [];
            findParamRegExp.lastIndex = 0;

            // build a regular expression based on the provided route to capture arguments.
            var rexpRoute = route.replace(findParamRegExp, function (match, p1, p2) {
                params.push(p2);

                if (p1 === ':') {
                    return "\/([^/]+)";
                } else {
                    return "(?:\/([^/]+))?";
                }
            });

            var obj = {
                route: new RegExp(rexpRoute),
                params: params,
                callback: callback
            };

            routes.push(obj);
        },

        /**
         * Jump to a certain route.
         *
         * @method goTo
         * @param url Jump to the given url
         * @param [skipUpdateLocation] true if the window location is not to be updated.
         */
        goTo : function (url, skipUpdateLocation) {
            if (skipUpdateLocation !== true) {
                window.location.hash = "#" + url;
            } else {
                var cb = getCallbackForRoute(url);
                if (cb) {
                    cb.callback({
                        url: url,
                        params: cb.params
                    });
                }
            }
        },

        /**
         * Reads the current URL and invokes the appropriate handlers.
         * Call this after you've set up the route handlers.
         *
         * @method init
         */
        init : function ()  {
            Router.goTo(Router.get(), true);
        }
    };

    // Install a handler to listen for URL (hash) changes.
    (function() {
        if ("onhashchange" in window) {
            Events.Dom.on(window, 'hashchange', onHashChanged);
        } else {
            var hash = window.location.hash;
            window.setInterval(function () {
                if (hash !== window.location.hash) {
                    onHashChanged();
                    hash = window.location.hash;
                }
            }, 250);
        }
    }());

    return Router;
});