/*global Meems CodeMirror*/
(function () {
    "use strict";

    var code = document.getElementById("code"),
        output = document.getElementById("output"),
        theme = document.getElementById("theme"),
        frame = (output.contentWindow) ?
                   output.contentWindow.document :
                    (output.contentDocument.document) ?
                        output.contentDocument.document :
                        output.contentDocument;

    function injectCss(doc, css) {
        var head = doc.getElementsByTagName("head")[0];
        
        for (var i = 0, len = css.length; i < len; ++i) {
            var elm = doc.createElement("link");
            elm.setAttribute("rel", "stylesheet");
            elm.setAttribute("type", "text/css");
            elm.setAttribute("href", css[i]);
            head.appendChild(elm);
        }
    }

    function changeTheme() {
        var newTheme = theme.value;

        var head = frame.getElementsByTagName("head")[0];
        var links = head.getElementsByTagName("link");

        while (links.length > 0) {
            head.removeChild(links[0]);
        }

        links = null;

        injectCss(frame, [
            "css/themes/" + newTheme + "/ui.css",
            "css/themes/" + newTheme + "/effects.css",
            "css/themes/" + newTheme + "/icons.css"
        ]);
    }

    function onUpdate() {
        frame.body.innerHTML = "";

        script = frame.createElement("script");
        script.setAttribute("type", "text/javascript");
        
        var val = code.getValue().replace(/"/g, "\\\"").replace(/[\r\n]/g, "");
        script.innerHTML = "var _ids = {}; var find = function(id) {return _ids[id];}; var ui = parseMeemsUi(\"" + val + "\", _ids); if(ui) { ui.update(); document.body.appendChild(ui.el()); Meems.Utils.Dom.applyChanges();Meems.Scroll.updateAll(); }";
        frame.body.appendChild(script);
    }

    // START: Init output frame with necessary CSS and Javascript
    frame.open().close();
    injectCss(frame, [
        "css/themes/android/ui.css",
        "css/themes/android/effects.css",
        "css/themes/android/icons.css"
    ]);

    var script = frame.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "js/lib/meems/meems.min.js");
    frame.body.appendChild(script);

    script = frame.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "js/parsemeems.js");
    frame.body.appendChild(script);
    // END

    code = CodeMirror.fromTextArea(code, {
        mode: "javascript",
        indentUnit: 4
    });

    code.on("change", onUpdate);
    document.getElementById("btnUpdate").addEventListener("click", onUpdate, false);
    document.getElementById("width").addEventListener("change", function () {
        output.style.width = this.value + "px";
    }, false);
    document.getElementById("height").addEventListener("change", function () {
        output.style.height = this.value + "px";
    }, false);
    document.getElementById("theme").addEventListener("change", function () {
        changeTheme();
    }, false);

    window.setTimeout(function () {
        onUpdate();
    }, 2000);
}());
