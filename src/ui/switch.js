/*global define*/
/**
 * A toggle button that allows a user to set something on or off.
 * Exposes the attributes `label`.
 *
 * @module meems-ui
 * @submodule switch
 * @requires meems-utils
 */
define(["meems-utils", "meems-events", "./widget"], function (Utils, Events, Widget) {
    "use strict";

    /**
     * @class Switch
     * @constructor
     * @extends Widget
     */
    function Switch() {
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

        this.$value = false;

        Widget.apply(this, arguments);
        return this;
    }

    var updateInput = function (oldVal, newVal) {
        var nV = typeof(newVal) === 'function' ? newVal() : newVal;

        if (this.$input) {
            this.$input.checked = nV;
        }
    };

    Switch.extend(Widget, {
        /**
         * Getter and setter for the value of the field.
         *
         * @method value
         * @param {observable.Observable|String} [val] The new value.
         * @return {TextField|observable,Observable|String} `this` if called as a setter,
         * the current value otherwise.
         */
        value : function (val) {
            if (val === undefined) {
                return this.$value;
            } else {
                updateInput.call(this, this.$value, val);
                this.$value = val;
                return this;
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
                this.$inputLabel = document.createElement("label");
                this.$inputLabel.appendChild(document.createElement("b"));
                this.$input.setAttribute("type", "checkbox");
                this.$input.setAttribute("checked", "checkbox");

                var div = document.createElement("div");
                updateInput.call(this, null, this.$value);
                div.appendChild(this.$input);
                div.appendChild(this.$inputLabel);
                this.el().appendChild(this.$label);
                this.el().appendChild(div);
                this.el().className = "ui-switch";

                Events.Dom.on(div, Events.Touch.touchEndEventName, Utils.Fn.bind(function () {
                    if (typeof(this.$value) === 'function') {
                        var newVal = !this.$value();
                        this.$input.checked = newVal;
                        this.$value(newVal);
                    } else {
                        updateInput.call(this, this.$value, !this.$value);
                        this.$value = !this.$value;
                        this.$input.checked = this.$value;
                    }
                    Utils.Dom.applyChanges();
                }, this));

                if (typeof (this.$value) === 'function') {
                    if ("subscribe" in this.$value) {
                        this.$value.subscribe(Utils.Fn.bind(updateInput, this));
                    }
                }
            }
            
            Utils.Dom.setHtml(this.$label, this.attr("label") || "");
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Switch;
});
