define(function() {
    /**
     * Represents an observable object.
     * To retrieve the current value, just call as a function without parameters.
     * To change the current value, call as a function, providing the new value as first parameter.
     * @constructor Observable
     * @param val The initial value.
     */
    function Observable(val) {
        var retFunc = function (newVal) {
            var self = arguments.callee;

            if (newVal === undefined) {
                return self.$currentVal;
            } else {
                var oldValue = self.$currentVal;
                self.$currentVal = newVal;
                self.notify(oldValue, newVal);
                return this;
            }
        };

        retFunc.$currentVal = val;
        retFunc.$observers = [];

        retFunc.subscribe = Observable.prototype.subscribe;
        retFunc.unsubscribe = Observable.prototype.unsubscribe;
        retFunc.notify = Observable.prototype.notify;

        return retFunc;
    }

    /**
     * Subscribe a new observer.
     * @function Observable#subscribe
     * @param {Observable~observer} callback - The observer to subscribe.
     * @returns {Observable} this
     */
    Observable.prototype.subscribe = function (callback) {
        this.$observers.push(callback);
        return this;
    };

    /**
     * Remove an existing observer.
     * @function Observable#unsubscribe
     * @param {Observable~observer} callback - The observer to remove.
     * @returns {Observable} this
     */
    Observable.prototype.unsubscribe = function (callback) {
        this.$observers.remove(callback);
        return this;
    };

    /**
     * Notify all subscribers that a change has occurred.
     * @function Observable#notify
     * @param oldValue - The value of the property before being changed.
     * @param newValue - The new value of the property.
     * @returns {Observable} this
     */
    Observable.prototype.notify = function (oldValue, newValue) {
        for (var i = 0, ln = this.$observers.length; i < ln; ++i) {
            this.$observers[i].call(this, oldValue, newValue);
        }

        return this;
    };


    /**
     * Called when the property changes value.
     * @callback Observable~observer
     * @param oldValue - The value of the property before being changed.
     * @param newValue - The new value of the property.
     */

    /**
     * Helper method for intercepting method calls and invoking notify.
     * @param method - The method to intercept.
     * @returns {Function} The method with an interceptor.
     */
    var createProxyMethod = function (method) {
        return function () {
            var oldValue = this.$currentVal;
            method.apply(this.$currentVal, arguments);
            this.notify(oldValue, this.$currentVal);
        };
    };

    /*
     * All array methods that must be intercepted in order to trigger the
     * notify function.
     */
    var arrayMethods = {
        'indexOf': createProxyMethod(Array.prototype.indexOf),
        'push': createProxyMethod(Array.prototype.push),
        'pop': createProxyMethod(Array.prototype.pop),
        'slice': createProxyMethod(Array.prototype.slice),
        'splice': createProxyMethod(Array.prototype.splice),
        'shift': createProxyMethod(Array.prototype.shift),
        'unshift': createProxyMethod(Array.prototype.unshift),
        'reverse': createProxyMethod(Array.prototype.reverse),
        'sort': createProxyMethod(Array.prototype.sort),
        'remove': createProxyMethod(Array.prototype.remove)
    };

    /**
     * This class provides helper methods for detecting changes in object properties,
     * triggering observers when anything happens.
     * @author Diogo Costa
     * @exports observable
     */
    var ViewModelTools = {
        /**
         * Creates a new observable property.
         * @param [val] - The initial value for the property.
         * @returns {Observable} The new observable.
         */
        observable : function (val) {
            return new Observable(val);
        },

        /**
         * Creates a new observable array.
         * Note that notifications will only be triggered when the structure of the
         * array is changed. Modifications to properties of elements of the array will
         * not be detected. For that, you must define them as observable properties.
         * @param [startArray] - The initial array.
         * @returns {Observable} The new observable.
         */
        observableArray : function (startArray) {
            var funcRet = ViewModelTools.observable(startArray || []);
            for (var k in arrayMethods) {
                funcRet[k] = arrayMethods[k];
            }
            return funcRet;
        }
    };

    return ViewModelTools;
});