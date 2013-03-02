/*global define*/
define(["meems-utils", "meems-events"], function (Utils, Events) {
    "use strict";

    function Widget() {
        this.$el = null;
        this.$facets = {};
        this.$attributes = {};
        
        Events.Handler.apply(this, arguments);
        
        return this;
    }

    Widget.extend(Events.Handler, {
        on : function (eventName, fn) {
            if (eventName.indexOf('dom:') === 0) {
                Events.Dom.on(this.el(), eventName.substr(4), function () {
                    Array.prototype.unshift.call(arguments, eventName);
                    fn.apply(this, arguments);
                });
            } else {
                Events.Handler.prototype.on.apply(this, arguments); //super
            }
        },
        
        off : function (eventName, fn) {
            if (eventName.indexOf('dom:') === 0) {
                Events.Dom.off(this.el(), eventName.substr(4), fn);
            } else {
                Events.Handler.prototype.off.apply(this, arguments); //super
            }
        },
        
        el : function (el) {
            if (el === undefined) {
                return this.$el;
            } else {
                this.$el = el;
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
