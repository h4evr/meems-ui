/*global define*/
/**
 * Pops up a menu with items.
 *
 * @module meems-ui
 * @submodule popupmenu
 * @requires meems-utils meems-events widget
 */
define(["meems-utils", "meems-events", "./widget"], function (Utils, Events, Widget) {
    "use strict";

    /**
     * @class PopupMenu
     * @constructor
     * @extends Widget
     */
    function PopupMenu() {
        /**
         * @property $ul
         * @private
         * @type {HTMLElement}
         */
        this.$ul = null;
        /**
         * @property $items
         * @private
         * @type {Observable|Array}
         */
        this.$items = [];

        Widget.apply(this, arguments);
        return this;
    }

    var updateListItems = function (oldItems, newItems) {
        this.$ul.innerHTML = "";

        for (var i = 0, len = newItems.length; i < len; ++i) {
            var li = document.createElement("li");
            li.innerHTML = newItems[i].text;
            li.className = "ui-popup-item";
            this.$ul.appendChild(li);
        }

        if (this.$ul.childNodes.length > 0) {
            this.$ul.childNodes[0].className += " ui-popup-item-first";
            this.$ul.childNodes[this.$ul.childNodes.length - 1].className += " ui-popup-item-last";
        }
    };

    var visiblePopups = [];
    var dismissHandlerInstalled = false;
    var dismissPopups = function (e) {
        var target = e.target;

        while (target && ((target.className && target.className.indexOf("ui-popup-item") === -1) || !target.className)) {
            target = target.parentNode;
        }

        if (target) {
            var popupEl = target.parentNode.parentNode,
                pos = Utils.Array.indexOfByProp(visiblePopups, "$el", popupEl);
            if (pos > -1) {
                var masterPopup = visiblePopups[pos],
                    itemIndex = Array.prototype.indexOf.call(target.parentNode.childNodes, target),
                    item = masterPopup.$items[itemIndex],
                    action = item.action;

                if (action) {
                    action.call(masterPopup, item);
                }
            }
        }

        var popup;
        for (var i = 0, len = visiblePopups.length; i < len; ++i) {
            popup = visiblePopups[i];

            if (popup.el() && popup.el().parentNode !== null) {
                if (popup.$lastShow && ((new Date()).getTime() - popup.$lastShow.getTime()) > 500) {
                    document.body.removeChild(popup.el());
                    popup.$lastShow = null;
                    visiblePopups.splice(i, 0);
                    --len; --i;
                }
            }
        }
    };

    PopupMenu.extend(Widget, {
        /**
         * Getter and setter for the value of the field.
         *
         * @method value
         * @param {observable.Observable|String} [val] The new value.
         * @return {TextField|observable,Observable|String} `this` if called as a setter,
         * the current value otherwise.
         */
        items : function (val) {
            if (val === undefined) {
                return this.$items;
            } else {
                updateListItems.call(this, this.$items, val);
                this.$items = val;
                return this;
            }
        },

        isVisible : function () {
            return this.el().parentNode !== null;
        },

        hide : function () {
            if (this.el().parentNode !== null) {
                document.body.removeChild(this.el());
                this.$lastShow = null;
                Utils.Array.remove(visiblePopups, this);
            }

            return this;
        },

        show : function (cmp, pos, offsetX, offsetY) {
            var cmpDomPos = Utils.Dom.getRect(cmp),
                x = cmpDomPos.x,
                y = cmpDomPos.y,
                xCoord = 'left',
                yCoord = 'top';

            if (pos.indexOf('below') > -1) {
                y = cmpDomPos.y + cmpDomPos.height;
            }

            if (pos.indexOf('right') > -1) {
                x = document.body.clientWidth - cmpDomPos.x - cmpDomPos.width;
                xCoord = 'right';
            }

            x += offsetX || 0;
            y += offsetY || 0;

            this.el().style[xCoord] = x + 'px';
            this.el().style[yCoord] = y + 'px';

            document.body.appendChild(this.el());
            this.$lastShow = new Date();

            visiblePopups.push(this);

            return this;
        },

        update : function () {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.$ul = document.createElement("ul");
                this.el().appendChild(this.$ul);
                this.el().className = "ui-popup-menu";

                if (typeof (this.$items) === 'function') {
                    if ("subscribe" in this.$items) {
                        this.$items.subscribe(Utils.Fn.bind(updateListItems, this));
                    }
                }

                if (!dismissHandlerInstalled) {
                    Events.Dom.on(document, Events.Touch.touchEndEventName, dismissPopups);
                    dismissHandlerInstalled = true;
                }
            }

            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return PopupMenu;
});
