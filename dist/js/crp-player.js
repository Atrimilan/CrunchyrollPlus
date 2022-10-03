/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/classes/message-api.js":
/*!******************************************!*\
  !*** ./assets/js/classes/message-api.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MessageAPI)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// Exchange messages between Popup, Content-scripts and Background-script
var MessageAPI = /*#__PURE__*/function () {
  function MessageAPI() {
    _classCallCheck(this, MessageAPI);
  }

  _createClass(MessageAPI, null, [{
    key: "getStorage",
    value: // Get synced storage from background
    function () {
      var _getStorage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(valueToReturn) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.sendToBackground("getStorage", {
                  type: valueToReturn
                });

              case 2:
                return _context.abrupt("return", _context.sent);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getStorage(_x) {
        return _getStorage.apply(this, arguments);
      }

      return getStorage;
    }() // Send a message to content-scripts through the background
    // -> A content-script cannot communicate directly with another one due to CORS restrictions

  }, {
    key: "sendToContentScripts",
    value: function () {
      var _sendToContentScripts = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(type, parameters) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.sendToBackground("sendToContentScripts", {
                  type: type,
                  parameters: parameters
                });

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function sendToContentScripts(_x2, _x3) {
        return _sendToContentScripts.apply(this, arguments);
      }

      return sendToContentScripts;
    }() // Send a message to the background script
    // Type & Parameters are optional

  }, {
    key: "sendToBackground",
    value: function () {
      var _sendToBackground = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(action, _ref) {
        var type, parameters;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                type = _ref.type, parameters = _ref.parameters;
                _context3.next = 3;
                return chrome.runtime.sendMessage({
                  action: action,
                  type: type,
                  parameters: parameters
                });

              case 3:
                return _context3.abrupt("return", _context3.sent.response);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function sendToBackground(_x4, _x5) {
        return _sendToBackground.apply(this, arguments);
      }

      return sendToBackground;
    }()
  }]);

  return MessageAPI;
}();


;

/***/ }),

/***/ "./assets/js/classes/player-tool.js":
/*!******************************************!*\
  !*** ./assets/js/classes/player-tool.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlayerTool)
/* harmony export */ });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// New features for Crunchyroll video player
var tool;

var PlayerTool = /*#__PURE__*/function () {
  function PlayerTool(name, classList, icon) {
    var _tool$classList;

    _classCallCheck(this, PlayerTool);

    tool = document.createElement("div");
    tool.id = name;

    (_tool$classList = tool.classList).add.apply(_tool$classList, _toConsumableArray(classList));

    tool.appendChild(createToolImg("".concat(name, "_img"), icon));
    tool.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent click propagation
    });
  }

  _createClass(PlayerTool, [{
    key: "tool",
    get: function get() {
      return tool;
    }
  }]);

  return PlayerTool;
}();


; // Create an icon for the button

function createToolImg(id, icon) {
  var img = document.createElement('img');
  img.id = id;
  img.src = chrome.runtime.getURL("images/controls/".concat(icon)); // Requires web_accessible_resources in the manifest

  return img;
}

/***/ }),

/***/ "./assets/js/classes/skipper-manager.js":
/*!**********************************************!*\
  !*** ./assets/js/classes/skipper-manager.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SkipperManager)
/* harmony export */ });
/* harmony import */ var _classes_message_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../classes/message-api.js */ "./assets/js/classes/message-api.js");
/* harmony import */ var _classes_skipper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../classes/skipper.js */ "./assets/js/classes/skipper.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var openingList = [];
var crpSkipperList = [];
var video;
var isMenuOpen;

