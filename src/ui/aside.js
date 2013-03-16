/*global define*/
/**
 * A component that holds a menu and a content area, allowing the menu to be toggled on and off.
 *
 * @module meems-ui
 * @submodule aside
 * @requires meems-utils
 */
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    /**
     * @class Aside
     * @constructor
     * @extends Widget
     */
    function Aside() {
        Widget.apply(this, arguments);
        
        this.$expanded = false;
        
        this.facet("menu", null);
        this.facet("content", null);
        
        return this;
    }
    
    Aside.extend(Widget, {
        /**
         * Getter and setter for the menu's visibility.
         *
         * @method expanded
         * @param {Boolean} [val] True to show the menu, false to
         *                        hide the menu or undefined to return the current value.
         * @return {Aside|Boolean} If used as getter, returns the current visibility state of the menu,
         *                          otherwise returns the Aside widget itself to allow chaining.
         */
        expanded : function (val) {
            if (val === undefined) {
                return this.$expanded;
            } else {
                this.$expanded = val;
                
                if (this.$expanded) {
                    if (this.facet("menu")) {
                        Utils.Dom.addClass(this.facet("menu").el(), "ui-expanded");
                        Utils.Dom.removeClass(this.facet("menu").el(), "ui-collapsed");
                    }
                    
                    if (this.facet("content")) {
                        Utils.Dom.addClass(this.facet("content").el(), "ui-expanded");
                        Utils.Dom.removeClass(this.facet("content").el(), "ui-collapsed");
                    }
                } else {
                    if (this.facet("menu")) {
                        Utils.Dom.addClass(this.facet("menu").el(), "ui-collapsed");
                        Utils.Dom.removeClass(this.facet("menu").el(), "ui-expanded");
                    }
                    
                    if (this.facet("content")) {
                        Utils.Dom.addClass(this.facet("content").el(), "ui-collapsed");
                        Utils.Dom.removeClass(this.facet("content").el(), "ui-expanded");
                    }
                }
                
                return this;
            }
        },

        update : function () {
            if (!this.el()) {
                this.el(document.createElement("div"));
                Utils.Dom.addClass(this.el(), "ui-aside");
            }
            
            if (this.facet("menu")) {
                this.facet("menu").update();
                
                Utils.Dom.addClass(this.facet("menu").el(), "ui-aside-menu");
                
                if (this.facet("menu").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("menu").el());
                }
            }
            
            if (this.facet("content")) {
                this.facet("content").update();
                
                Utils.Dom.addClass(this.facet("content").el(), "ui-aside-content");
                
                if (this.facet("content").el().parentNode !== this.el()) {
                    Utils.Dom.addClass(this.facet("content").el(), "ui-content ui-scroll-y");
                    this.el().appendChild(this.facet("content").el());
                }
            }
            
            this.expanded(this.$expanded);
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Aside;
});
