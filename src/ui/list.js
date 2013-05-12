/*global define*/
/**
 * List component that will render based on templates.
 * Supports header items for grouping.
 *
 * @module meems-ui
 * @submodule list
 * @requires meems-utils
 * @requires meems-events
 * @requires listitem
 * @requires html
 */
define(["meems-utils", "meems-events", "./widget", "./html"], function (Utils, Events, Widget, Html) {
    "use strict";

    /**
     * Called when the order button of an item is pressed.
     *
     * @method onStartOrdering
     * @private
     * @param {Event} e The associated mouse event.
     */
    var onStartOrdering = function (e) {
        if (this.$dragging) {
            return;
        }

        var el = this.el(),
            parent = this.parent(),
            parentEl = parent.el(),
            placeHolder = parent.$placeHolder;

        this.$dragging = true;

        Events.Dom.on(document, Events.Touch.touchMoveEventName, this.$onItemMoved);
        Events.Dom.on(document, Events.Touch.touchEndEventName, this.$onEndOrdering);

        this.$elementStartPosition = Utils.Dom.getAbsolutePosition(el);

        el.style.top = this.$elementStartPosition.y + "px";

        var elDimensions = Utils.Dom.getDimensions(el);
        el.style.width = elDimensions.width + "px";
        el.style.height = elDimensions.height + "px";
        placeHolder.className = el.className;
        placeHolder.style.width = elDimensions.width + "px";
        placeHolder.style.height = elDimensions.height + "px";

        this.$cursorStartPosition = Events.Touch.getCursorPosition(e);
        this.$elementStartPosition = Utils.Dom.getAbsolutePosition(el);

        Utils.Dom.addClass(el, "ui-list-item-drag");
        Utils.Dom.applyChanges();

        parentEl.insertBefore(placeHolder, el);

        return Events.Dom.cancelEvent(e);
    };

    /**
     * Called when the item is moved.
     *
     * @method onItemMoved
     * @private
     * @param {Event} e The associated mouse event.
     */
    var onItemMoved = function (e) {
        if (!this.$dragging) {
            return;
        }

        var el = this.el(),
            parent = this.parent(),
            parentEl = parent.el(),
            placeHolder = parent.$placeHolder,
            pos = Events.Touch.getCursorPosition(e),
            listItems = parentEl.children,
            bestItem = null,
            elHeight,
            item;

        pos.y += this.$elementStartPosition.y - this.$cursorStartPosition.y;
        el.style.top = pos.y + "px";
        var yPos = pos.y + el.offsetHeight / 2;

        for (var i = 0, ln = listItems.length; i < ln; ++i) {
            item = listItems[i];

            if (item !== el) {
                elHeight = item.offsetHeight;

                if (elHeight / 2 >= yPos) {
                    bestItem = item;
                    break;
                } else {
                    yPos -= elHeight;
                }
            }
        }

        if (bestItem === placeHolder) {
            return Events.Dom.cancelEvent(e);
        } else if (bestItem) {
            parentEl.insertBefore(placeHolder, bestItem);
        } else {
            parentEl.appendChild(placeHolder);
        }

        //return Events.Dom.cancelEvent(e);
    };

    /**
     * Called when the order button of an item is released.
     *
     * @method onEndOrdering
     * @private
     * @param {Event} e The associated mouse event.
     */
    var onEndOrdering = function (e) {
        if (!this.$dragging) {
            return;
        }

        var el = this.el(),
            parent = this.parent(),
            parentEl = parent.el(),
            placeHolder = parent.$placeHolder;

        Utils.Dom.removeClass(el, "ui-list-item-drag");
        el.style.top = "";
        el.style.width = "";
        el.style.height = "";

        Events.Dom.off(document, Events.Touch.touchMoveEventName, this.$onItemMoved);
        Events.Dom.off(document, Events.Touch.touchEndEventName, this.$onEndOrdering);

        Utils.Dom.applyChanges();

        parentEl.replaceChild(el, placeHolder);

        //noinspection JSValidateTypes
        var startPos = parent.$generatedItems.indexOf(this),
            endPos = Array.prototype.indexOf.call(parentEl.children, el);

        Utils.Array.moveElement(parent.$generatedItems, startPos, endPos);

        var items = parent.items();
        items = typeof(items) === 'function' ? items() : items;
        Utils.Array.moveElement(items, startPos, endPos);

        if (typeof(parent.items().notify) === 'function') {
            parent.items().notify(items, items);
        }

        this.$dragging = false;

        updateHeaderClasses.call(parent);

        return Events.Dom.cancelEvent(e);
    };

    /**
     * Internal class that holds a single item.
     *
     * @class ListItem
     * @private
     * @constructor
     * @extends Widget
     */
    function ListItem() {
        Widget.apply(this, arguments);
        this.$header = false;
        this.$table = null;
        this.$leftFacet = null;
        this.$rightFacet = null;
        this.$middleFacet = null;
        this.$orderButton = null;

        this.$dragging = false;
        this.$cursorStartPosition = null;
        this.$elementStartPosition = null;

        this.facet("item", null);

        this.$onItemMoved = Utils.Fn.bind(onItemMoved, this);
        this.$onEndOrdering = Utils.Fn.bind(onEndOrdering, this);

        return this;
    }

    ListItem.extend(Widget, {
        /**
         * Getter and setter for indicating if the item is a header.
         *
         * @method header
         * @param {boolean} [val] The new value for the property.
         * @chainable
         * @return {boolean|ListItem} `this` if called as a setter, the current value otherwise.
         */
        header : function (val) {
            if (val === undefined) {
                return this.$header;
            } else {
                this.$header = val;

                if (this.el()) {
                    if (this.$header) {
                        Utils.Dom.addClass(this.el(), "ui-list-header");
                        Utils.Dom.removeClass(this.el(), "ui-list-item");
                    } else {
                        Utils.Dom.addClass(this.el(), "ui-list-item");
                        Utils.Dom.removeClass(this.el(), "ui-list-header");
                    }
                }

                return this;
            }
        },

        update : function () {
            var showCheckbox = this.parent().attr('selectionMode') === 'multiple',
                showSorted = this.parent().attr('sortable') === true;

            if (!this.el()) {
                this.el(document.createElement("li"));

                if (showCheckbox || showSorted) {
                    this.$table = document.createElement("table");
                    this.$table.className = "ui-fill-width";

                    this.$leftFacet = document.createElement("td");
                    this.$middleFacet = document.createElement("td");
                    this.$middleFacet.className = "ui-fill-width";
                    this.$rightFacet = document.createElement("td");

                    var selectBox = document.createElement("input");
                    selectBox.setAttribute("type", "checkbox");
                    selectBox.className = "meems-scroll-skip";
                    Events.Dom.on(selectBox, 'change', Utils.Fn.bind(function() {
                        this.parent().fire("item:checked", this, selectBox.checked);
                    }, this));
                    this.$leftFacet.appendChild(selectBox);

                    this.$orderButton = document.createElement("div");
                    this.$orderButton.className = "ui-icon-order meems-scroll-skip";

                    Events.Dom.on(this.$orderButton, Events.Touch.touchStartEventName, Utils.Fn.bind(onStartOrdering, this));

                    this.$rightFacet.appendChild(this.$orderButton);

                    var tr = document.createElement("tr");
                    tr.appendChild(this.$leftFacet);
                    tr.appendChild(this.$middleFacet);
                    tr.appendChild(this.$rightFacet);
                    this.$table.appendChild(tr);

                    if (showCheckbox) {
                        this.$leftFacet.style.display = '';
                    } else {
                        this.$leftFacet.style.display = 'none';
                    }

                    if (showSorted) {
                        this.$rightFacet.style.display = '';
                    } else {
                        this.$rightFacet.style.display = 'none';
                    }

                    this.el().appendChild(this.$table);
                } else {
                    this.$middleFacet = this.el();
                }

                this.header(this.$header);
            }

            if (this.facet("item")) {
                this.facet("item").update();

                if (this.facet("item").el().parentNode !== this.$middleFacet) {
                    this.$middleFacet.appendChild(this.facet("item").el());
                }
            }

            Widget.prototype.update.apply(this, arguments); //super
        }
    });

    /**
     * @class List
     * @constructor
     * @extends Widget
     */
    function List() {
        Widget.apply(this, arguments);
        /**
         * @property $generatedItems
         * @private
         * @type {ListItem[]}
         */
        this.$generatedItems = [];
        /**
         * @property $items
         * @private
         * @type {observable.Observable|Array}
         */
        this.$items = [];
        /**
         * @property $template
         * @private
         * @type {string}
         */
        this.$template = "{{text}}";
        /**
         * @property $headerTemplate
         * @private
         * @type {string}
         */
        this.$headerTemplate = "{{text}}";

        /**
         * @property $placeHolder
         * @private
         * @type {HTMLElement}
         */
        this.$placeHolder = null;

        /**
         * @property $empty
         * @private
         * @type {HTMLElement}
         */
        this.$empty = null;

        this.$selectedItems = [];

        this.attr('style', 'normal');
        this.attr('sortable', false);
        this.attr('selectionMode', 'single');
        return this;
    }

    /**
     * Create a new list item.
     *
     * @method createItem
     * @private
     * @param {Object} curItem The data to bind to the item.
     * @param {Number} i The position of the item in the array.
     * @return {ListItem} The new item.
     */
    var createItem = function (curItem, i) {
        var item = new ListItem();
        item.parent(this);
        item.header(curItem.header === true);

        if (item.header()) {
            item.facet("item", (new Html()).attr("html", this.$headerTemplate).attr("data", curItem));
        } else {
            item.facet("item", (new Html()).attr("html", this.$template).attr("data", curItem));
        }

        item.update();

        item.el()._meems_parentList = this;
        item.el()._meems_item_index = i;
        item.el()._meems_item = curItem;

        return item;
    };

    var updateHeaderClasses = function () {
        var item, i, ln;

        if (this.$generatedItems) {
            for (i = 0, ln = this.$generatedItems.length; i < ln; ++i) {
                item = this.$generatedItems[i];

                if (!item.header()) {
                    if (i < ln - 1) {
                        if (this.$generatedItems[i + 1].header()) {
                            Utils.Dom.addClass(item.el(), "ui-list-item-last");
                        } else {
                            Utils.Dom.removeClass(item.el(), "ui-list-item-last");
                        }
                    } else {
                        Utils.Dom.addClass(item.el(), "ui-list-item-last");
                    }
                }
            }

            Utils.Dom.applyChanges();
        }
    };

    /**
     * Update the items DOM, based of the array of items before and after.
     *
     * @method updateItems
     * @private
     * @param {Object[]} oldItems The items before.
     * @param {Object[]|Function} newItems The new items.
     */
    var updateItems = function (oldItems, newItems) {
        if (!this.el()) {
            return;
        }

        newItems = typeof(newItems) === 'function' ? newItems() : newItems;
        var item, curItem, i, ln, el = this.el(), j, ln2;
        var processed = {};

        if (this.$generatedItems) {
            for (i = 0, ln = this.$generatedItems.length; i < ln; ++i) {
                item = this.$generatedItems[i];

                var found = false;
                for (j = 0, ln2 = newItems.length; j < ln2; ++j) {
                    if (item.el()._meems_item === newItems[j]) {
                        found = true;
                        processed[j] = i;
                        Utils.Dom.removeClass(item.el(), "ui-list-item-last");
                        el.removeChild(item.el());
                        break;
                    }
                }

                if (!found && item.el() && item.el().parentNode === el) {
                    el.removeChild(item.el());
                    this.$generatedItems.splice(i, 1);
                    var iSelected = this.$selectedItems.indexOf(item);
                    if (iSelected > -1) {
                        this.$selectedItems.splice(iSelected, 1);
                    }
                    --i;
                    --ln;
                }
            }
        }

        for (i = 0, ln = newItems.length; i < ln; ++i) {
            curItem = newItems[i];

            if (processed[i] === undefined) {
                item = createItem.call(this, curItem, i, ln);
                this.$generatedItems.splice(i, 0, item);
            } else {
                item = this.$generatedItems[processed[i]];
            }

            el.appendChild(item.el());

            if (!item.header()) {
                if (i < ln - 1) {
                    if (newItems[i + 1].header === true) {
                        Utils.Dom.addClass(item.el(), "ui-list-item-last");
                    } else {
                        Utils.Dom.removeClass(item.el(), "ui-list-item-last");
                    }
                } else {
                    Utils.Dom.addClass(item.el(), "ui-list-item-last");
                }
            }
        }

        console.log("updateItems", !this.$emptyIsVisible && this.$generatedItems.length == 0);
        if (!this.$emptyIsVisible && this.$generatedItems.length == 0) {
            console.log(el, this.$empty);
            el.appendChild(this.$empty);
            this.$emptyIsVisible = true;
        } else if (this.$emptyIsVisible && this.$generatedItems.length > 0) {
            el.removeChild(this.$empty);
            this.$emptyIsVisible = false;
        }
    };

    /**
     * Fired when an item is clicked.
     *
     * @event item:clicked
     * @param {String} eventName The event name.
     * @param {Event|observable.Observable} e The item object associated with the item that was clicked.
     */
    var onItemClicked = function (eventName, e) {
        var target = e.target;

        while(target && target._meems_item_index === undefined) {
            target = target.parentNode;
        }

        if (target) {
            this.fire("item:clicked", target._meems_item, e);
        }

        return true;
    };

    List.extend(Widget, {
        /**
         * Getter and setter for the template of an item.
         *
         * @method template
         * @param {String} [val] The new template
         * @chainable
         * @return {String|List} If no parameter is provided, the current value is returned.
         * Otherwise, the new value is stored and the List itself is returned to allow chaining.
         */
        template : function (val) {
            if (val === undefined) {
                return this.$template;
            } else {
                this.$template = val;
            }

            return this;
        },

        /**
         * Getter and setter for the template of a header item.
         *
         * @method headerTemplate
         * @param {String} [val] The new template
         * @chainable
         * @return {String|List} If no parameter is provided, the current value is returned.
         * Otherwise, the new value is stored and the List itself is returned to allow chaining.
         */
        headerTemplate : function (val) {
            if (val === undefined) {
                return this.$headerTemplate;
            } else {
                this.$headerTemplate = val;
            }

            return this;
        },

        /**
         * Getter and setter for the items of the list.
         *
         * @method item
         * @param {|observable.Observable|Object[]|observable.Observable[]} [items] The new items.
         * @chainable
         * @return {|observable.Observable|Object[]|observable.Observable[]|List} If no parameter is provided, the current value is returned.
         * Otherwise, the new value is stored and the List itself is returned to allow chaining.
         */
        items: function (items) {
            if (items === undefined) {
                return this.$items;
            } else {
                this.$items = items;

                updateItems.call(this, null, this.$items);

                if (typeof(this.$items.subscribe) === 'function') {
                    this.$items.subscribe(Utils.Fn.bind(updateItems, this));
                }

                return this;
            }
        },

        attr : function (name, val) {
            var oldStyle = name === 'style' ? Widget.prototype.attr.call(this, name) : null;
            var ret = Widget.prototype.attr.apply(this, arguments);

            if (name === 'style' && val !== undefined && this.el()) {
                if (oldStyle) {
                    Utils.Dom.removeClass(this.el(), "ui-list-" +  oldStyle);
                }

                if (val) {
                    Utils.Dom.addClass(this.el(), "ui-list-" +  val);
                }
            } else if (name === 'empty' && this.$empty) {
                Utils.Dom.setHtml(this.$empty, val);
            }

            return ret;
        },

        getSelectedItems : function () {
            return this.$selectedItems;
        },

        update : function (structureOnly) {
            if (!this.el()) {
                this.el(document.createElement("ul"));
                this.el().className =  "ui-list";
                this.on("dom:" + Events.Touch.touchEndEventName, Utils.Fn.bind(onItemClicked, this));
                this.$placeHolder = document.createElement("li");
                this.$placeHolder.className = "ui-list-item ui-list-placeholder";
                this.$empty = document.createElement("li");
                this.$empty.className = "ui-list-empty";
                this.$empty.innerHTML = this.attr("empty") || "No data.";
                this.el().appendChild(this.$empty);
                this.$emptyIsVisible = true;
                this.on("item:checked", function (eventName, item, isChecked) {
                    if (isChecked) {
                        this.$selectedItems.push(item.el()._meems_item);
                    } else {
                        this.$selectedItems.splice(this.$selectedItems.indexOf(item.el()._meems_item), 1);
                    }

                    this.fire("selection:changed", this.$selectedItems);
                });
            }

            if (structureOnly !== true) {
                this.attr('style', this.attr('style'));
                updateItems.call(this, null, this.$items);
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return List;
});
