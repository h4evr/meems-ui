/*globals require */
require.config({
    paths: {
        "viewmodel": "./viewmodel",
        "view": "./view",
        "meems": "../../src/",
        "meems-utils": "../../lib/meems-utils/meems-utils",
        "meems-events": "../../lib/meems-events/meems-events",
        "meems-scroll": "../../lib/meems-scroll/meems-scroll",
        "mustache": "//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.7.2/mustache.min"
    }
});

function loadCss(urls) {
    "use strict";

    var link,
        head = document.getElementsByTagName("head")[0],
        firstSibling = head.childNodes[0];

    for (var i = 0, ln = urls.length; i < ln; ++i) {
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = urls[i];
        head.insertBefore(link, firstSibling);
    }
}

function getTheme() {
    "use strict";

    var m;
    
    if ((m = /theme=(\w+)/.exec(window.location.search))) {
        return m[1];
    }
    
    return null;
}

var theme = getTheme() || 'android';
loadCss([
    "../../themes/" + theme + "/ui.css",
    "../../themes/" + theme + "/icons.css",
    "../../themes/" + theme + "/effects.css"
]);

require([
    "meems-scroll", "meems-utils", "meems-events",
    /* Views */
    "view/phone",

    /* ViewModels */
    "viewmodel/phone"
], function (Scroll, Utils, Events, PhoneUI, PhoneViewModel) {
    "use strict";

    var phoneUi = new PhoneUI();
    PhoneViewModel.init(phoneUi);
    phoneUi.refresh();

    Events.Dom.on(window, 'resize', Utils.Fn.throttle(Scroll.updateAll, 100));
    document.body.appendChild(phoneUi.ui.el());
    Scroll.updateAll();

});
