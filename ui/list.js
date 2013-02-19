define(["meems-utils", "./widget"], function(Utils, Widget) {
    function List() {
        Widget.apply(this, arguments);    
        this._items = [];
        this._style = 'normal';
        return this;
    }
    
    List.extend(Widget, {
        style : function (val) {
            if (val === undefined) {
                return this._style;
            } else {
                if (this.el() && this._style) {
                    Utils.Dom.removeClass(this.el(), "ui-list-" +  this._style);
                }
                
                this._style = val;
                
                if (this.el() && this._style) {
                    Utils.Dom.addClass(this.el(), "ui-list-" +  this._style);
                }
                
                return this;
            }
        },
        
        items: function (items) {
            if (items === undefined) {
                return this._items;
            } else {
                this._items = items;
                return this;
            }
        },
        
        update : function () {
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("ul"));
            }
            
            Utils.Dom.addClass(this.el(), "ui-list");
            
            this.style(this._style);
            
            var item;
            
            for (var i = 0; i < this._items.length; ++i) {
                item = this._items[i];
                
                item.update();
                
                if (item.el().parentNode !== this.el()) {
                    this.el().appendChild(item.el());
                }
                
                if (!item.header()) {
                    if (i < this._items.length - 1) {
                        if (this._items[i+1].header()) {
                            Utils.Dom.addClass(item.el(), "ui-list-item-last");
                        } else {
                            Utils.Dom.removeClass(item.el(), "ui-list-item-last");
                        }
                    } else {
                        Utils.Dom.addClass(item.el(), "ui-list-item-last");
                    }
                }
            }
        }
    });
    
    return List;
});