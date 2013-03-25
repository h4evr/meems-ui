/*global define*/
/**
 * A form that can hold several input widgets.
 * The attributes 'action' and 'title' are available.
 *
 * @module meems-ui
 * @submodule form
 * @requires meems-utils
 */
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    /**
     * @class Form
     * @constructor
     * @extends Widget
     */
    function Form() {
        Widget.apply(this, arguments);
        this.$titleEl = null;
        this.$holder = null;
        this.$fields = [];
        return this;
    }
    
    Form.extend(Widget, {
        /**
         * Add a new field to the form.
         *
         * @method addField
         * @param {Widget} field
         * @chainable
         */
        addField : function (field) {
            this.$fields.push(field);
            return this;
        },

        /**
         * Getter and setter for the fields of the form.
         *
         * @method fields
         * @param {Widget[]} [val] Array with the new fields
         * @return {Widget} If no parameter is provided, the current value is returned.
         * Otherwise, the new value is stored and the Form itself is returned to allow chaining.
         */
        fields : function (val) {
            if (val === undefined) {
                return this.$fields;
            } else {
                this.$fields = val;
                return this;
            }
        },

        partialUpdate : function (attrName, oldValue, newValue) {
            if (attrName === 'action' && this.el()) {
                this.el().setAttribute("action", newValue || "#");
            } else if (attrName === 'title' && this.$titleEl) {
                Utils.Dom.setHtml(this.$titleEl, newValue);
                if (newValue.length > 0) {
                    Utils.Dom.addClass(this.$titleEl, 'ui-show');
                    Utils.Dom.removeClass(this.$titleEl, 'ui-hide');
                } else {
                    Utils.Dom.addClass(this.$titleEl, 'ui-hide');
                    Utils.Dom.removeClass(this.$titleEl, 'ui-show');
                }
            }
        },
        
        update : function (structureOnly) {
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
            if (newTitle.length > 0) {
                Utils.Dom.addClass(this.$titleEl, 'ui-show');
                Utils.Dom.removeClass(this.$titleEl, 'ui-hide');
            } else {
                Utils.Dom.addClass(this.$titleEl, 'ui-hide');
                Utils.Dom.removeClass(this.$titleEl, 'ui-show');
            }
            
            var field;
            
            for (var i = 0; i < this.$fields.length; ++i)  {
                field = this.$fields[i];
                field.update(structureOnly);
                
                if (field.el().parentNode !== this.$holder) {
                    this.$holder.appendChild(field.el());
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Form;
});
