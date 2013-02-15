define(["meems-utils", "meems-events"], function(Utils, Events) {
    function Widget() {
        this._el = null;
        this._facets = {};
        this._attributes = {};
        
        return this;
    }

    Widget.extend(Events.Handler, {
        on : function (eventName, fn) {
            if (eventName.indexOf('dom:') === 0) {
                Events.Dom.on(this.el(), eventName.substr(4), fn);
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
                return this._el;
            } else {
                this._el = el;
                return this;
            }
        },
        
        facets : function() {
            return Utils.Map.getKeys(this._facets);
        },
        
        facet : function(name, facet) {
            if (facet === undefined) {
                return this._facets[name];
            } else {
                this._facets[name] = facet;
                return this;
            }
        },
        
        attr : function (name, val) {
            if (val === undefined) {
                return this._attributes[name];
            } else {
                this._attributes[name] = val;
                return this;
            }
        },
        
        update : function () {
            
        }
    });

    return Widget;
});