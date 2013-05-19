/*global define*/
/**
 * A component that represents a button group.
 *
 * @module meems-ui
 * @submodule buttongroup
 * @requires meems-utils widget button
 */
define(["meems-utils", "./widget", "./button", "./popup_menu"], function (Utils, Widget, Button, PopupMenu) {
    "use strict";

    /**
     * @class ButtonGroup
     * @constructor
     * @extends Widget
     */
    function ButtonGroup() {
        Widget.apply(this, arguments);
        this.$buttons = [];
        this.$overflow = null;
        this.$popupMenu = null;
        return this;
    }

    /**
     * Triggered when the button is clicked.
     *
     * @event button:pressed
     * @param {String} eventName The name of the event.
     * @param {Event} e The event element.
     */
    // Called when a button is clicked.
    var onButtonTapped = function (eventName, e) {
        var target = e.target;

        while (target && ((target.className && target.className.indexOf("ui-button") === -1) || !target.className)) {
            target = target.parentNode;
        }
        
        if (target) {
            if (target === this.$overflow.el()) {
                showOverflowMenu.call(this);
            } else {
                var index = Utils.Array.indexOfByProp(this.$buttons, "$el", target);
                if (index > -1) {
                    this.fire("button:pressed", this.$buttons[index]);
                }
            }
        }
    };

    var updateButtons = function(structureOnly) {
        if (this.el()) {
            var btn,
                el = this.el(),
                stretch = (this.attr("stretch") === true),
                buttonSize = this.$buttons.length > 0 ? 100.0 / this.$buttons.length : 0,
                selected = this.attr("selected") !== undefined ? this.attr("selected") : -1,
                totalButtonsToShow = Math.min(this.attr("maxButtons") || 9999, this.$buttons.length);

            if (totalButtonsToShow < this.$buttons.length) {
                --totalButtonsToShow; // take out the overflow button
            }

            if (this.$overflow.el().parentNode === el) {
                el.removeChild(this.$overflow.el());
            }

            for (var i = 0; i < totalButtonsToShow; ++i) {
                btn = this.$buttons[i];

                btn.update(structureOnly);

                if (btn.el().parentNode !== el) {
                    el.appendChild(btn.el());
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

            for (var i = totalButtonsToShow; i < this.$buttons.length; ++i) {
                btn = this.$buttons[i];
                if (btn.el() && btn.el().parentNode === el) {
                    el.removeChild(btn.el());
                }
            }

            if (totalButtonsToShow !== this.$buttons.length) {
                // Add overflow button.
                if (this.$overflow.el().parentNode !== el) {
                    el.appendChild(this.$overflow.el());
                }
            } else {
                // Remove overflow button.
                if (this.$overflow.el().parentNode === el) {
                    el.removeChild(this.$overflow.el());
                }
            }
        }
    };

    var showOverflowMenu = function () {
        if (this.$popupMenu.isVisible()) {
            this.$popupMenu.hide();
            return;
        }

        var totalButtonsToShow = Math.min(this.attr("maxButtons") || 9999, this.$buttons.length);

        if (totalButtonsToShow < this.$buttons.length) {
            --totalButtonsToShow; // take out the overflow button
        }

        var btn, menuitems = [];
        for (var i = totalButtonsToShow, len = this.$buttons.length; i < len; ++i) {
            btn = this.$buttons[i];
            menuitems.push({
                text : btn.attr('title'),
                action : (function (self, b) {
                    return function () {
                        self.fire("button:pressed", b);
                    };
                })(this, btn)
            });
        }

        console.log(menuitems);
        this.$popupMenu.items(menuitems);
        this.$popupMenu.show(this.$overflow.el(), 'below-right-aligned', 0, 5);
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

                this.$buttons = newButtons;

                updateButtons.call(this);

                return this;
            }
        },

        update : function (structureOnly) {
            if (!this.el()) {
                this.el(document.createElement("div"));
                Utils.Dom.addClass(this.el(), "ui-button-group");
                this.$overflow = (new Button()).attr('icon', 'overflow').attr('title', 'More');
                this.$overflow.update();
                this.$overflow.on("dom:" + (Utils.Dom.supportsTouch() ? 'touchstart' : 'click'), Utils.Fn.bind(onButtonTapped, this));
                this.$popupMenu = new PopupMenu();
                this.$popupMenu.update();
            }

            updateButtons.call(this, structureOnly);
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return ButtonGroup;
});
