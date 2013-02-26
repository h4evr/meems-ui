define(["meems-utils", "./widget"], function(Utils, Widget) {
    function Footer() {
        Widget.apply(this, arguments);
        
        this.facet("buttons", null);
        
        return this;
    }
    
    Footer.extend(Widget, {
        update : function () {            
            if (!this.el()) {
                this.el(document.createElement("div"));
                Utils.Dom.addClass(this.el(), "ui-footer");
            }
            
            if (this.facet("buttons")) {
                this.facet("buttons").update();
                
                if (this.facet("buttons").el().parentNode !== this.el()) {
                    Utils.Dom.addClass(this.facet("buttons").el(), "ui-buttons");
                    this.el().appendChild(this.facet("buttons").el());
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Footer;
});