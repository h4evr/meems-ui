/*global define*/
/**
 * Provides all Meems UI components.
 * Factory module, allows the user to create any UI widget through a single method.
 *
 * @module meems
 * @requires observable meems-ui
 */
define(["./observable",
        "./meems-ui",
        "meems-events",
        "meems-utils",
        "meems-scroll",
        "./router"],
function (Observable, UI, Events, Utils, Scroll, Router) {
    "use strict";

    var Meems = {
        Observable: Observable,
        UI: UI,
        Events: Events,
        Utils: Utils,
        Scroll: Scroll,
        Router: Router
    };
    
    return Meems;
});
