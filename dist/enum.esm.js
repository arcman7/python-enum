var appendChain = function(oChain, oProto) {
  /*
    source:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
  */  
  if (arguments.length < 2) { 
    throw new TypeError('Object.appendChain - Not enough arguments');
  }
  if (typeof oProto !== 'object' && typeof oProto !== 'string') {
    throw new TypeError('second argument to Object.appendChain must be an object or a string');
  }
  var o2nd, oLast;
  var oNewProto = oProto,
      oReturn = o2nd = oLast = oChain instanceof this ? oChain : new oChain.constructor(oChain);

  for (var o1st = this.getPrototypeOf(o2nd);
    o1st !== Object.prototype && o1st !== Function.prototype;
    o1st = this.getPrototypeOf(o2nd)
  ) {
    o2nd = o1st;
  }

  if (oProto.constructor === String) {
    oNewProto = Function.prototype;
    oReturn = Function.apply(null, Array.prototype.slice.call(arguments, 1));
    this.setPrototypeOf(oReturn, oLast);
  }

  this.setPrototypeOf(o2nd, oNewProto);
  return oReturn;
};

appendChain = appendChain.bind(Object);
Object.appendChain = appendChain;

function getUserIntClassStr(name) {
  return ("\n    " + name + "." + name + " = class " + name + " extends Number {\n      constructor(key, val) {\n        if (!values.hasOwnProperty(val)) {\n          throw new Error('ValueError: ', val, ' is not a valid ', name)\n        }\n        super(val)\n        this.val = val\n        this.key = key\n      }\n      get value() {\n        return this.val\n      }\n      toString() {\n        return '" + name + ".' + this.key + ': ' + this.val\n      }\n    };\n  ")
}

function getUserClassStr(name) {
  return ("\n    " + name + "." + name + " = class " + name + " {\n      constructor(key, val) {\n        if (!values.hasOwnProperty(val)) {\n          throw new Error('ValueError: ', val, ' is not a valid ', name)\n        }\n        this.val = val\n        this.key = key\n      }\n      get value() {\n        return this.val\n      }\n      toString() {\n        return '" + name + ".' + this.key + ': ' + this.val\n      }\n    };\n  ")
}

function getDict(ref) {
  var dict = ref.dict;
  var keys = ref.keys;
  var start = ref.start; if ( start === void 0 ) start = 1;
  var seperator = ref.seperator;

  var usedDict = {};
  var values = {};
  var test;
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
    test.forEach(function (key, index) {
      var usedKey = key.trim();
      if (!usedKey) {
        return
      }
      values[index + start] = usedKey;
      usedDict[usedKey] = index + start;
    });
    return { dict: usedDict, values: values }
  }
  var usedKeys = keys || Object.keys(dict);
  // ARRAY
  if (Array.isArray(dict)) {
    usedKeys.forEach(function (key, index) {
      usedDict[dict[key]] = index + start;
      values[index + start] = dict[key];
    });
    return { dict: usedDict, values: values }
  }
  // OBJECT
  usedKeys.forEach(function (key) {
    var val = dict[key];
    usedDict[key] = val;
    values[val] = key;
  });
  return  { dict: usedDict, values: values }
}

function getUserEnum(name, userDict, templateFunc, start, seperator, globalRef) {
  var keys = Object.keys(userDict);
  var ref = getDict({ dict: userDict, keys: keys });
  var dict = ref.dict;
  var values = ref.values;
  keys = Object.keys(dict);
  globalRef.dict = dict;
  globalRef.keys = keys;
  globalRef.values = values;
  var str = "\n  var globalRef = " + (JSON.stringify(globalRef)) + ";\n  var dict = globalRef.dict;\n  var keys = globalRef.keys;\n  var values = globalRef.values;\n  class EnumBase {\n    constructor(keys) {\n      this.keys = keys\n      this.toArray = this.toArray.bind(this)\n      this.has = this.has.bind(this)\n    }\n    toArray() {\n      const result = []\n      for (let i = 0; i < this.keys.length; i++) {\n        result.push(this[this.keys[i]])\n      }\n      return result\n    }\n    has(key) {\n      return this.hasOwnProperty(key)\n    }\n  }\n  var " + name + " = new EnumBase(keys);\n  ";
  str += templateFunc(name);
  str += "var val = dict[keys[" + (0) + "]]\n  " + name + "[keys[" + (0) + "]] = new " + name + "." + name + "(keys[" + (0) + "], val);\n  " + name + "[val] = " + name + "[keys[" + (0) + "]]\n  Object.appendChain(" + name + "[keys[" + (0) + "]], " + name + ");\n  ";
  for (var i = 1; i < keys.length; i++) {
    str += "\n    val = dict[keys[" + i + "]]\n    " + name + "[keys[" + i + "]] = new " + name + "." + name + "(keys[" + i + "], val);\n    " + name + "[val] = " + name + "[keys[" + i + "]]\n    ";
  }
  str += "\n  result = function (val) {\n    if (!values.hasOwnProperty(val)) {\n      throw new Error('ValueError: ', val, ' is not a valid ', name)\n    }\n    return " + name + "[values[val]];\n  }\n  Object.appendChain(result, " + name + ")\n  return result\n  ";
  var result = new Function(("" + str))();
  return Object.freeze(result)
}

function IntEnum(name, dict, options) {
  if ( options === void 0 ) options = { seperator: null, start: 1 };

  var globalRef = {};
  var start = options.start;
  var seperator = options.seperator;
  return getUserEnum(name, dict, getUserIntClassStr, start, seperator, globalRef)
}
function Enum(name, dict,  options) {
  if ( options === void 0 ) options = { seperator: null, start: 1 };

  var globalRef = {};
  var start = options.start;
  var seperator = options.seperator;
  return getUserEnum(name, dict, getUserClassStr, start, seperator, globalRef)
}
Enum.IntEnum = IntEnum;
var src = Enum;

export default src;