var SkipperManager = /*#__PURE__*/function () {
  function SkipperManager() {
    _classCallCheck(this, SkipperManager);
  }

  _createClass(SkipperManager, null, [{
    key: "initOpeningSkipper",
    value: function () {
      var _initOpeningSkipper = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(videoPlayer, skipperParent) {
        var _yield$MessageAPI$get, enabled, openingDuration, defaultSkipper, opList, createStyleElement, startListeningVideoPlayer;

        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                startListeningVideoPlayer = function _startListeningVideoP(openings, opDuration) {
                  openingList = openings; // Now used as a global variable

                  var remainingTimeSec;
                  video.addEventListener("timeupdate", function () {
                    var time = Math.round(this.currentTime);
                    openingList.forEach(function (op, index) {
                      var crpSkipper = crpSkipperList[index]; // Get Skipper

                      var start = op.start,
                          end = op.end,
                          skipperTimerId = op.skipperTimerId; // Get OP data

                      if (time >= start && time < end) {
                        // If this opening is playing
                        remainingTimeSec = end - time > opDuration ? opDuration : end - time;
                        var remainingTime = new Date(remainingTimeSec * 1000).toISOString().substring(14, 19);
                        crpSkipper.querySelector('#' + skipperTimerId).innerText = "(".concat(remainingTime, ")"); // Update remaining time

                        if (op.handler === "none") {
                          enableSkipper();
                        } // Enable if not handled yet

                      } else if (op.handler !== "none") {
                        disableSkipper(); // Disable if handled while opening has ended
                      }

                      function enableSkipper() {
                        op.handler = "initializing"; // Prevent multiple handlings at the same time

                        crpSkipper.style.visibility = "visible";
                        crpSkipper.style.opacity = 1; // Force the skipper to be displayed for a moment

                        addSkipperEvents(); // Skipper mouse events

                        var timeout = (end - time) * 1000 > 4000 ? 4000 : (end - time) * 1000; // Timeout (max: 4s)

                        setTimeout(function () {
                          crpSkipper.style.opacity = isMenuOpen ? 1 : 0;
                          op.handler = "mouseMovements"; // Skipper is now handled by mouse movements
                        }, timeout);
                      }

                      function disableSkipper() {
                        op.handler = "none"; // Stop handling

                        crpSkipper.style.opacity = 0;
                        setTimeout(function () {
                          crpSkipper.style.visibility = 'collapse';
                        }, 300); // Wait for opacity transition (0.3s)
                      }

                      function addSkipperEvents() {
                        crpSkipper.addEventListener('click', function () {
                          video.currentTime += ~~remainingTimeSec;
                        }); // Skip the opening

                        crpSkipper.addEventListener('mouseover', function () {
                          crpSkipper.style.opacity = 1;
                        }); // Don't hide on hover
                      }
                    });
                  }, false);
                };

                createStyleElement = function _createStyleElement(id) {
                  var myStyle = document.createElement('style');
                  myStyle.id = id;
                  document.getElementsByTagName('head')[0].appendChild(myStyle);
                  return myStyle;
                };

                video = videoPlayer; // Check if CRP skippers are enabled, and get the duration of an opening

                _context.next = 5;
                return _classes_message_api_js__WEBPACK_IMPORTED_MODULE_0__["default"].getStorage("crpSkipper");

              case 5:
                _yield$MessageAPI$get = _context.sent;
                enabled = _yield$MessageAPI$get.enabled;
                openingDuration = _yield$MessageAPI$get.openingDuration;

                if (!enabled) {
                  _context.next = 16;
                  break;
                }

                // Hide default opening skipper
                defaultSkipper = createStyleElement("hideDefaultSkipper");
                defaultSkipper.innerHTML = " div[data-testid=\"skipButton\"], #skipButton { display:none; } "; // Openings need to be detected from main page content-script to avoid CORS restrictions when accessing subtitles links

                _context.next = 13;
                return _classes_message_api_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendToContentScripts("detectOpenings", {
                  openingDuration: openingDuration,
                  videoDuration: video.duration
                });

              case 13:
                opList = _context.sent;
                // Create a new skipper for each opening
                opList.forEach(function (op, index) {
                  var skipper = new _classes_skipper_js__WEBPACK_IMPORTED_MODULE_1__["default"](index, skipperParent);
                  crpSkipperList.push(skipper.crpSkipper);
                  op.skipperId = skipper.crpSkipper.id;
                  op.skipperTimerId = skipper.timer.id;
                  op.handler = "none";
                });
                startListeningVideoPlayer(opList, openingDuration);

              case 16:
                ;

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function initOpeningSkipper(_x, _x2) {
        return _initOpeningSkipper.apply(this, arguments);
      }

      return initOpeningSkipper;
    }() // Toggle skipper if an opening is playing

  }, {
    key: "openingSkippersVisible",
    value: function openingSkippersVisible(state) {
      isMenuOpen = state;
      openingList.forEach(function (op, index) {
        var crpSkipper = crpSkipperList[index];

        if (op.handler === "mouseMovements") {
          crpSkipper.style.opacity = state ? 1 : 0;
        } else if (op.handler === "none") {
          crpSkipper.style.opacity = 0;
          setTimeout(function () {
            if (op.handler === "none") {
              // Check if during the timeout handler hasn't changed
              crpSkipper.style.visibility = 'collapse';
            }
          }, 300); // Wait for opacity transition (0.3s)
        }
      });
    }
  }]);

  return SkipperManager;
}();



/***/ }),

