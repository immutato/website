(function (name, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        this[name] = factory();
    }
}('immutato', function (define) {
    function _require(index) {
        var module = _require.cache[index];
        if (!module) {
            var exports = {};
            module = _require.cache[index] = {
                id: index,
                exports: exports
            };
            _require.modules[index].call(exports, module, exports);
        }
        return module.exports;
    }
    _require.cache = [];
    _require.modules = [function (module, exports) {
            'use strict';
            var THRESHOLD = 100;
            var I = function () {
                    var cacheCount = 300;
                    var caches = [];
                    function buildPropertyIndexes(keysLength) {
                        var propertyIndexes = new Array(keysLength);
                        var i = keysLength;
                        while (i--) {
                            propertyIndexes[i] = 0;
                        }
                        return propertyIndexes;
                    }
                    var k = cacheCount;
                    while (k--) {
                        caches[k] = buildPropertyIndexes(k);
                    }
                    function buildFirstPropertyIndexes(keysLength) {
                        if (keysLength > cacheCount) {
                            console.log('CACHE REBUILD');
                            return buildPropertyIndexes(keysLength);
                        } else {
                            return caches[keysLength];
                        }
                    }
                    function get(self, opts) {
                        var propertyIndexes = self.propertyIndexes;
                        var instanceId = self.instanceId;
                        var propertyIndex = opts.propertyIndex;
                        var transactionsForClass = opts.transactionsForClass;
                        var transactionIndex = propertyIndexes[propertyIndex];
                        var transactions = transactionsForClass[instanceId];
                        var transaction = transactions[transactionIndex];
                        return transaction[propertyIndex];
                    }
                    var create = function () {
                            function C() {
                            }
                            return function create(proto, properties) {
                                C.prototype = proto;
                                var instance = new C();
                                return Object.defineProperties(instance, properties);
                            };
                        }();
                    function set(value, self, opts) {
                        var propertyIndexes = self.propertyIndexes;
                        var instanceId = self.instanceId;
                        var propertyIndex = opts.propertyIndex;
                        var transactionsForClass = opts.transactionsForClass;
                        var Contructor = opts.Contructor;
                        var transactions = transactionsForClass[instanceId];
                        var keysLength = opts.keysLength;
                        var newTransaction = new Array(propertyIndex + 1);
                        newTransaction[propertyIndex] = value;
                        transactions.push(newTransaction);
                        var newPropertyIndexes = new Array(keysLength);
                        var i = keysLength;
                        while (i--) {
                            newPropertyIndexes[i] = propertyIndexes[i];
                        }
                        return new Contructor(newPropertyIndexes, instanceId);
                    }
                    function mkGetterSetter(opts) {
                        return function getterSetter(value) {
                            if (typeof value === 'undefined') {
                                return get(this, opts);
                            } else {
                                return set(value, this, opts);
                            }
                        };
                    }
                    function I(dataSample) {
                        var keys = Object.keys(dataSample);
                        var keysLength = keys.length;
                        var transactionsForClass = [];
                        var Proto = {
                                dispose: function () {
                                    transactionsForClass[this.instanceId] = null;
                                }
                            };
                        var i = keysLength;
                        var clonedData = {};
                        while (i--) {
                            var opts = {
                                    propertyIndex: i,
                                    transactionsForClass: transactionsForClass,
                                    Contructor: Contructor,
                                    keysLength: keysLength
                                };
                            var propertyName = keys[i];
                            Proto[propertyName] = mkGetterSetter(opts);
                        }
                        function Contructor(propertyIndexes, instanceId) {
                            this.propertyIndexes = propertyIndexes;
                            this.instanceId = instanceId;
                        }
                        Contructor.prototype = Proto;
                        var instanceId = 0;
                        return function (data) {
                            var propertyIndexes = buildFirstPropertyIndexes(keysLength);
                            var clonedData = [];
                            i = 0;
                            while (i < keysLength) {
                                clonedData.push(data[keys[i]]);
                                i++;
                            }
                            transactionsForClass[instanceId] = [clonedData];
                            var res = new Contructor(propertyIndexes, instanceId);
                            instanceId++;
                            return res;
                        };
                    }
                    return I;
                }();
            module.exports = I;
        }];
    return _require(0);
}));
//# sourceMappingURL=immutato.js.map