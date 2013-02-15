define(["meems-utils"], function(Utils) {
    function Widget() {
        this._el = null;
        this._facets = {};
        this._attributes = {};
        
        return this;
    }

    Widget.prototype = {
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
    };

    return Widget;
});