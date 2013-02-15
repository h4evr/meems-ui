define(["meems-utils", "./widget"], function(Utils, Widget) {
    function Button() {
        Widget.apply(this, arguments);    
        this._iconEl = null;
        this._titleEl = null;
        return this;
    }
    
    Button.extend(Widget, {
        update : function () {
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("div"));
                
                this._iconEl = document.createElement("div");
                this._iconEl.className = "ui-icon";
                this.el().appendChild(this._iconEl);
                
                this._titleEl = document.createElement("div");
                this._titleEl.className = "ui-title";
                this.el().appendChild(this._titleEl);
            }
            
            Utils.Dom.addClass(this.el(), "ui-button");
            
            this._iconEl.className = (this.attr("icon") ? "ui-icon ui-icon-" + this.attr("icon") : "ui-no-icon");
            this._titleEl.innerHTML = this.attr("title");
        }
    });
    
    return Button;
});