/*global define*/
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    function Html() {
        Widget.apply(this, arguments);
        return this;
    }
    
    Html.extend(Widget, {
        update : function () {
            if (!this.el()) {
                this.el(document.createElement("div"));
                Utils.Dom.addClass(this.el(), "ui-html");
            }
            
            Utils.Dom.setHtml(this.el(), this.attr("html"));
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Html;
});
