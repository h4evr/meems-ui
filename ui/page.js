define(["meems-utils", "./widget"], function(Utils, Widget) {
    function Page() {
        Widget.apply(this, arguments);
        
        this.facet("header", null);
        this.facet("content", null);
        this.facet("footer", null);
        
        return this;
    }
    
    Page.extend(Widget, {
        update : function () {
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("div"));
            }
            
            Utils.Dom.addClass(this.el(), "ui-page");
            
            if (this.facet("header")) {
                this.facet("header").update();
                
                if (this.facet("header").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("header").el());
                }
            }
            
            if (this.facet("content")) {
                this.facet("content").update();
                
                if (this.facet("content").el().parentNode !== this.el()) {
                    Utils.Dom.addClass(this.facet("content").el(), "ui-content ui-scroll-y");
                    this.el().appendChild(this.facet("content").el());
                }
            }
            
            if (this.facet("footer")) {
                this.facet("footer").update();
                
                if (this.facet("footer").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("footer").el());
                }
            }
            
            if (this.facet("content")) {
                if (this.facet("header")) {
                    Utils.Dom.removeClass(this.facet("content").el(), "ui-header-off");
                } else {
                    Utils.Dom.addClass(this.facet("content").el(), "ui-header-off");
                }
                
                if (this.facet("footer")) {
                    Utils.Dom.removeClass(this.facet("content").el(), "ui-footer-off");
                } else {
                    Utils.Dom.addClass(this.facet("content").el(), "ui-footer-off");
                }
            }
        }
    });
    
    return Page;
});