/*global define*/
/**
 * Component that can render HTML using Mustache templates.
 * Define the template using the 'html' attribute and bind data using the 'data' attribute.
 * If any of those are observable attributes, the component will be updated when any of them
 * changes.
 *
 * @module meems-ui
 * @submodule html
 * @requires mustache
 * @requires meems-utils
 */
define(["meems-utils", "./widget", "mustache"], function (Utils, Widget, Mustache) {
    "use strict";

    /**
     * @class Html
     * @constructor
     * @extends Widget
     */
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
