define(["meems-utils", "./widget"], function(Utils, Widget) {
    function ListItem() {
        Widget.apply(this, arguments);
        this._header = false;
        this.facet("item", null);
        return this;
    }
    
    ListItem.extend(Widget, {
        header : function (val) {
            if (val === undefined) {
                return this._header;
            } else {
                this._header = val;
                
                if (this.el()) {
                    if (this._header) {
                        Utils.Dom.addClass(this.el(), "ui-list-header");
                        Utils.Dom.removeClass(this.el(), "ui-list-item");
                    } else {
                        Utils.Dom.addClass(this.el(), "ui-list-item");
                        Utils.Dom.removeClass(this.el(), "ui-list-header");
                    }
                }
                
                return this;
            }
        },
        
        update : function () {
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("li"));
            }
            
            this.header(this._header);
            
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