/*global define*/
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    function Button() {
        Widget.apply(this, arguments);
        this.$iconEl = null;
        this.$titleEl = null;
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
                
                this.$iconEl = document.createElement("div");
                this.$iconEl.className = "ui-icon";
                this.el().appendChild(this.$iconEl);
                
                this.$titleEl = document.createElement("div");
                this.$titleEl.className = "ui-title";
                this.el().appendChild(this.$titleEl);
                
                Utils.Dom.addClass(this.el(), "ui-button");
            }
            
            Utils.Dom.setClass(this.$iconEl, (this.attr("icon") ? "ui-icon ui-icon-" + this.attr("icon") : "ui-no-icon")
                                   + (this.attr("disabled") === true ? " ui-disabled" : ""));
            Utils.Dom.setHtml(this.$titleEl, this.attr("title"));
            
            this.attr("style", this.attr("style") !== undefined ? this.attr("style") : null);
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Button;
});
