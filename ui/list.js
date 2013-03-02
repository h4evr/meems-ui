/*global define*/
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    function List() {
        Widget.apply(this, arguments);
        this.$items = [];
        this.$style = 'normal';
        return this;
    }
    
    List.extend(Widget, {
        style : function (val) {
            if (val === undefined) {
                return this.$style;
            } else {
                if (this.el() && this.$style) {
                    Utils.Dom.removeClass(this.el(), "ui-list-" +  this.$style);
                }
                
                this.$style = val;
                
                if (this.el() && this.$style) {
                    Utils.Dom.addClass(this.el(), "ui-list-" +  this.$style);
                }
                
                return this;
            }
        },
        
        items: function (items) {
            if (items === undefined) {
                return this.$items;
            } else {
                this.$items = items;
                return this;
            }
        },
        
        update : function () {
            if (!this.el()) {
                this.el(document.createElement("ul"));
                this.el().className =  "ui-list";
            }
            
            this.style(this.$style);
            
            var item;
            
            for (var i = 0, ln = this.$items.length; i < ln; ++i) {
                item = this.$items[i];
                
                item.update();
                
                if (item.el().parentNode !== this.el()) {
                    this.el().appendChild(item.el());
                }
                
                if (!item.header()) {
                    if (i < ln - 1) {
                        if (this.$items[i + 1].header()) {
                            Utils.Dom.addClass(item.el(), "ui-list-item-last");
                        } else {
                            Utils.Dom.removeClass(item.el(), "ui-list-item-last");
                        }
                    } else {
                        Utils.Dom.addClass(item.el(), "ui-list-item-last");
                    }
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return List;
});
