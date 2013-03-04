/*global define*/
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    function TextField() {
        this.$input = null;
        this.$label = null;
        Widget.apply(this, arguments);
        return this;
    }
    
    TextField.extend(Widget, {
        value : function (val) {
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
                this.$label = document.createElement("label");
                this.$input = document.createElement("input");
                this.$input.setAttribute("type", this.attr("type") || "text");
                this.el().appendChild(this.$label);
                var tmp = document.createElement("div");
                tmp.appendChild(this.$input);
                this.el().appendChild(tmp);
                this.el().className = "ui-textfield";
            }
            
            Utils.Dom.setHtml(this.$label, this.attr("label") || "");
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return TextField;
});
