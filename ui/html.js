/*global define*/
define(["meems-utils", "./widget", "mustache"], function (Utils, Widget, Mustache) {
    "use strict";

    function Html() {
        this._compiledTemplate = Mustache.compile("");

        Widget.apply(this, arguments);
        return this;
    }
    
    Html.extend(Widget, {
        attr : function (attrName, val) {
            if (val !== undefined && attrName === 'html') {
                this._compiledTemplate = Mustache.compile(val || "");
            }

            return Widget.prototype.attr.apply(this, arguments); // super
        },

        partialUpdate : function (attrName) {
            if ((attrName === 'html' || attrName === 'data') && this.el()) {
                Utils.Dom.setHtml(this.el(), this._compiledTemplate(this.attr("data")));
            }
        },

        update : function () {
            if (!this.el()) {
                this.el(document.createElement("div"));
                Utils.Dom.addClass(this.el(), "ui-html");
            }

            Utils.Dom.setHtml(this.el(), this._compiledTemplate(this.attr("data")));
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Html;
});
