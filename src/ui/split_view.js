/*global define*/
/**
 * Component that holds two widgets and puts them side by side.
 * Exposes the facets `first` and `second`.
 *
 * @module meems-ui
 * @submodule splitview
 * @requires meems-utils
 */
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    /**
     * @class SplitView
     * @constructor
     * @extends Widget
     */
    function SplitView() {
        Widget.apply(this, arguments);

        this.attr('layout', 'horizontal');
        
        this.facet("first", null);
        this.facet("second", null);
        
        return this;
    }
    
    SplitView.extend(Widget, {
        attr : function (name, val) {
            var oldStyle = name === 'layout' ? Widget.prototype.attr.call(this, name) : null;
            var ret = Widget.prototype.attr.apply(this, arguments);

            if (name === 'layout' && val !== undefined && this.el()) {
                if (oldStyle) {
                    Utils.Dom.removeClass(this.el(), "ui-" + oldStyle);
                }

                if (val) {
                    Utils.Dom.addClass(this.el(), "ui-" + val);
                }
            }

            return ret;
        },

        update : function (structureOnly) {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-splitview";
                this.attr('layout', this.attr('layout'));
            }
            
            if (this.facet("first")) {
                this.facet("first").update(structureOnly);
                
                if (this.facet("first").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("first").el());
                }
            }
            
            if (this.facet("second")) {
                this.facet("second").update(structureOnly);
                
                if (this.facet("second").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("second").el());
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return SplitView;
});
