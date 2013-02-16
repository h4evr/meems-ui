define(["meems-utils", "./widget"], function(Utils, Widget) {
    function SplitView() {
        Widget.apply(this, arguments);
        
        this._layout = 'horizontal';
        
        this.facet("first", null);
        this.facet("second", null);
        
        return this;
    }
    
    SplitView.extend(Widget, {
        layout : function (val) {
            if (val === undefined) {
                return this._layout;
            } else {
                this._layout = val;
                
                if (this.el()) {
                    if (this._layout === 'horizontal') {
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
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("div"));
            }
            
            Utils.Dom.addClass(this.el(), "ui-splitview");
            
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
                        
            this.expanded(this._expanded);
        }
    });
    
    return SplitView;
});