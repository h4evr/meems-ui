define(["meems-utils", "./widget"], function(Utils, Widget) {
    function ButtonGroup() {
        Widget.apply(this, arguments);    
        this._buttons = [];
        return this;
    }
    
    ButtonGroup.extend(Widget, {
        addButton : function (btn) {
            this._buttons.push(btn);
            return this;
        },
        
        buttons : function () {
            return this._buttons;
        },
        
        update : function () {
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("div"));
            }
            
            Utils.Dom.addClass(this.el(), "ui-button-group");
            
            var btn;
            
            for (var i = 0; i < this._buttons.length; ++i) {
                btn = this._buttons[i];
                
                btn.update();
                
                if (btn.el().parentNode !== this.el()) {
                    this.el().appendChild(btn.el());
                }
            }
        }
    });
    
    return ButtonGroup;
});