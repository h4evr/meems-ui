/*global define*/
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    function SplitView() {
        Widget.apply(this, arguments);
        
        this.$layout = 'horizontal';
        
        this.facet("first", null);
        this.facet("second", null);
        
        return this;
    }
    
    SplitView.extend(Widget, {
        layout : function (val) {
            if (val === undefined) {
                return this.$layout;
            } else {
                this.$layout = val;
                
                if (this.el()) {
                    if (this.$layout === 'horizontal') {
                        Utils.Dom.removeClass(this.el(), "ui-vertical");
                        Utils.Dom.addClass(this.el(), "ui-horizontal");
                    } else {
                        Utils.Dom.removeClass(this.el(), "ui-horizontal");
                        Utils.Dom.addClass(this.el(), "ui-vertical");
                    }
                }
                
                return this;
            }
        },
        
        update : function () {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-splitview";
                this.layout(this.$layout);
            }
            
            if (this.facet("first")) {
                this.facet("first").update();
                
                if (this.facet("first").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("first").el());
                }
            }
            
            if (this.facet("second")) {
                this.facet("second").update();
                
                if (this.facet("second").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("second").el());
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return SplitView;
});
