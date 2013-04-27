/*global define*/
define(["meems-utils", "meems-scroll", "./widget"],
/**
 * A page component.
 * Exposes several facets: header, content, footer.
 *
 * @module meems-ui
 * @submodule page
 * @requires meems-utils
 * @requires meems-scroll
 */
function (Utils, Scroll, Widget) {
    "use strict";

    /**
     * @class Page
     * @constructor
     * @extends Widget
     */
    function Page() {
        Widget.apply(this, arguments);
        
        this.facet("header", null);
        this.facet("content", null);
        this.facet("footer", null);
        this.attr("enableScroll", false);
        
        this.$contentWrapper = null;
        this.$scroller = null;
        
        return this;
    }
    
    Page.extend(Widget, {
        /**
         * Getter for the Scroll component associated with this page.
         *
         * @method scroller
         * @return {Scroll} The scroller.
         */
        scroller : function () {
            return this.$scroller;
        },

        update : function (structureOnly) {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-page";
            }
            
            if (this.facet("header")) {
                this.facet("header").update(structureOnly);
                
                if (this.facet("header").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("header").el());
                }
            }
            
            if (this.facet("content")) {
                this.facet("content").update(structureOnly);
                
                if (!this.facet("content").el().parentNode || this.facet("content").el().parentNode !== this.$contentWrapper) {
                    this.$contentWrapper = document.createElement("div");
                    this.$contentWrapper.className = "ui-content";
                    this.$contentWrapper.appendChild(this.facet("content").el());
                    this.el().appendChild(this.$contentWrapper);
                }
            }
            
            if (this.facet("footer")) {
                this.facet("footer").update(structureOnly);
                
                if (this.facet("footer").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("footer").el());
                }
            }
            
            if (this.facet("content")) {
                if (this.facet("header")) {
                    Utils.Dom.removeClass(this.$contentWrapper, "ui-header-off");
                } else {
                    Utils.Dom.addClass(this.$contentWrapper, "ui-header-off");
                }
                
                if (this.facet("footer")) {
                    Utils.Dom.removeClass(this.$contentWrapper, "ui-footer-off");
                } else {
                    Utils.Dom.addClass(this.$contentWrapper, "ui-footer-off");
                }
            }

            if (this.attr("enableScroll") === true && !this.$scroller) {
                this.$scroller = new Scroll(this.$contentWrapper, {
                    scrollX: false,
                    scrollY: true,
                    disableTouchEvents : false,
                    hideScroller : false,
                    friction: 1000.0
                });
            }

            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Page;
});
