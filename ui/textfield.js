define(["meems-utils", "./widget"], function(Utils, Widget) {
    function TextField() {
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
                this.el(document.createElement("input"));
                this.el().setAttribute("type", this.attr("type") || "text");
                this.el().setAttribute("placeholder", this.attr("label") || "");
                this.el().className = "ui-textfield";
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return TextField;
});