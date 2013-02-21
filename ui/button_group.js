define(["meems-utils", "./widget"], function(Utils, Widget) {
    function ButtonGroup() {
        Widget.apply(this, arguments);    
        this._buttons = [];
        return this;
    }
    
    function onButtonTapped(eventName, e) {
        var target = e.target;
        while (target && target.className.indexOf("ui-button") === -1) {
            target = target.parentNode;
        }
        
        if (target) {
            this.fire("button:pressed", target);
        }
    }
    
    ButtonGroup.extend(Widget, {
        addButton : function (btn) {
            this._buttons.push(btn);
            return this;
        },
        
        buttons : function (newButtons) {
            if (newButtons === undefined) {
                return this._buttons;
            } else {
                if (this._buttons && this._buttons.length > 0) {
                    var btn, i;
                    
                    for (i = 0; i < this._buttons.length; ++i) {
                        btn = this._buttons[i];
                        if (btn.el() && btn.el().parentNode === this.el()) {
                            this.el().removeChild(btn.el());
                        }
                    }
                }
                
                return this;
            }
        },
        
        update : function () {
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("div"));
            }
            
            Utils.Dom.addClass(this.el(), "ui-button-group");
            
            var btn, 
                stretch = (this.attr("stretch") === true),
                buttonSize = this._buttons.length > 0 ? 100.0 / this._buttons.length : 0,
                selected = this.attr("selected") !== undefined ? this.attr("selected") : -1;
            
            for (var i = 0; i < this._buttons.length; ++i) {
                btn = this._buttons[i];
                
                btn.update();
                
                if (btn.el().parentNode !== this.el()) {
                    this.el().appendChild(btn.el());
                    btn.on("dom:" + (Utils.Dom.supportsTouch() ? 'touchstart' : 'click'), Utils.bind(onButtonTapped, this));
                }
                
                if (stretch) {
                    btn.el().style.width = buttonSize + "%";
                } else {
                    btn.el().style.width = "";
                }
                
                if (selected === i) {
                    Utils.Dom.addClass(btn.el(), "ui-selected");
                } else {
                    Utils.Dom.removeClass(btn.el(), "ui-selected");
                }
            }
        }
    });
    
    return ButtonGroup;
});