define(["meems-utils", "./widget"], function(Utils, Widget) {
    function Aside() {
        Widget.apply(this, arguments);
        
        this._expanded = false;
        
        this.facet("menu", null);
        this.facet("content", null);
        
        return this;
    }
    
    Aside.extend(Widget, {
        expanded : function (val) {
            if (val === undefined) {
                return this._expanded;
            } else {
                this._expanded = val;
                
                if (this._expanded) {
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
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("div"));
            }
            
            Utils.Dom.addClass(this.el(), "ui-aside");
            
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
                        
            this.expanded(this._expanded);
        }
    });
    
    return Aside;
});