/***/ "./assets/js/classes/skipper.js":
/*!**************************************!*\
  !*** ./assets/js/classes/skipper.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Skipper)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// Opening skipper when a silent time is long enough for an opening
// Default opening duration: 90seconds (can be changed in the Popup)
var crpSkipper, timer;

var Skipper = /*#__PURE__*/function () {
  function Skipper(index, parentNode) {
    _classCallCheck(this, Skipper);

    crpSkipper = document.createElement('div');
    crpSkipper.id = "crpSkipper_" + index;
    crpSkipper.className = "crpSkipper";
    var text = document.createElement('p');
    text.innerText = chrome.i18n.getMessage("player_openingSkipper"); // Get translated text from locales

    text.className = "crpSkipperText";
    timer = document.createElement('p');
    timer.id = "crpSkipperTimer_" + index;
    timer.className = "crpSkipperTimer";
    crpSkipper.appendChild(text);
    crpSkipper.appendChild(timer);
    parentNode.appendChild(crpSkipper);
  }

  _createClass(Skipper, [{
    key: "crpSkipper",
    get: function get() {
      return crpSkipper;
    }
  }, {
    key: "timer",
    get: function get() {
      return timer;
    }
  }]);

  return Skipper;
}();


;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************************************!*\
  !*** ./assets/js/content-scripts/crp-player.js ***!
  \*************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _classes_player_tool_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../classes/player-tool.js */ "./assets/js/classes/player-tool.js");
/* harmony import */ var _classes_message_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../classes/message-api.js */ "./assets/js/classes/message-api.js");
/* harmony import */ var _classes_skipper_manager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../classes/skipper-manager.js */ "./assets/js/classes/skipper-manager.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/*
 * Notes about the default Crunchyroll video player [id: velocity-controls-package]
 *
 * It contains 3 divs :
 * • First one is the video itselft
 * • Second one is the controls container [id: vilosControlsContainer]
 *   - It is not loaded immediately in the DOM
 *   - It is not visible until you hover over the video player
 * • Third one appears above the two previous ones when you hover over the video player, it's a vignette effect
 */



var video = document.getElementById('player0');
var playerParent = null;
var playerObserver = null; // Observer

var controlsContainer = null; // Null for now, because the #vilosControlsContainer div is not loaded yet

var controlsContainerObserver = null; // Observer

ObserveVideoPlayer(); // Video player observer

function ObserveVideoPlayer() {
  var config = {
    attributes: false,
    childList: true,
    subtree: false
  };
  playerObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type == 'childList') {
        if (mutation.addedNodes.length > 0) {
          Array.from(mutation.addedNodes).map(function (node) {
            if (node.id == 'vilosControlsContainer') {
              controlsContainer = node; //console.clear();

              console.log("%cCrunchyroll PLUS", "color: #ea2600");

              if (controlsContainer.firstChild.hasChildNodes()) {
                LoadCrpTools(); // Load CrunchyrollPlus controls if controlsContainer has child nodes
              }

              ObserveControlsContainer(); // Start observing controls when vilosControlsContainer is loaded
              // Init opening skippers through the Skipper Manager
              // (Skipper need to be appended to the parentNode to be displayed in fullscreen)

              _classes_skipper_manager_js__WEBPACK_IMPORTED_MODULE_2__["default"].initOpeningSkipper(video, controlsContainer.parentNode);
            }
          });
        }

        if (mutation.removedNodes.length > 0) {
          Array.from(mutation.removedNodes).map(function (node) {
            if (node.id == 'vilosControlsContainer' && controlsContainerObserver != null) {
              controlsContainerObserver.disconnect(); // Stop observing controls when vilosControlsContainer is destroyed
            }
          });
        }
      }
    });
  }); // Crunchyroll seems to instanciate and destroy the video player multiple time, this will probably need to be revisited later

  if (!!(playerParent = document.getElementById('velocity-controls-package'))) {
    // Get node and check if it is not null
    playerObserver.observe(playerParent, config);
  }
}

