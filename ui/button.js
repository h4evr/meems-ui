define(["meems-utils", "./widget"], function(Utils, Widget) {
    function Button() {
        Widget.apply(this, arguments);    
        this._iconEl = null;
        this._titleEl = null;
        return this;
    }
    
    Button.extend(Widget, {
        attr : function (name, val) {
            if (name === 'style' && val !== undefined && this.el()) {
                var oldStyle = Widget.prototype.attr.call(this, name);
                
                if (oldStyle) {
                    Utils.Dom.removeClass(this.el(), "ui-button-" + oldStyle);
                } else {
                    Utils.Dom.removeClass(this.el(), "ui-button-normal");
                }
                
                if (val) {
                    Utils.Dom.addClass(this.el(), "ui-button-" + val);
                } else {
                    Utils.Dom.addClass(this.el(), "ui-button-normal");
                }
            }
            
            return Widget.prototype.attr.apply(this, arguments);
        },
        
        update : function () {            
            if (!this.el()) {
                this.el(document.createElement("div"));
                
                this._iconEl = document.createElement("div");
                this._iconEl.className = "ui-icon";
                this.el().appendChild(this._iconEl);
                
                this._titleEl = document.createElement("div");
                this._titleEl.className = "ui-title";
                this.el().appendChild(this._titleEl);
                
                Utils.Dom.addClass(this.el(), "ui-button");
            }
            
            Utils.Dom.setClass(this._iconEl, (this.attr("icon") ? "ui-icon ui-icon-" + this.attr("icon") : "ui-no-icon") 
                                   + (this.attr("disabled") === true ? " ui-disabled" : ""));
            Utils.Dom.setHtml(this._titleEl, this.attr("title"));
            
            this.attr("style", this.attr("style") !== undefined ? this.attr("style") : null);
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Button;
});