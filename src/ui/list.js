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
        this.facet("item", null);
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
            if (!this.el()) {
                this.el(document.createElement("li"));
                this.header(this.$header);
            }

            if (this.facet("item")) {
                this.facet("item").update();

                if (this.facet("item").el().parentNode !== this.el()) {
                    this.el().appendChild(this.facet("item").el());
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
        this.attr('style', 'normal');
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

    /**
     * Update the items DOM, based of the array of items before and after.
     *
     * @method updateItems
     * @private
     * @param {Object[]} oldItems The items before.
     * @param {Object[]} newItems The new items.
     */
    var updateItems = function (oldItems, newItems) {
        if (!this.el()) {
            return;
        }

        var item, curItem, i, ln, el = this.el(), j, ln2;
        var processed = [];

        if (this.$generatedItems) {
            for (i = 0, ln = this.$generatedItems.length; i < ln; ++i) {
                item = this.$generatedItems[i];

                var found = false;
                for (j = 0, ln2 = newItems.length; j < ln2; ++j) {
                    if (item.el()._meems_item === newItems[j]) {
                        found = true;
                        processed.push(j);
                        Utils.Dom.removeClass(item.el(), "ui-list-item-last");
                        break;
                    }
                }

                if (!found && item.el() && item.el().parentNode === el) {
                    el.removeChild(item.el());
                }
            }
        }

        for (i = 0, ln = newItems.length; i < ln; ++i) {
            curItem = newItems[i];

            if (processed.indexOf(i) == -1) {
                item = createItem.call(this, curItem, i, ln);
                el.insertBefore(item.el(), el.childNodes[i]);
                this.$generatedItems.splice(i, 0, item);
            } else {
                item = this.$generatedItems[i];
            }

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
    };

    /**
     * Fired when an item is clicked.
     *
     * @event item:clicked
     * @param {String} eventName The event name.
     * @param {Object|observable.Observable} e The item object associated with the item that was clicked.
     */
    var onItemClicked = function (eventName, e) {
        var target = e.target;

        while(target && target._meems_item_index === undefined) {
            target = target.parentNode;
        }

        if (target) {
            this.fire("item:clicked", target._meems_item);
        }
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
                var item, curItem, i, ln, el = this.el();

                if (this.$generatedItems && el) {
                    for (i = 0, ln = this.$generatedItems.length; i < ln; ++i) {
                        item = this.$generatedItems[i];
                        if (item.el()) {
                            el.removeChild(item.el());
                        }
                    }
                }

                this.$items = items;

                if (this.$items && el) {
                    var newItems = typeof(this.$items) === 'function' ? this.$items() : this.$items;

                    this.$generatedItems = [];

                    for (i = 0, ln = newItems.length; i < ln; ++i) {
                        curItem = newItems[i];
                        item = createItem.call(this, curItem, i, ln);

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

                        el.appendChild(item.el());
                        this.$generatedItems.push(item);
                    }

                    if (typeof(this.$items.subscribe) === 'function') {
                        this.$items.subscribe(Utils.Fn.bind(updateItems, this));
                    }
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
            }

            return ret;
        },

        update : function () {
            if (!this.el()) {
                this.el(document.createElement("ul"));
                this.el().className =  "ui-list";
                this.on("dom:" + Events.Touch.touchEndEventName, Utils.Fn.bind(onItemClicked, this));
            }
            
            this.attr('style', this.attr('style'));
            this.items(this.$items);
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return List;
});