var isMenuOpen = false; // Default Crunchyroll controls observer

function ObserveControlsContainer() {
  var config = {
    attributes: false,
    childList: true,
    subtree: false
  };
  controlsContainerObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
        if (mutation.addedNodes[0].hasChildNodes()) {
          isMenuOpen = true;
          LoadCrpTools();
        } else {
          isMenuOpen = false;
          DestroyCrpTools();
        }
      }
    });
  });
  controlsContainerObserver.observe(controlsContainer, config);
} // CrunchyrollPlus controls initializer


function LoadCrpTools() {
  return _LoadCrpTools.apply(this, arguments);
} // CRP controls destroyer


function _LoadCrpTools() {
  _LoadCrpTools = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var leftControls, toolClasses, moveBackward, moveBackwardTime, moveForward, moveForwardTime, soundBooster, soundMultiplier, themeColor;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Controls on the left of the player
            leftControls = controlsContainer.querySelector("[data-testid='vilos-play_pause_button']").parentNode.parentNode; // const rightControls = controlsContainer.querySelector("#settingsControl").parentNode;

            toolClasses = ['crpTools', "r-1ozmr9b"]; // Move backward button

            moveBackward = new _classes_player_tool_js__WEBPACK_IMPORTED_MODULE_0__["default"]('moveBackward', toolClasses, 'moveBackward.svg').tool;
            leftControls.appendChild(moveBackward);
            _context.next = 6;
            return _classes_message_api_js__WEBPACK_IMPORTED_MODULE_1__["default"].getStorage('moveBackwardTime');

          case 6:
            moveBackwardTime = _context.sent;
            moveBackward.addEventListener("click", function () {
              video.currentTime -= ~~moveBackwardTime;
            }); // Move forward button

            moveForward = new _classes_player_tool_js__WEBPACK_IMPORTED_MODULE_0__["default"]('moveForward', toolClasses, 'moveForward.svg').tool;
            leftControls.appendChild(moveForward);
            _context.next = 12;
            return _classes_message_api_js__WEBPACK_IMPORTED_MODULE_1__["default"].getStorage('moveForwardTime');

          case 12:
            moveForwardTime = _context.sent;
            moveForward.addEventListener("click", function () {
              video.currentTime += ~~moveForwardTime;
            }); // Sound booster button (https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource)

            soundBooster = new _classes_player_tool_js__WEBPACK_IMPORTED_MODULE_0__["default"]('soundBoosterOff', toolClasses, soundBoosterEnabled ? 'soundBoosterOn.svg' : 'soundBoosterOff.svg').tool;
            leftControls.appendChild(soundBooster);
            _context.next = 18;
            return _classes_message_api_js__WEBPACK_IMPORTED_MODULE_1__["default"].getStorage('soundMultiplier');

          case 18:
            soundMultiplier = _context.sent;
            soundBooster.addEventListener("click", function () {
              if (!soundBoosterInitialized) {
                InitSoundBooster();
              }

              if (!soundBoosterEnabled) {
                // If disabled, boost gain with stored sound multiplier
                gainNode.gain.value = 1 + soundMultiplier / 10;
                soundBoosterEnabled = true;
                soundBooster.firstChild.src = chrome.runtime.getURL("images/controls/soundBoosterOn.svg");
              } else {
                // If enabled, set gain value to 1
                gainNode.gain.value = 1;
                soundBoosterEnabled = false;
                soundBooster.firstChild.src = chrome.runtime.getURL("images/controls/soundBoosterOff.svg");
              }
            });
            _classes_skipper_manager_js__WEBPACK_IMPORTED_MODULE_2__["default"].openingSkippersVisible(true); // Change playbar color to the stored theme color

            _context.next = 23;
            return _classes_message_api_js__WEBPACK_IMPORTED_MODULE_1__["default"].getStorage('themeColor');

          case 23:
            themeColor = _context.sent;

            if (!!themeColor && isMenuOpen) {
              // themeColor not null and menu is still open
              changePlayBarColor(themeColor);
              changeVolumeSelectorColor(themeColor);
            }

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _LoadCrpTools.apply(this, arguments);
}

