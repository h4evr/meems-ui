define(["meems-utils", "meems-scroll", "./widget"], function(Utils, Scroll, Widget) {
    function Page() {
        Widget.apply(this, arguments);
        
        this.facet("header", null);
        this.facet("content", null);
        this.facet("footer", null);
        
        this._contentWrapper = null;
        this._scroller = null;
        
        return this;
    }
    
    Page.extend(Widget, {
        scroller : function () {
            return this._scroller;
        },
        
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
                    
                    /*this._contentWrapper2 = document.createElement("div");
                    this._contentWrapper2.appendChild(this.facet("content").el());
                    this._contentWrapper.appendChild(this._contentWrapper2);
                    
                    Utils.Dom.addClass(this._contentWrapper, "ui-content");
                    this.el().appendChild(this._contentWrapper);
                    
                    this._scroll = new Scroll(this._contentWrapper, {
                        scrollX: false,
                        scrollY: true
                    });*/
                    
                    this._contentWrapper = document.createElement("div");
                    this._contentWrapper.appendChild(this.facet("content").el());
                    Utils.Dom.addClass(this._contentWrapper, "ui-content");
                    this.el().appendChild(this._contentWrapper);
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
                    Utils.Dom.removeClass(this._contentWrapper, "ui-header-off");
                } else {
                    Utils.Dom.addClass(this._contentWrapper, "ui-header-off");
                }
                
                if (this.facet("footer")) {
                    Utils.Dom.removeClass(this._contentWrapper, "ui-footer-off");
                } else {
                    Utils.Dom.addClass(this._contentWrapper, "ui-footer-off");
                }
            }
        }
    });
    
    return Page;
});