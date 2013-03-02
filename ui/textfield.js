define(["meems-utils", "./widget"], function(Utils, Widget) {
    function TextField() {
        this._input = null;
        this._label = null;
        Widget.apply(this, arguments);
        return this;
    }
    
    TextField.extend(Widget, {
        value : function(val) {
            if (this.el()) {
                if (val === undefined) {
                    return this.el().value;
                } else {
                    this.el().value = val;
                    return this;
                }
            } else {
                return val === undefined ? this : null;
            }
        },
        
        update : function () {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this._label = document.createElement("label");
                this._input = document.createElement("input");
                this._input.setAttribute("type", this.attr("type") || "text");
                this.el().appendChild(this._label);
                this.el().appendChild(this._input);
                this.el().className = "ui-textfield";
            }
            
            Utils.Dom.setHtml(this._label, this.attr("label") || "");
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return TextField;
});