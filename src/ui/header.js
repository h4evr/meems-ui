/*global define*/
/**
 * A header component, to be used with the Page component.
 * Exposes a 'buttonsleft' and 'buttonsright' facet.
 * The attribute 'title' must be used to set the title of the page.
 *
 * @module meems-ui
 * @submodule header
 * @requires meems-utils
 */
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    var MAX_BUTTONS = 999,
        userAgent = Utils.Dom.userAgent();

    console.log(userAgent);
    if (userAgent === 'ios') {
        MAX_BUTTONS = 1;
    } else {
        MAX_BUTTONS = 2;
    }

    /**
     * @class Header
     * @constructor
     * @extends Widget
     */
    function Header() {
        Widget.apply(this, arguments);
        
        this.facet("buttonsleft", null);
        this.facet("buttonsright", null);
        
        this.$titleEl = null;
        
        return this;
    }
    
    Header.extend(Widget, {
        partialUpdate : function (attrName, oldValue, newValue) {
            if (attrName === "title" && this.$titleEl) {
                Utils.Dom.setHtml(this.$titleEl, "<h1>" + (newValue || "") + "</h1>");
            }
        },

        update : function (structureOnly) {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-header";
                this.$titleEl = document.createElement("div");
                this.$titleEl.className = "ui-title";
                this.el().appendChild(this.$titleEl);
            }

            Utils.Dom.setHtml(this.$titleEl, "<h1>" + (this.attr("title") || "") + "</h1>");

            if (this.facet("buttonsleft")) {
                this.facet("buttonsleft").attr("maxButtons", 1);
                this.facet("buttonsleft").update(structureOnly);
                
                if (this.facet("buttonsleft").el().parentNode !== this.el()) {
                    Utils.Dom.addClass(this.facet("buttonsleft").el(), "ui-buttons-left");
                    this.el().insertBefore(this.facet("buttonsleft").el(), this.$titleEl);
                }
            }
            
            if (this.facet("buttonsright")) {
                this.facet("buttonsright").attr("maxButtons", MAX_BUTTONS);
                this.facet("buttonsright").update(structureOnly);
                
                if (this.facet("buttonsright").el().parentNode !== this.el()) {
                    Utils.Dom.addClass(this.facet("buttonsright").el(), "ui-buttons-right");
                    this.el().appendChild(this.facet("buttonsright").el());
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Header;
});