function DestroyCrpTools() {
  _classes_skipper_manager_js__WEBPACK_IMPORTED_MODULE_2__["default"].openingSkippersVisible(false);
}

var soundBoosterInitialized = false,
    soundBoosterEnabled = false;
var audioCtx = null,
    gainNode = null,
    source = null; // Initialize sound booster variables

function InitSoundBooster() {
  audioCtx = new AudioContext();
  source = audioCtx.createMediaElementSource(video);
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 1;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  soundBoosterInitialized = true;
} // Change the playbar color (watched time bar and reticle)


function changePlayBarColor(themeColor) {
  var playerPointer = document.querySelector('div[data-testid="vilos-knob"]');
  playerPointer.style.visibility = "hidden";
  var crpPointer = document.createElement('div');
  crpPointer.className = "crpKnob";
  crpPointer.style.backgroundColor = themeColor;
  playerPointer.appendChild(crpPointer);
  var watchedTime = document.querySelector('div[data-testid="vilos-scrub_bar"]').children[0].children[0].children[0].children[1].children[0].children[0]; // They should hire someone to add ids wherever they are missing !

  watchedTime.style.visibility = "hidden";
  var crpWatchedTime = document.createElement('div');
  crpWatchedTime.id = "crpWatchedTime";
  crpWatchedTime.style.backgroundColor = themeColor;
  watchedTime.appendChild(crpWatchedTime); // playerPointer and watchedTime "style" properties cannot be changed because it is automatically updated by the player
  // This is why child nodes are created, while their parent's visibility is set to "hidden"
}

var volumeObserver = null; // Change the volume knob color
// (Requires a MutationObserver because it is not initially loaded)

function changeVolumeSelectorColor(themeColor) {
  var volumeButton = controlsContainer.querySelector("[data-testid='vilos-volume_container']");
  var config = {
    attributes: false,
    childList: true,
    subtree: false
  };
  volumeObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
        var knob = volumeButton.querySelector("[data-testid='vilos-knob']");
        knob.style.visibility = "hidden";
        var crpVolPointer = document.createElement('div');
        crpVolPointer.className = "crpKnob";
        crpVolPointer.style.backgroundColor = themeColor;
        knob.appendChild(crpVolPointer);
      }
    });
  });
  volumeObserver.observe(volumeButton, config);
} // Messages received from Popup


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var type = request.type,
      parameters = request.parameters;

  switch (type) {
    case "togglePlayerThumbnail":
      togglePlayerThumbnail(parameters.state);
      break;

    case "definePlayerOpenings":
      //  startListeningVideoPlayer(request.openingTimes);
      break;
  }

  return true; // Tell Chrome that response is sent asynchronously
}); // Load data from the chrome storage, and call needed functions

(function InitPage() {
  chrome.runtime.sendMessage({
    action: "showPlayerThumbnail"
  }, function (response) {
    togglePlayerThumbnail(response.message);
  });
})();

var playerThumbnailStyle = createStyleElement("playerThumbnailStyle"); // Create style element and add it to the DOM

function createStyleElement(id) {
  var myStyle = document.createElement('style');
  myStyle.id = id;
  document.getElementsByTagName('head')[0].appendChild(myStyle);
  return myStyle;
}

function togglePlayerThumbnail(state) {
  if (state) {
    playerThumbnailStyle.innerHTML = "";
  } else {
    // CSS to hide the progress bar thumbnail
    playerThumbnailStyle.innerHTML = "\n        div[class=\"css-1dbjc4n r-1awozwy r-1777fci\"] {\n            visibility: hidden;\n        }";
  }
} // Wait for given milliseconds
// USE : delay(1000).then(() => { ... });

/*function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}*/
// Change loading spinner color to the stored theme color


var loadSpinner = document.querySelectorAll('div[data-testid="vilos-loading"] path');

