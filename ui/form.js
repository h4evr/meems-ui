/*global define*/
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    function Form() {
        Widget.apply(this, arguments);
        this.$titleEl = null;
        this.$holder = null;
        this.$fields = [];
        return this;
    }
    
    Form.extend(Widget, {
        addField : function (field) {
            this.$fields.push(field);
        },
        
        fields : function (val) {
            if (val === undefined) {
                return this.$fields;
            } else {
                this.$fields = val;
                return this;
            }
        },
        
        update : function () {
            if (!this.el()) {
                this.el(document.createElement("form"));
                this.el().className = "ui-form";
                this.el().setAttribute("action", this.attr("action") || "#");
                
                this.$titleEl = document.createElement("div");
                this.$titleEl.className = "ui-title";
                this.el().appendChild(this.$titleEl);
                
                this.$holder = document.createElement("div");
                this.$holder.className = "ui-form-fields";
                this.el().appendChild(this.$holder);
            }

            var newTitle = this.attr("title") || "";
            Utils.Dom.setHtml(this.$titleEl, newTitle);
            this.$titleEl.style.display = (newTitle.length > 0 ? 'block' : 'none');
            
            var field;
            
            for (var i = 0; i < this.$fields.length; ++i)  {
                field = this.$fields[i];
                field.update();
                
                if (field.el().parentNode !== this.$holder) {
                    this.$holder.appendChild(field.el());
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Form;
});
