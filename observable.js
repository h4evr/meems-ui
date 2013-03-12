define(function() {
    var subscribe = function (callback) {
        this.$observers.push(callback);
        return this;
    };

    var unsubscribe = function (callback) {
        this.$observers.remove(callback);
        return this;
    };

    var notify = function (oldValue, newValue) {
        for (var i = 0, ln = this.$observers.length; i < ln; ++i) {
            this.$observers[i].call(this, oldValue, newValue);
        }

        return this;
    };

    function observable(val) {
        var funcRet = (function (val) {
            var retFunc =  function (newVal) {
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
            retFunc.subscribe = subscribe;
            retFunc.unsubscribe = unsubscribe;
            retFunc.notify = notify;

            return retFunc;
        }(val));

        return funcRet
    }

    var createProxyMethod = function (method) {
        return function () {
            var oldValue = this.$currentVal;
            method.apply(this.$currentVal, arguments);
            this.notify(oldValue, this.$currentVal);
        };
    };

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

    function observableArray(startArray) {
        var funcRet = observable(startArray || []);
        for (var k in arrayMethods) {
            funcRet[k] = arrayMethods[k];
        }
        return funcRet;
    }

    var ViewModelTools = {
        observable : observable,
        observableArray : observableArray
    };

    return ViewModelTools;
});