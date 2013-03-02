/*global define*/
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    function ListItem() {
        Widget.apply(this, arguments);
        this.$header = false;
        this.facet("item", null);
        return this;
    }
    
    ListItem.extend(Widget, {
        header : function (val) {
            if (val === undefined) {
                return this.$header;
            } else {
                this.$header = val;
                
                if (this.el()) {
                    if (this.$header) {
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
            if (!this.el()) {
                this.el(document.createElement("li"));
                this.header(this.$header);
            }
            
            if (this.facet("item")) {
                this.facet("item").update();
                
                if (this.facet("item").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("item").el());
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return ListItem;
});
