define(["meems-utils", "./widget"], function(Utils, Widget) {
    function ListItem() {
        Widget.apply(this, arguments);
        this.facet("item", null);
        return this;
    }
    
    ListItem.extend(Widget, {
        update : function () {
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("li"));
            }
            
            Utils.Dom.addClass(this.el(), "ui-list-item");
            
            if (this.facet("item")) {
                this.facet("item").update();
                
                if (this.facet("item").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("item").el());
                }
            }
        }
    });
    
    return ListItem;
});