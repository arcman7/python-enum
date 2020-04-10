(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Enum = {}));
}(this, (function (exports) { 'use strict';

  function getUserClassStr(name) {
    return `
    let topLevelScope
    if (typeof(process) !== 'undefined') {
        topLevelScope = process
    } else {
      topLevelScope = window
    }
    var EnumMeta = topLevelScope.EnumMeta

    return class ${name} extends EnumMeta {
      constructor(val, key) {
        super(val)
        if (!this.constructor._vals.hasOwnProperty(val)) {
          throw new Error('ValueError: '+ val + ' is not a valid ' + 'UserClass')
        }
        if (this.constructor._init) {
          const lookUpKey = this.constructor._vals[val]
          return this.constructor[lookUpKey]
        }
        this.val = val
        this.key = key
      }

      get value() {
        return this.val
      }

      toString() {
        return '${name}.' + this.key + ': ' + this.val
      }
    };
  `
  }

  class EnumMeta extends Number {
    toArray() {
      const result = [];
      for (let i = 0; i < this._keys.length; i++) {
        result.push(this[this._keys[i]]);
      }
      return result
    }

    has(key) {
      return this.hasOwnProperty(key)
    }
  }
  let topLevelScope;
  if (typeof(process) !== 'undefined') {
      topLevelScope = process;
  } else {
    topLevelScope = window;
  }
  topLevelScope.EnumMeta = EnumMeta;
  const specialKeys = {
    __missing__: true,
  };
  function getDict({ dict, keys, start = 1, seperator }) {
    const usedDict = {};
    const values = {};
    const userMethods = [];
    let test;
    // STRING
    if (typeof(dict) === 'string') {
      if (seperator) {
        test = dict.split(seperator);
      }
      if (!seperator) {
        test = dict.split(',');
      }
      if (test.length === 1 && !seperator) {
        test = dict.split(' ');
      }
      test.forEach((key, index) => {
        const usedKey = key.trim();
        if (!usedKey || specialKeys[usedKey]) {
          console.warn('Cannot use reserved keyword ', usedKey);
          return
        }
        values[index + start] = usedKey;
        usedDict[usedKey] = index + start;
      });
      return { dict: usedDict, values, userMethods }
    }
    const usedKeys = keys || Object.keys(dict);
    // ARRAY
    if (Array.isArray(dict)) {
      usedKeys.forEach((key, index) => {
        const valOfArray = dict[key];
        if (typeof valOfArray === 'function') {
          // ex: __missing__
          if (specialKeys[valOfArray.name]) {
            userMethods.push(valOfArray);
            return
          }
          usedDict[valOfArray.name] = index + start;
          values[index + start] = valOfArray.name;
          return
        }
        usedDict[valOfArray] = index + start;
        values[index + start] = valOfArray;
      });
      return { dict: usedDict, values, userMethods }
    }
    // OBJECT
    usedKeys.forEach((key) => {
      const val = dict[key];
      if (typeof val === 'function') {
        if (specialKeys[val.name]) {
          userMethods.push(val);
          return
        }
      }
      usedDict[key] = val;
      values[val] = key;
    });
    return  { dict: usedDict, values, userMethods }
  }
  function getUserEnum(name, userDict, start, seperator) {
    let keys = Object.keys(userDict);
    const { dict, values, userMethods } = getDict({ dict: userDict, keys });
    keys = Object.keys(dict);
    const UserClass = Function(getUserClassStr(name))();
    UserClass._vals = values;
    UserClass._keys = keys;
    UserClass.member_names_ = keys;
    keys.forEach((key) => {
      const val = dict[key];
      UserClass[key] = new UserClass(val, key);
      UserClass.prototype[key] = UserClass[key];
    });
    userMethods.forEach((func) => {
      UserClass.prototype[func.name] = func;
    });
    UserClass.prototype.member_names_ = keys;
    UserClass.toArray = function toArray() {
      const result = [];
      for (let i = 0; i < UserClass._keys.length; i++) {
        result.push(UserClass[UserClass._keys[i]]);
      }
      return result
    };
    UserClass.has = function has(key) {
      return UserClass.hasOwnProperty(key)
    };
    UserClass._init = true;
    // set up map for override properties
    const prox = new Proxy(UserClass, {
      get: (target, name) => {
        if (target[name]) {
          return target[name]
        }
        let val;
        if (target['__missing__'] ===  null) {
          return undefined
        }
        if (typeof target['__missing__'] === 'function') {
          val = target['__missing__']();
        } else {
          val = target['__missing__'];
        }
        return val
      },
      apply: function(target, thisArg, argumentsList) {
        if (target._vals.hasOwnProperty(argumentsList[0])) {
          const lookUpKey = target._vals[argumentsList[0]];
          return target[lookUpKey]
        }
        return new target(argumentsList[0])
      },
    });
    prox.__proto__ = UserClass[UserClass._keys[0]];
    Object.freeze(UserClass);

    return prox
  }
  function IntEnum(name, dict, options = { seperator: null, start: 1 }) {
    return getUserEnum(name, dict)
  }
  function Enum(name, dict,  options = { seperator: null, start: 1 }) {
    return getUserEnum(name, dict)
  }
  Enum.EnumMeta = EnumMeta;
  Enum.IntEnum = IntEnum;
  Enum.Enum = Enum;
  module.exports = Enum;

  exports.default = Enum;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
