define(["meems-utils", "./widget"], function(Utils, Widget) {
    function Header() {
        Widget.apply(this, arguments);
        
        this.facet("buttonsleft", null);
        this.facet("buttonsright", null);
        
        this._titleEl = null;
        
        return this;
    }
    
    Header.extend(Widget, {
        update : function () {
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("div"));
                
                this._titleEl = document.createElement("div");
                this._titleEl.className = "ui-title";
                
                this.el().appendChild(this._titleEl);
            }
            
            Utils.Dom.addClass(this.el(), "ui-header");
            this._titleEl.innerHTML = this.attr("title");
            
            if (this.facet("buttonsleft")) {
                this.facet("buttonsleft").update();
                
                if (this.facet("buttonsleft").el().parentNode !== this.el()) {
                    Utils.Dom.addClass(this.facet("buttonsleft").el(), "ui-buttons-left");
                    this.el().insertBefore(this.facet("buttonsleft").el(), this._titleEl);
                }
            }
            
            if (this.facet("buttonsright")) {
                this.facet("buttonsright").update();
                
                if (this.facet("buttonsright").el().parentNode !== this.el()) {
                    Utils.Dom.addClass(this.facet("buttonsright").el(), "ui-buttons-right");
                    this.el().appendChild(this.facet("buttonsright").el());
                }
            }
        }
    });
    
    return Header;
});