(function setLoadingSpinnerColor() {
  chrome.runtime.sendMessage({
    action: "themeColor"
  }, function (response) {
    if (!!response.message) {
      loadSpinner.forEach(function (element) {
        element.style.stroke = response.message;
      });
    }
  });
})(); // ----------------------------- //
//  Opening skippers management  //
// ----------------------------- //

/*
var openingList = [];
var crpSkipperList = [];

async function initOpeningSkipper() {

    // Check if CRP skippers are enabled, and get the duration of an opening
    var { enabled, openingDuration } = await MessageAPI.getStorage("crpSkipper");

    if (enabled) {
        // Hide default opening skipper
        var defaultSkipper = createStyleElement("hideDefaultSkipper");
        defaultSkipper.innerHTML = `
        div[data-testid="skipButton"] {
            display: none;
        }
        #skipButton {
            display: none;
        }`;

        // Openings need to be detected from main page content-script to avoid CORS restrictions when accessing subtitles links
        const opList = (await MessageAPI.sendToContentScripts("detectOpenings", { openingDuration, videoDuration: video.duration }));

        // Create a new skipper for each opening
        opList.forEach((op, index) => {
            const skipper = new Skipper(index, controlsContainer.parentNode);
            crpSkipperList.push(skipper.crpSkipper);

            op.skipperId = skipper.crpSkipper.id;
            op.skipperTimerId = skipper.timer.id;
            op.handler = "none";
        });

        startListeningVideoPlayer(opList, openingDuration);
    };
}

// Listen to the video player timeupdate, and display the opening skipper if it is the right time
function startListeningVideoPlayer(openings, opDuration) {
    openingList = openings; // Now used as a global variable
    var remainingTimeSec;

    video.addEventListener("timeupdate", function () {
        var time = Math.round(this.currentTime);

        openingList.forEach((op, index) => {
            const crpSkipper = crpSkipperList[index];   // Get Skipper
            const { start, end, skipperTimerId } = op;  // Get OP data

            if (time >= start && time < end) {  // If this opening is playing
                remainingTimeSec = end - time > opDuration ? opDuration : end - time;
                const remainingTime = new Date(remainingTimeSec * 1000).toISOString().substring(14, 19);
                crpSkipper.querySelector('#' + skipperTimerId).innerText = `(${remainingTime})`;

                if (op.handler === "none") { enableSkipper() }  // Enable if not handled yet
            }
            else if (op.handler !== "none") { disableSkipper() }// Disable if handled while opening has ended


            function enableSkipper() {
                op.handler = "initializing";    // Prevent the skipper from being handled multiple times at once
                crpSkipper.style.visibility = "visible";
                crpSkipper.style.opacity = 1;   // Force the skipper to be displayed for a moment

                addSkipperEvents(); // Skipper mouse events

                const timeout = (((end - time) * 1000) > 4000) ? 4000 : ((end - time) * 1000);  // Timeout (max: 4s)
                setTimeout(() => {
                    crpSkipper.style.opacity = isMenuOpen ? 1 : 0;
                    op.handler = "mouseMovements"; // Skipper is now handled by mouse movements
                }, timeout);
            }

            function disableSkipper() {
                op.handler = "none";    // Stop handling
                coolCollapse(crpSkipper);
            }

            function addSkipperEvents() {
                crpSkipper.addEventListener('click', () => { video.currentTime += ~~remainingTimeSec });    // Skip the opening
                crpSkipper.addEventListener('mouseover', () => { crpSkipper.style.opacity = 1 });   // Don't hide on hover
            }
        });
    }, false);
}

// Toggle skipper if an opening is playing
function openingSkippersVisible(state) {
    openingList.forEach((op, index) => {
        const crpSkipper = crpSkipperList[index];

        if (op.handler === "mouseMovements") {
            crpSkipper.style.opacity = state ? 1 : 0;
        }
        else if (op.handler === "none") {
            coolCollapse(crpSkipper);
        }
    });
}

// Wait for opacity transition (0.3s), then collapse the visibility
function coolCollapse(skipper){
    skipper.style.opacity = 0;
    setTimeout(() => { skipper.style.visibility = 'collapse'; }, 300);
}*/
})();

/******/ })()
;