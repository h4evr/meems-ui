define(["meems-utils", "./widget"], function(Utils, Widget) {
    function Html() {
        Widget.apply(this, arguments);        
        return this;
    };
    
    Html.extend(Widget, {
        update : function () {
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("div"));
            }
            
            Utils.Dom.addClass(this.el(), "ui-html");
            this.el().innerHTML = this.attr("html");
        }
    });
    
    return Html;
});