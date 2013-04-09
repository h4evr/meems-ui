/*global define*/
/**
 * A slider that allows the user to choose a value between a minimum and a maximum.
 * Exposes the attributes `label`, `minimum`, `maximum`.
 *
 * @module meems-ui
 * @submodule slider
 * @requires meems-utils
 */
define(["meems-utils", "meems-events", "./widget"], function (Utils, Events, Widget) {
    "use strict";

    /**
     * @class Slider
     * @constructor
     * @extends Widget
     */
    function Slider() {
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
            var min = this.attr('minimum') || 0,
                max = this.attr('maximum') || 100,
                perc = Math.max(Math.min((nV - min) / (max - min), 1), 0) * 100;

            this.$inputBar.style.width = perc + '%';

            /*var handleRelSize = this.$inputHandle.offsetWidth / 2.0 / (this.$input.offsetWidth * 1.0) * 100.0;

            if (perc >= 100.0 - handleRelSize) {
                perc = 100.0 - handleRelSize;
            } else if (perc < handleRelSize) {
                perc = handleRelSize;
            }*/

            this.$inputHandle.style.left = perc + '%';
        }
    };

    var onStartDrag = function (e) {
        if (this.$meems_ui_slider_move) {
            Events.Dom.off(this.$input, Events.Touch.touchMoveEventName, this.$meems_ui_slider_move);
        }

        if (this.$meems_ui_slider_end) {
            Events.Dom.off(this.$input, Events.Touch.touchEndEventName, this.$meems_ui_slider_end);
        }

        // The position of the cursor when the dragging started
        this.$meems_ui_slider_start_pos = Events.Touch.getCursorPosition(e);
        // The position of the slider
        this.$meems_ui_slider_pos = Utils.Dom.getPosition(this.$input);
        this.$meems_ui_slider_size = Utils.Dom.getDimensions(this.$input);

        var x = this.$meems_ui_slider_start_pos.x - this.$meems_ui_slider_pos.x,
            value = Math.min(Math.max(x / this.$meems_ui_slider_size.width, 0), 1),
            min = this.attr('minimum') || 0,
            max = this.attr('maximum') || 100;

        value = value * (max - min) + min;

        if (typeof(this.$value) === 'function') {
            this.$value(value);
        } else {
            this.$value = value;
            updateInput.call(this, null, value);
        }

        // Register events.
        this.$meems_ui_slider_move = Utils.Fn.bind(onMoveDrag, this);
        this.$meems_ui_slider_end = Utils.Fn.bind(onEndDrag, this);
        Events.Dom.on(this.$input, Events.Touch.touchMoveEventName, this.$meems_ui_slider_move);
        Events.Dom.on(this.$input, Events.Touch.touchEndEventName, this.$meems_ui_slider_end);

        Utils.Dom.applyChanges();

        return Events.Dom.cancelEvent(e);
    };

    var onMoveDrag = function (e) {
        var pos = Events.Touch.getCursorPosition(e);

        var x = pos.x - this.$meems_ui_slider_pos.x,
            value = Math.min(Math.max(x / this.$meems_ui_slider_size.width, 0), 1),
            min = this.attr('minimum') || 0,
            max = this.attr('maximum') || 100;

        value = value * (max - min) + min;

        if (typeof(this.$value) === 'function') {
            this.$value(value);
        } else {
            this.$value = value;
            updateInput.call(this, null, value);
        }

        return Events.Dom.cancelEvent(e);
    };

    var onEndDrag = function () {
        // Un-register events.
        Events.Dom.off(this.$input, Events.Touch.touchMoveEventName, this.$meems_ui_slider_move);
        Events.Dom.off(this.$input, Events.Touch.touchEndEventName, this.$meems_ui_slider_end);
        this.$meems_ui_slider_end = null;
        this.$meems_ui_slider_move = null;
    };

    Slider.extend(Widget, {
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

                this.$inputBar = document.createElement("div");
                this.$inputBar.className = "ui-bar";

                this.$inputHandle = document.createElement("div");
                this.$inputHandle.className = "ui-handle";

                this.$input = document.createElement("div");
                updateInput.call(this, null, this.$value);
                this.$input.appendChild(this.$inputBar);
                this.$input.appendChild(this.$inputHandle);
                this.el().appendChild(this.$label);
                this.el().appendChild(this.$input);
                this.el().className = "ui-slider";

                Events.Dom.on(this.$input, Events.Touch.touchStartEventName, Utils.Fn.bind(onStartDrag, this));

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
    
    return Slider;
});
