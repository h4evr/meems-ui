/*global define*/
define(["meems-utils", "meems-events"],
/**
 * A base class for all widgets.
 * @exports Widget
 */
function (Utils, Events) {
    "use strict";

    /**
     * @constructor
     * @extends module:meems-events#Handler
     */
    function Widget() {
        this.$el = null;
        this.$parent = null;
        this.$facets = {};
        this.$attributes = {};
        this.$eventHandlers = null;

        Events.Handler.apply(this, arguments);
        
        return this;
    }

    Widget.extend(Events.Handler, /** @lends module:Widget~Widget# **/{
        on : function (eventName, fn) {
            if (eventName.indexOf('dom:') === 0) {
                if (this.$el) {
                    Events.Dom.on(this.el(), eventName.substr(4), function () {
                        Array.prototype.unshift.call(arguments, eventName);
                        fn.apply(this, arguments);
                    });
                } else {
                    this.$eventHandlers = this.$eventHandlers || [];
                    this.$eventHandlers.push([ eventName, fn ]);
                }
            } else {
                Events.Handler.prototype.on.apply(this, arguments); //super
            }

            return this;
        },
        
        off : function (eventName, fn) {
            if (eventName.indexOf('dom:') === 0) {
                Events.Dom.off(this.el(), eventName.substr(4), fn);
            } else {
                Events.Handler.prototype.off.apply(this, arguments); //super
            }

            return this;
        },

        fire : function (eventName /*, args */) {
            var elm = this;

            while (elm) {
                Events.Handler.prototype.fire.apply(elm, arguments);
                elm = elm.parent();
            }

            return this;
        },

        /**
         * Setter and getter for the DOMElement associated with this widget.
         * @param {DOMElement} [el] New value.
         * @returns {DOMElement|Widget} If no parameter is provided, the current value is returned.
         * Otherwise, the new value is stored and the Widget itself is returned to allow chaining.
         */
        el : function (el) {
            if (el === undefined) {
                return this.$el;
            } else {
                this.$el = el;

                if (this.$el && this.$eventHandlers) {
                    var ev;
                    for (var i = 0, len = this.$eventHandlers.length; i < len; ++i) {
                        ev = this.$eventHandlers[i];
                        this.on(ev[0], ev[1]);
                    }

                    this.$eventHandlers = null;
                }

                return this;
            }
        },

        /**
         * @returns {String[]} Returns the names of all the facets of this widget.
         */
        facets : function () {
            return Utils.Map.getKeys(this.$facets);
        },

        /**
         * Setter and getter for the parent of this widget.
         * @param {Widget} [val] New parent.
         * @returns {DOMElement|Widget} If no parameter is provided, the current value is returned.
         * Otherwise, the new value is stored and the Widget itself is returned to allow chaining.
         */
        parent : function (val) {
            if (val === undefined) {
                return this.$parent;
            } else {
                this.$parent = val;
                return this;
            }
        },

        /**
         * Setter and getter for the facets of this widget.
         * @param {String} name The name of the facet.
         * @param {Widget} [facet] New content of the facet.
         * @returns {Widget} If no parameter is provided, the current value is returned.
         * Otherwise, the new value is stored and the Widget itself is returned to allow chaining.
         */
        facet : function (name, facet) {
            if (facet === undefined) {
                return this.$facets[name];
            } else {
                if (this.$el && this.$facets[name] && this.$facets[name].el() &&
                    this.$facets[name].el().parentNode === this.$el) {
                    this.$el.removeChild(this.$facets[name].el());
                }
                
                this.$facets[name] = facet;
                return this;
            }
        },

        /**
         * Setter and getter for the attributes of this widget.
         * @param {String} name The name of the attribute.
         * @param {Mixed} [val] New value of the attribute.
         * @returns {Widget|Mixed} If no parameter is provided, the current value is returned.
         * Otherwise, the new value is stored and the Widget itself is returned to allow chaining.
         */
        attr : function (name, val) {
            if (val === undefined) {
                var value = this.$attributes[name];

                if (typeof value === 'function') {
                    return value();
                } else {
                    return value;
                }
            } else {
                this.$attributes[name] = val;

                if (val && val.subscribe !== undefined && typeof(val.subscribe) === 'function') {
                    val.subscribe((function (name, self) {
                        return Utils.bind(function(oldValue, newValue) {
                            this.partialUpdate(name, oldValue, newValue);
                        }, self);
                    }(name, this)));
                }

                return this;
            }
        },

        /**
         * Called when an (observable) attribute changes, in order to allow the Widget to update itself.
         * @param {String} attrName The name of the attribute that has changed.
         * @param {Mixed} oldValue Its old value.
         * @param {Mixed} newValue Its new value.
         */
        partialUpdate : function (attrName, oldValue, newValue) {
            this.update();
        },

        /**
         * Called for creating and updating the Widget's DOM nodes.
         */
        update : function () {
            //Utils.Dom.applyChanges();
        }
    });

    return Widget;
});
