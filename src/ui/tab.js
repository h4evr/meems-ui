/*global define*/
/**
 * A tab to be used with the `TabGroup` component.
 * Exposes the `content` facet.
 *
 * @module meems-ui
 * @submodule tab
 * @requires meems-utils
 * @requires meems-scroll
 */
define(["meems-utils", "meems-scroll", "./widget"], function (Utils, Scroll, Widget) {
    "use strict";

    /**
     * @class Tab
     * @constructor
     * @extends Widget
     */
    function Tab() {
        Widget.apply(this, arguments);
        this.$scroller = null;
        this.$holder = null;
        this.facet('content', null);
        return this;
    }
    
    Tab.extend(Widget, {
        update : function (structureOnly) {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-tab";
            }
            
            var facetContent = this.facet("content");
            
            if (facetContent) {
                facetContent.update(structureOnly);
                
                if (!this.$holder) {
                    this.$holder = document.createElement("div");
                    this.$holder.className = "ui-fill-width";
                    this.el().appendChild(this.$holder);
                }

                if (facetContent.el().parentNode !== this.$holder) {
                    this.$holder.appendChild(facetContent.el());
                    
                    if (this.$scroller) {
                        this.$scroller.destroy();
                    }
                    
                    this.$scroller = new Scroll(this.el(), {
                        scrollX: false,
                        scrollY: true
                    });
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Tab;
});
