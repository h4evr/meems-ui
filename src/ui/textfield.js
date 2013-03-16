/*global define*/
/**
 * A component that allows the user to input information.
 * Exposes the attributes `label` and `type`.
 * The later can be used to change the type of input it expects, according to the HTML5 specs.
 *
 * @module meems-ui
 * @submodule textfield
 * @requires meems-utils
 */
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    /**
     * @class TextField
     * @constructor
     * @extends Widget
     */
    function TextField() {
        /**
         * @property $input
         * @private
         * @type {HTMLElement}
         */
        this.$input = null;

        /**
         * @property $label
         * @private
         * @type {String}
         */
        this.$label = null;
        Widget.apply(this, arguments);
        return this;
    }
    
    TextField.extend(Widget, {
        /**
         * Getter and setter for the value of the field.
         *
         * @method value
         * @param {observable.Observable|String} [val] The new value.
         * @return {TextField|observable,Observable|String} `this` if called as a setter,
         * the current value otherwise.
         */
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

        partialUpdate : function (attrName, oldValue, newValue) {
            if (attrName === 'label' && this.$label) {
                Utils.Dom.setHtml(this.$label, newValue || "");
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
