/*global define*/
/**
 * A component that represents a button group.
 *
 * @module meems-ui
 * @submodule buttongroup
 * @requires meems-utils
 */
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    /**
     * @class ButtonGroup
     * @constructor
     * @extends Widget
     */
    function ButtonGroup() {
        Widget.apply(this, arguments);
        this.$buttons = [];
        return this;
    }

    /**
     * Triggered when the button is clicked.
     *
     * @event button:pressed
     * @param {String} eventName The name of the event.
     * @param {HTMLElement} e The button element.
     */
    // Called when a button is clicked.
    var onButtonTapped = function (eventName, e) {
        var target = e.target;
        while (target && target.className.indexOf("ui-button") === -1) {
            target = target.parentNode;
        }
        
        if (target) {
            this.fire("button:pressed", target);
        }
    };
    
    ButtonGroup.extend(Widget, {
        /**
         * Adds a new button to the group.
         *
         * @method addButton
         * @param {Button} btn The new button
         * @return {ButtonGroup} return this to allow chaining.
         */
        addButton : function (btn) {
            this.$buttons.push(btn);
            return this;
        },

        /**
         * Getter and setter for all the buttons in this group.
         *
         * @method buttons
         * @param {Button[]} [newButtons] New array of buttons
         * @return {ButtonGroup|Button[]} return this if used as a setter or the buttons if used as getter.
         */
        buttons : function (newButtons) {
            if (newButtons === undefined) {
                return this.$buttons;
            } else {
                if (this.$buttons && this.$buttons.length > 0) {
                    var btn, i;
                    
                    for (i = 0; i < this.$buttons.length; ++i) {
                        btn = this.$buttons[i];
                        if (btn.el() && btn.el().parentNode === this.el()) {
                            this.el().removeChild(btn.el());
                        }
                    }
                }
                
                return this;
            }
        },

        update : function () {
            if (!this.el()) {
                this.el(document.createElement("div"));
                Utils.Dom.addClass(this.el(), "ui-button-group");
            }
            
            var btn,
                stretch = (this.attr("stretch") === true),
                buttonSize = this.$buttons.length > 0 ? 100.0 / this.$buttons.length : 0,
                selected = this.attr("selected") !== undefined ? this.attr("selected") : -1;
            
            for (var i = 0; i < this.$buttons.length; ++i) {
                btn = this.$buttons[i];
                
                btn.update();
                
                if (btn.el().parentNode !== this.el()) {
                    this.el().appendChild(btn.el());
                    btn.on("dom:" + (Utils.Dom.supportsTouch() ? 'touchstart' : 'click'), Utils.Fn.bind(onButtonTapped, this));
                }
                
                if (stretch) {
                    btn.el().style.width = buttonSize + "%";
                } else {
                    btn.el().style.width = "";
                }
                
                if (selected === i) {
                    Utils.Dom.addClass(btn.el(), "ui-selected");
                } else {
                    Utils.Dom.removeClass(btn.el(), "ui-selected");
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return ButtonGroup;
});
