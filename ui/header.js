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
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-header";
                this._titleEl = document.createElement("div");
                this._titleEl.className = "ui-title";
                this.el().appendChild(this._titleEl);
            }
            
            Utils.Dom.setHtml(this._titleEl, "<h1>" + (this.attr("title") || "") + "</h1>");
            
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
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Header;
});