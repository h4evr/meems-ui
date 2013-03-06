/*global define*/
define(["meems-utils", "meems-events"], function (Utils, Events) {
    "use strict";

    function Widget() {
        this.$el = null;
        this.$facets = {};
        this.$attributes = {};
        this.$eventHandlers = null;

        Events.Handler.apply(this, arguments);
        
        return this;
    }

    Widget.extend(Events.Handler, {
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
        
        facets : function () {
            return Utils.Map.getKeys(this.$facets);
        },
        
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
        
        attr : function (name, val) {
            if (val === undefined) {
                return this.$attributes[name];
            } else {
                this.$attributes[name] = val;
                return this;
            }
        },
        
        update : function () {
            //Utils.Dom.applyChanges();
        }
    });

    return Widget;
});
