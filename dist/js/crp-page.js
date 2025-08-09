/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/ass-parser/index.js":
/*!******************************************!*\
  !*** ./node_modules/ass-parser/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var execAll = __webpack_require__(/*! regexp.execall */ "./node_modules/regexp.execall/index.js")
  , fzip = __webpack_require__(/*! fzip */ "./node_modules/fzip/src/fzip.js")
  , flatmap = __webpack_require__(/*! flatmap */ "./node_modules/flatmap/index.js");

var parseDescriptor = __webpack_require__(/*! ./src/descriptor */ "./node_modules/ass-parser/src/descriptor.js");


/**
 * Parse section lines.
 *
 * "Format" descriptor (if there is one) specifies format for subsequent
 * lines in the same section.
 *
 * @arg {string[]} lines
 * @arg {Object} [options]
 * @return {Object}
 */
var parseSection = function (lines, options) {
  options = options || {};

  // Format descriptor for subsequent section lines.
  var format = null;

  return flatmap(lines, function (line) {
    var descriptor = parseDescriptor(line, format);
    if (!descriptor) {
      // Empty line.
      return null;
    }

    if (descriptor.type == 'comment' && !options.comments) {
      return null;
    }

    if (!format && descriptor.key == 'Format') {
      format = descriptor.value;
    }

    return [descriptor];
  });
};


var parseAss = function (text, options) {
  text = text.toString();
  var sections = execAll(/^\s*\[(.*)\]\s*$/mg, text);

  return fzip(sections, sections.slice(1), function (section, nextSection) {
    var sectionName = section[1];

    var begin = section.index + section[0].length + 1;
    var end = nextSection ? nextSection.index : text.length;
    var lines = text.slice(begin, end).split('\n');

    return {
      section: sectionName,
      body: parseSection(lines, options)
    };
  });
};


module.exports = parseAss;
module.exports["default"] = parseAss;


/***/ }),

/***/ "./node_modules/ass-parser/src/descriptor.js":
/*!***************************************************!*\
  !*** ./node_modules/ass-parser/src/descriptor.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var zipmap = __webpack_require__(/*! zipmap */ "./node_modules/zipmap/index.js");


/**
 * Parse individual SSA/ASS lines ("descriptors").
 *
 * Return value has either "key" and "value" properties,
 * or "type" and "value" (if it is rather a comment line).
 * It can also be null (if the line is empty).
 *
 * Return value type depends on the descriptor being parsed:
 *   - object if `format` is specified,
 *   - array if the descriptor is a format specifier itself,
 *   - string otherwise.
 *
 * @arg {string} line
 * @arg {string[]} [format]
 * @return {Object?}
 */
module.exports = function (line, format) {
  if (/^\s*$/.test(line)) {
    return null;
  }
  else if (line[0] == ';') {
    return {
      type: 'comment',
      value: line.slice(1)
    };
  }

  var parts = line.split(':');

  var key = parts[0];
  var value = parts.slice(1)
                   .join(':')
                   .trim();

  if (format || key == 'Format') {
    value = value.split(',');

    // Last part may contain commas (e.g. actual subtitle strings).
    if (format && value.length > format.length) {
      var lastPart = value.slice(format.length - 1).join(',');
      value.length = format.length - 1;
      value.push(lastPart);
    }

    value = value.map(Function.call.bind(''.trim));

    if (format) {
      value = zipmap(format, value);
    }
  }

  return {
    key: key,
    value: value
  };
};


/***/ }),

/***/ "./assets/js/classes/crp-api.js":
/*!**************************************!*\
  !*** ./assets/js/classes/crp-api.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ API)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var API = /*#__PURE__*/function () {
  function API() {
    _classCallCheck(this, API);
  }

  _createClass(API, null, [{
    key: "TOKEN",
    get: function get() {
      // Inspired by https://github.com/ThomasTavernier/Improve-Crunchyroll
      var cxApiParams = fetch(window.location.href).then(function (response) {
        return response.text();
      }).then(function (text) {
        var initialState = JSON.parse(text.match(/(?<=window.__INITIAL_STATE__ = ){.*}/)[0]);
        var locale = initialState.localization.locale;
        var appConfig = JSON.parse(text.match(/(?<=window.__APP_CONFIG__ = ){.*}/)[0]);
        var accountAuthClientId = appConfig.cxApiParams.accountAuthClientId;
        var apiDomain = location.origin; // appConfig.cxApiParams.apiDomain;
        // In the new www.crunchyroll.com release, API domain remains beta.crunchyroll.com

        return {
          apiDomain: apiDomain,
          accountAuthClientId: accountAuthClientId,
          locale: locale
        };
      })["catch"](function (error) {
        return console.log("%cCannot get cxApiParams", 'color:red;font-weight:bold');
      });
      var token = cxApiParams.then(function (_ref) {
        var apiDomain = _ref.apiDomain,
            accountAuthClientId = _ref.accountAuthClientId,
            locale = _ref.locale;
        return fetch("".concat(apiDomain, "/auth/v1/token"), {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // OAuth2 content type
            'Authorization': "Basic ".concat(window.btoa("".concat(accountAuthClientId, ":"))) // User ID encrypted in Base64

          },
          body: 'grant_type=etp_rt_cookie' // This cookie is required

        }).then(function (response) {
          return response.json();
        }).then(function (_ref2) {
          var token_type = _ref2.token_type,
              access_token = _ref2.access_token,
              expires_in = _ref2.expires_in;
          return {
            'Authorization': "".concat(token_type, " ").concat(access_token),
            apiDomain: apiDomain,
            locale: locale
          };
        })["catch"](function (error) {
          return console.log("%cCannot get access_token", 'color:red;font-weight:bold');
        });
      });
      return token;
    }
  }, {
    key: "CMS",
    get: function get() {
      // Inspired by https://github.com/ThomasTavernier/Improve-Crunchyroll
      var cms = this.TOKEN.then(function (_ref3) {
        var Authorization = _ref3.Authorization,
            apiDomain = _ref3.apiDomain,
            locale = _ref3.locale;
        return fetch("".concat(apiDomain, "/index/v2"), {
          headers: {
            Authorization: Authorization
          }
        }).then(function (response) {
          return response.json();
        }).then(function (_ref4) {
          var _ref4$cms_web = _ref4.cms_web,
              bucket = _ref4$cms_web.bucket,
              signature = _ref4$cms_web.signature,
              policy = _ref4$cms_web.policy,
              key_pair_id = _ref4$cms_web.key_pair_id;
          return {
            apiDomain: apiDomain,
            bucket: bucket,
            searchParams: {
              locale: locale,
              Signature: signature,
              Policy: policy,
              'Key-Pair-Id': key_pair_id
            }
          };
        })["catch"](function (error) {
          return console.log("%cCannot get cms_web", 'color:red;font-weight:bold');
        });
      }).then(function (response) {
        return response;
      });
      return cms;
    }
  }, {
    key: "EPISODE",
    get: function get() {
      var episodeData = this.CMS.then(function (_ref5) {
        var apiDomain = _ref5.apiDomain,
            bucket = _ref5.bucket,
            sP = _ref5.searchParams;
        var split = window.location.pathname.split('/'); // Split "<locale>/watch/<EPISODEID>/"

        var episodeId = split[split.length - 2]; // Extract the episode ID

        return fetch("".concat(apiDomain, "/cms/v2").concat(bucket, "/objects/").concat(episodeId, "?locale=").concat(sP.locale, "&Signature=").concat(sP.Signature, "&Policy=").concat(sP.Policy, "&Key-Pair-Id=").concat(sP['Key-Pair-Id'])).then(function (response) {
          return response.json();
        }).then(function (_ref6) {
          var items = _ref6.items;
          return {
            items: items[0],
            apiDomain: apiDomain,
            bucket: bucket,
            sP: sP
          };
        })["catch"](function (error) {
          return console.log("%cCannot get current episode data", 'color:red;font-weight:bold');
        });
      }).then(function (response) {
        return response;
      });
      return episodeData;
    }
  }, {
    key: "STREAM",
    get: function get() {
      // We need to get the Episode first, to extract the Stream ID
      var streamData = this.EPISODE.then(function (_ref7) {
        var items = _ref7.items,
            apiDomain = _ref7.apiDomain,
            bucket = _ref7.bucket,
            sP = _ref7.sP;

        var split = items.__links__.streams.href.split('/'); // Split ":/cms/v2/<bucket>/videos/<STREAMID>/streams


        var streamId = split[split.length - 2]; // Extract the streamId ID

        /* It would be nice to find the Stream ID in another way */

        if (sP.locale === 'es-419') {
          sP.locale = 'es-LA';
        }

        if (sP.locale === 'ar-SA') {
          sP.locale = 'ar-ME';
        }

        if (sP.locale === 'pt-PT') {
          sP.locale = 'pt-BR';
        } // pt-PT does not seem supported


        return fetch("".concat(apiDomain, "/cms/v2").concat(bucket, "/videos/").concat(streamId, "/streams?\n            locale=").concat(sP.locale, "&Signature=").concat(sP.Signature, "&Policy=").concat(sP.Policy, "&Key-Pair-Id=").concat(sP['Key-Pair-Id'])).then(function (response) {
          return response.json();
        }).then(function (response) {
          return {
            stream: response,
            subtitleLocaleKey: sP.locale
          };
        })["catch"](function (error) {
          return console.log("%cCannot get current stream data", 'color:red;font-weight:bold');
        });
      }).then(function (response) {
        return response;
      });
      return streamData;
    }
  }, {
    key: "SUBTITLES",
    get: function get() {
      var subtitles = this.STREAM.then(function (_ref8) {
        var stream = _ref8.stream,
            subtitleLocaleKey = _ref8.subtitleLocaleKey;
        return stream.subtitles[subtitleLocaleKey]; // Locale identifier is used as a JSON key ("subtitleLocaleKey" here)
      }).then(function (_ref9) {
        var format = _ref9.format,
            locale = _ref9.locale,
            url = _ref9.url;
        return {
          format: format,
          locale: locale,
          url: url
        };
      });
      return subtitles;
    }
  }, {
    key: "OPENINGS",
    value: function OPENINGS(videoDuration, openingDuration) {
      /* 
       * How the opening detection works:
       * • The .ass file is parsed to JSON 
       * • Each dialogue has a Start and an End
       * • Substracting the new Start and the previous End gives the elapsed time between the two dialogues
       * • If the interval is longer than an opening duration (~1:30), it's considered as an opening
       *   Note : The opening duration is set by the user in the popup
       * 
       * Detection issues:
       * • If the translator hasn't given Name to dialogues, any text will be included in the detection (sign, credits, etc.)
       * • Depending on the language and the translator, words like "sign", "credits", might be differents and included in the detection
       * • Dubbed episodes openings are not detected at the moment, fetching subtitles in all languages could be a solution, but longer to calculate
       */
      var openings = this.SUBTITLES.then(function (_ref10) {
        var format = _ref10.format,
            locale = _ref10.locale,
            url = _ref10.url;

        if (locale === "en-US" || locale === "fr-FR") {
          // Supported languages (excluded words of other languages are not defined yet)
          if (format === "ass") {
            var parser = __webpack_require__(/*! ass-parser */ "./node_modules/ass-parser/index.js");

            return fetch(url).then(function (response) {
              return response.text();
            }).then(function (data) {
              var openings = [];
              var ass = parser(data, {
                comments: true
              }); // Parse ASS data to JSON: github.com/eush77/ass-parser

              ass.forEach(function (data, index) {
                if (data.section === "Events") {
                  var prevEnd = "00:00:00.00";
                  var regex = new RegExp("^(sign|credits|crédits|op|ed)$"); // Excluded words

                  data.body.forEach(function (_ref11, index) {
                    var key = _ref11.key,
                        value = _ref11.value;

                    // For each dialogue
                    // Check if interval between two dialogues can contain an opening
                    if (key == "Dialogue" && !regex.test(value.Name.toLowerCase())) {
                      var prevEndSeconds = toSeconds(prevEnd);
                      var startSeconds = toSeconds(value.Start);

                      if (startSeconds - prevEndSeconds >= openingDuration) {
                        openings.push({
                          "start": prevEndSeconds + 1,
                          "end": startSeconds - 1,
                          "start_full": prevEnd,
                          "end_full": value.Start
                        });
                        console.log("Opening detected from " + prevEnd + " to " + value.Start + ", duration : " + (startSeconds - prevEndSeconds) + "s");
                      }

                      prevEnd = value.End;
                    } // Check the interval from the last dialogues to the end of the video too 


                    if (index === data.body.length - 1) {
                      var videoDurationSeconds = Math.round(videoDuration);
                      var interval = videoDurationSeconds - toSeconds(prevEnd); // The 2nd condition is a workaround for subbed episodes, not definitive

                      if (interval >= openingDuration && interval < videoDurationSeconds - 1) {
                        openings.push({
                          "start": toSeconds(prevEnd),
                          "end": videoDurationSeconds,
                          "start_full": prevEnd,
                          "end_full": toHHMMSS(videoDuration)
                        });
                        console.log("Opening detected from " + prevEnd + " to the end, duration : " + (videoDurationSeconds - toSeconds(prevEnd)) + "s");
                      }
                    }
                  });
                }
              });
              return openings;
            })["catch"](function (error) {
              return console.log("%cOpening cannot be detected", 'color:red;font-weight:bold');
            });
          }
        }
      })["catch"](function (error) {
        return console.log("%cSubtitles cannot be parsed or language is not available", 'color:red;font-weight:bold');
      });
      return openings;
    }
  }]);

  return API;
}();



function toSeconds(hh_mm_ss) {
  var split = hh_mm_ss.split('.')[0].split(":");
  return split[0] * 3600 + split[1] * 60 + +split[2];
}

function toHHMMSS(seconds) {
  return new Date(seconds * 1000).toISOString().substring(14, 19);
}

/***/ }),

/***/ "./assets/js/classes/message-api.js":
/*!******************************************!*\
  !*** ./assets/js/classes/message-api.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./assets/js/classes/page-style.js":
/*!*****************************************!*\
  !*** ./assets/js/classes/page-style.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PageStyle)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var PageStyle = /*#__PURE__*/function () {
  function PageStyle() {
    _classCallCheck(this, PageStyle);
  }

  _createClass(PageStyle, null, [{
    key: "set",
    value: function set(type, parameters) {
      switch (type) {
        case "updateThemeColor":
          updateThemeColor(parameters.color);
          break;

        case "toggleThumbnails":
          toggleThumbnails(parameters.state);
          break;

        case "toggleAvatarFavicon":
          toggleAvatarFavicon(parameters.state);
          break;

        case "togglePlayerThumbnail":
          togglePlayerThumbnail(parameters.state);
          break;
      }
    }
  }]);

  return PageStyle;
}();
/*
 * Create style element and add it to the DOM
 */




function createStyleElement(id) {
  var myStyle = document.createElement('style');
  myStyle.id = id;
  document.getElementsByTagName('head')[0].appendChild(myStyle);
  return myStyle;
}

var blurredThumbnailStyle = createStyleElement("blurredThumbnailStyle");

function toggleThumbnails(state) {
  // Blur/show episode thumbnails
  blurredThumbnailStyle.innerHTML = state ? ".prev-next-episodes img,.episode-list img,.erc-up-next-section img {\n            filter: blur(20px);\n            -webkit-filter: blur(20px);\n            -moz-filter: blur(20px);\n            -o-filter: blur(20px);\n            -ms-filter: blur(20px);\n        }" : "";
}

var playerThumbnailStyle = createStyleElement("playerThumbnailStyle");

function togglePlayerThumbnail(state) {
  // Hide/show player thumbnail
  playerThumbnailStyle.innerHTML = state ? "" : "div[class=\"css-1dbjc4n r-1awozwy r-1777fci\"] {\n            visibility: hidden;\n        }";
}

var themeColorStyle = createStyleElement("themeColorStyle");

function updateThemeColor(color) {
  themeColorStyle.innerHTML = ".erc-logo .logo-icon {\n        fill: ".concat(color, ";\n    }\n    ::selection,\n    .erc-current-media-info .show-title-link,\n    .info-tag--is-six--oJ2yw,\n    svg[data-t=\"loader-svg\"] > path,\n    .erc-user-menu-nav-item.state-active,\n    .navigation-link.state-active > span,\n    .erc-menu-item-title.state-active,\n    .submenu-item-title.state-active > h5,\n    .activate-device-nav-link > span,\n    .button--is-type-one-weak--KLvCX {\n        color: ").concat(color, ";\n    }\n    .progress-bar__progress--PhR3h,\n    .button--is-type-one--3uIzT,\n    .tabs-item--is-active--66UFY:after,\n    .carousel-tabs__tab--is-active--OWPNm > div:before {\n        background-color: ").concat(color, ";\n    }\n    .button--is-type-one--3uIzT:hover {\n        background-color: ").concat(increaseBrightness(color, 20), ";\n    }\n    .button--is-type-one-weak--KLvCX:hover {\n        color: ").concat(increaseBrightness(color, 20), ";\n    }"); // https://stackoverflow.com/a/33385707

  function increaseBrightness(color, percent) {
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var color = ctx.getImageData(0, 0, 1, 1);
    var r = color.data[0] + Math.floor(percent / 100 * 255);
    var g = color.data[1] + Math.floor(percent / 100 * 255);
    var b = color.data[2] + Math.floor(percent / 100 * 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
}

var favicons = null;
var userAvatar = null;

function toggleAvatarFavicon(_x) {
  return _toggleAvatarFavicon.apply(this, arguments);
}
/*
 * Promise for document.querySelector(selector)
 * https://stackoverflow.com/a/61511955
 */


function _toggleAvatarFavicon() {
  _toggleAvatarFavicon = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(state) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!state) {
              _context.next = 8;
              break;
            }

            if (!(userAvatar === null)) {
              _context.next = 5;
              break;
            }

            favicons = document.querySelectorAll('link[rel][type="image/png"]');
            _context.next = 5;
            return waitForElement('div[class="erc-header-avatar"] img[class="content-image__image--7tGlg"]').then(function (myImg) {
              userAvatar = myImg.src;
            });

          case 5:
            favicons.forEach(function (favicon) {
              favicon.href = userAvatar;
            });
            _context.next = 9;
            break;

          case 8:
            favicons.forEach(function (favicon) {
              favicon.href = "https://static.crunchyroll.com/cxweb/assets/img/favicons/favicon-".concat(favicon.sizes, ".png");
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _toggleAvatarFavicon.apply(this, arguments);
}

function waitForElement(selector) {
  return new Promise(function (resolve) {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    var observer = new MutationObserver(function () {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

/***/ }),

/***/ "./node_modules/flatmap/index.js":
/*!***************************************!*\
  !*** ./node_modules/flatmap/index.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";


module.exports = function(arr, iter, context) {
  var results = [];
  if (!Array.isArray(arr)) return results;
  arr.forEach(function(value, index, list) {
    var res = iter.call(context, value, index, list);
    if (Array.isArray(res)) {
      results.push.apply(results, res);
    } else if (res != null) {
      results.push(res);
    }
  });
  return results;
};

/***/ }),

/***/ "./node_modules/fzip/src/fzip.js":
/*!***************************************!*\
  !*** ./node_modules/fzip/src/fzip.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var zip = __webpack_require__(/*! ./zip */ "./node_modules/fzip/src/zip.js")
  , zipObject = __webpack_require__(/*! lodash.zipobject */ "./node_modules/lodash.zipobject/index.js");


/**
 * Make mapper function for a string spec.
 *
 * @arg {string} spec
 * @return {function}
 */
var makeSpecMapper = function (spec) {
  var keys = spec.split(',').map(Function.call.bind(''.trim));

  return function () {
    return zipObject(keys, arguments);
  };
};


/**
 * Make fzip that uses arrayMethod to transform the zipped result.
 */
var makeFzip = function (arrayMethod) {
  return function () {
    if (!arguments.length) {
      return null;
    }

    var collections = [].slice.call(arguments, 0, -1)
      , mapper = [].slice.call(arguments, -1)[0];

    if (typeof mapper == 'string') {
      mapper = makeSpecMapper(mapper);
    }

    // If no callback passed, fall back to plain zip.
    if (typeof mapper != 'function') {
      collections.push(mapper);
      return zip.apply(null, collections);
    }

    if (!collections.length) {
      return null;
    }

    return zip.apply(null, collections)[arrayMethod](function (items) {
      return mapper.apply(null, items);
    });
  };
};


module.exports = makeFzip('map');
module.exports.each = makeFzip('forEach');


/***/ }),

/***/ "./node_modules/fzip/src/zip.js":
/*!**************************************!*\
  !*** ./node_modules/fzip/src/zip.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var lodashZip = __webpack_require__(/*! lodash.zip */ "./node_modules/lodash.zip/index.js");


/**
 * Fix lodash.zip's non-uniform behavior
 *   when the only array is given or not at all.
 *
 * @examples
 * zip([1, 2, 3], [4, 5, 6]) -> [[1, 4], [2, 5], [3, 6]]
 * zip([1, 2, 3]) -> [[1], [2], [3]]
 * zip() -> null
 */
module.exports = function () {
  if (arguments.length > 1) {
    return lodashZip.apply(null, arguments);
  }
  else if (arguments.length == 1) {
    return arguments[0].map(function (item) {
      return [item];
    });
  }
  else {
    return null;
  }
};


/***/ }),

/***/ "./node_modules/lodash._arraypool/index.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash._arraypool/index.js ***!
  \*************************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to pool arrays and objects used internally */
var arrayPool = [];

module.exports = arrayPool;


/***/ }),

/***/ "./node_modules/lodash._basebind/index.js":
/*!************************************************!*\
  !*** ./node_modules/lodash._basebind/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = __webpack_require__(/*! lodash._basecreate */ "./node_modules/lodash._basecreate/index.js"),
    isObject = __webpack_require__(/*! lodash.isobject */ "./node_modules/lodash.isobject/index.js"),
    setBindData = __webpack_require__(/*! lodash._setbinddata */ "./node_modules/lodash._setbinddata/index.js"),
    slice = __webpack_require__(/*! lodash._slice */ "./node_modules/lodash._slice/index.js");

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `_.bind` that creates the bound function and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new bound function.
 */
function baseBind(bindData) {
  var func = bindData[0],
      partialArgs = bindData[2],
      thisArg = bindData[4];

  function bound() {
    // `Function#bind` spec
    // http://es5.github.io/#x15.3.4.5
    if (partialArgs) {
      // avoid `arguments` object deoptimizations by using `slice` instead
      // of `Array.prototype.slice.call` and not assigning `arguments` to a
      // variable as a ternary expression
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    // mimic the constructor's `return` behavior
    // http://es5.github.io/#x13.2.2
    if (this instanceof bound) {
      // ensure `new bound` is an instance of `func`
      var thisBinding = baseCreate(func.prototype),
          result = func.apply(thisBinding, args || arguments);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisArg, args || arguments);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseBind;


/***/ }),

/***/ "./node_modules/lodash._basecreate/index.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash._basecreate/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = __webpack_require__(/*! lodash._isnative */ "./node_modules/lodash._isnative/index.js"),
    isObject = __webpack_require__(/*! lodash.isobject */ "./node_modules/lodash.isobject/index.js"),
    noop = __webpack_require__(/*! lodash.noop */ "./node_modules/lodash.noop/index.js");

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(prototype, properties) {
  return isObject(prototype) ? nativeCreate(prototype) : {};
}
// fallback for browsers without `Object.create`
if (!nativeCreate) {
  baseCreate = (function() {
    function Object() {}
    return function(prototype) {
      if (isObject(prototype)) {
        Object.prototype = prototype;
        var result = new Object;
        Object.prototype = null;
      }
      return result || __webpack_require__.g.Object();
    };
  }());
}

module.exports = baseCreate;


/***/ }),

/***/ "./node_modules/lodash._basecreatecallback/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/lodash._basecreatecallback/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var bind = __webpack_require__(/*! lodash.bind */ "./node_modules/lodash.bind/index.js"),
    identity = __webpack_require__(/*! lodash.identity */ "./node_modules/lodash.identity/index.js"),
    setBindData = __webpack_require__(/*! lodash._setbinddata */ "./node_modules/lodash._setbinddata/index.js"),
    support = __webpack_require__(/*! lodash.support */ "./node_modules/lodash.support/index.js");

/** Used to detected named functions */
var reFuncName = /^\s*function[ \n\r\t]+\w/;

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/** Native method shortcuts */
var fnToString = Function.prototype.toString;

/**
 * The base implementation of `_.createCallback` without support for creating
 * "_.pluck" or "_.where" style callbacks.
 *
 * @private
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 */
function baseCreateCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  // exit early for no `thisArg` or already bound by `Function#bind`
  if (typeof thisArg == 'undefined' || !('prototype' in func)) {
    return func;
  }
  var bindData = func.__bindData__;
  if (typeof bindData == 'undefined') {
    if (support.funcNames) {
      bindData = !func.name;
    }
    bindData = bindData || !support.funcDecomp;
    if (!bindData) {
      var source = fnToString.call(func);
      if (!support.funcNames) {
        bindData = !reFuncName.test(source);
      }
      if (!bindData) {
        // checks if `func` references the `this` keyword and stores the result
        bindData = reThis.test(source);
        setBindData(func, bindData);
      }
    }
  }
  // exit early if there are no `this` references or `func` is bound
  if (bindData === false || (bindData !== true && bindData[1] & 1)) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 2: return function(a, b) {
      return func.call(thisArg, a, b);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
  }
  return bind(func, thisArg);
}

module.exports = baseCreateCallback;


/***/ }),

/***/ "./node_modules/lodash._basecreatewrapper/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/lodash._basecreatewrapper/index.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = __webpack_require__(/*! lodash._basecreate */ "./node_modules/lodash._basecreate/index.js"),
    isObject = __webpack_require__(/*! lodash.isobject */ "./node_modules/lodash.isobject/index.js"),
    setBindData = __webpack_require__(/*! lodash._setbinddata */ "./node_modules/lodash._setbinddata/index.js"),
    slice = __webpack_require__(/*! lodash._slice */ "./node_modules/lodash._slice/index.js");

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `createWrapper` that creates the wrapper and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new function.
 */
function baseCreateWrapper(bindData) {
  var func = bindData[0],
      bitmask = bindData[1],
      partialArgs = bindData[2],
      partialRightArgs = bindData[3],
      thisArg = bindData[4],
      arity = bindData[5];

  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      key = func;

  function bound() {
    var thisBinding = isBind ? thisArg : this;
    if (partialArgs) {
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    if (partialRightArgs || isCurry) {
      args || (args = slice(arguments));
      if (partialRightArgs) {
        push.apply(args, partialRightArgs);
      }
      if (isCurry && args.length < arity) {
        bitmask |= 16 & ~32;
        return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
      }
    }
    args || (args = arguments);
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (this instanceof bound) {
      thisBinding = baseCreate(func.prototype);
      var result = func.apply(thisBinding, args);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisBinding, args);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseCreateWrapper;


/***/ }),

/***/ "./node_modules/lodash._baseisequal/index.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash._baseisequal/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = __webpack_require__(/*! lodash.forin */ "./node_modules/lodash.forin/index.js"),
    getArray = __webpack_require__(/*! lodash._getarray */ "./node_modules/lodash._getarray/index.js"),
    isFunction = __webpack_require__(/*! lodash.isfunction */ "./node_modules/lodash.isfunction/index.js"),
    objectTypes = __webpack_require__(/*! lodash._objecttypes */ "./node_modules/lodash._objecttypes/index.js"),
    releaseArray = __webpack_require__(/*! lodash._releasearray */ "./node_modules/lodash._releasearray/index.js");

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.isEqual`, without support for `thisArg` binding,
 * that allows partial "_.where" style comparisons.
 *
 * @private
 * @param {*} a The value to compare.
 * @param {*} b The other value to compare.
 * @param {Function} [callback] The function to customize comparing values.
 * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `a` objects.
 * @param {Array} [stackB=[]] Tracks traversed `b` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
  // used to indicate that when comparing objects, `a` has at least the properties of `b`
  if (callback) {
    var result = callback(a, b);
    if (typeof result != 'undefined') {
      return !!result;
    }
  }
  // exit early for identical values
  if (a === b) {
    // treat `+0` vs. `-0` as not equal
    return a !== 0 || (1 / a == 1 / b);
  }
  var type = typeof a,
      otherType = typeof b;

  // exit early for unlike primitive values
  if (a === a &&
      !(a && objectTypes[type]) &&
      !(b && objectTypes[otherType])) {
    return false;
  }
  // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
  // http://es5.github.io/#x15.3.4.4
  if (a == null || b == null) {
    return a === b;
  }
  // compare [[Class]] names
  var className = toString.call(a),
      otherClass = toString.call(b);

  if (className == argsClass) {
    className = objectClass;
  }
  if (otherClass == argsClass) {
    otherClass = objectClass;
  }
  if (className != otherClass) {
    return false;
  }
  switch (className) {
    case boolClass:
    case dateClass:
      // coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
      return +a == +b;

    case numberClass:
      // treat `NaN` vs. `NaN` as equal
      return (a != +a)
        ? b != +b
        // but treat `+0` vs. `-0` as not equal
        : (a == 0 ? (1 / a == 1 / b) : a == +b);

    case regexpClass:
    case stringClass:
      // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
      // treat string primitives and their corresponding object instances as equal
      return a == String(b);
  }
  var isArr = className == arrayClass;
  if (!isArr) {
    // unwrap any `lodash` wrapped values
    var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
        bWrapped = hasOwnProperty.call(b, '__wrapped__');

    if (aWrapped || bWrapped) {
      return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
    }
    // exit for functions and DOM nodes
    if (className != objectClass) {
      return false;
    }
    // in older versions of Opera, `arguments` objects have `Array` constructors
    var ctorA = a.constructor,
        ctorB = b.constructor;

    // non `Object` object instances with different constructors are not equal
    if (ctorA != ctorB &&
          !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
          ('constructor' in a && 'constructor' in b)
        ) {
      return false;
    }
  }
  // assume cyclic structures are equal
  // the algorithm for detecting cyclic structures is adapted from ES 5.1
  // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
  var initedStack = !stackA;
  stackA || (stackA = getArray());
  stackB || (stackB = getArray());

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == a) {
      return stackB[length] == b;
    }
  }
  var size = 0;
  result = true;

  // add `a` and `b` to the stack of traversed objects
  stackA.push(a);
  stackB.push(b);

  // recursively compare objects and arrays (susceptible to call stack limits)
  if (isArr) {
    // compare lengths to determine if a deep comparison is necessary
    length = a.length;
    size = b.length;
    result = size == length;

    if (result || isWhere) {
      // deep compare the contents, ignoring non-numeric properties
      while (size--) {
        var index = length,
            value = b[size];

        if (isWhere) {
          while (index--) {
            if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
          break;
        }
      }
    }
  }
  else {
    // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
    // which, in this case, is more costly
    forIn(b, function(value, key, b) {
      if (hasOwnProperty.call(b, key)) {
        // count the number of properties.
        size++;
        // deep compare each property value.
        return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
      }
    });

    if (result && !isWhere) {
      // ensure both objects have the same number of properties
      forIn(a, function(value, key, a) {
        if (hasOwnProperty.call(a, key)) {
          // `size` will be `-1` if `a` has more properties than `b`
          return (result = --size > -1);
        }
      });
    }
  }
  stackA.pop();
  stackB.pop();

  if (initedStack) {
    releaseArray(stackA);
    releaseArray(stackB);
  }
  return result;
}

module.exports = baseIsEqual;


/***/ }),

/***/ "./node_modules/lodash._charatcallback/index.js":
/*!******************************************************!*\
  !*** ./node_modules/lodash._charatcallback/index.js ***!
  \******************************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used by `_.max` and `_.min` as the default callback when a given
 * collection is a string value.
 *
 * @private
 * @param {string} value The character to inspect.
 * @returns {number} Returns the code unit of given character.
 */
function charAtCallback(value) {
  return value.charCodeAt(0);
}

module.exports = charAtCallback;


/***/ }),

/***/ "./node_modules/lodash._createwrapper/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash._createwrapper/index.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseBind = __webpack_require__(/*! lodash._basebind */ "./node_modules/lodash._basebind/index.js"),
    baseCreateWrapper = __webpack_require__(/*! lodash._basecreatewrapper */ "./node_modules/lodash._basecreatewrapper/index.js"),
    isFunction = __webpack_require__(/*! lodash.isfunction */ "./node_modules/lodash.isfunction/index.js"),
    slice = __webpack_require__(/*! lodash._slice */ "./node_modules/lodash._slice/index.js");

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push,
    unshift = arrayRef.unshift;

/**
 * Creates a function that, when called, either curries or invokes `func`
 * with an optional `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of method flags to compose.
 *  The bitmask may be composed of the following flags:
 *  1 - `_.bind`
 *  2 - `_.bindKey`
 *  4 - `_.curry`
 *  8 - `_.curry` (bound)
 *  16 - `_.partial`
 *  32 - `_.partialRight`
 * @param {Array} [partialArgs] An array of arguments to prepend to those
 *  provided to the new function.
 * @param {Array} [partialRightArgs] An array of arguments to append to those
 *  provided to the new function.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new function.
 */
function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      isPartial = bitmask & 16,
      isPartialRight = bitmask & 32;

  if (!isBindKey && !isFunction(func)) {
    throw new TypeError;
  }
  if (isPartial && !partialArgs.length) {
    bitmask &= ~16;
    isPartial = partialArgs = false;
  }
  if (isPartialRight && !partialRightArgs.length) {
    bitmask &= ~32;
    isPartialRight = partialRightArgs = false;
  }
  var bindData = func && func.__bindData__;
  if (bindData && bindData !== true) {
    // clone `bindData`
    bindData = slice(bindData);
    if (bindData[2]) {
      bindData[2] = slice(bindData[2]);
    }
    if (bindData[3]) {
      bindData[3] = slice(bindData[3]);
    }
    // set `thisBinding` is not previously bound
    if (isBind && !(bindData[1] & 1)) {
      bindData[4] = thisArg;
    }
    // set if previously bound but not currently (subsequent curried functions)
    if (!isBind && bindData[1] & 1) {
      bitmask |= 8;
    }
    // set curried arity if not yet set
    if (isCurry && !(bindData[1] & 4)) {
      bindData[5] = arity;
    }
    // append partial left arguments
    if (isPartial) {
      push.apply(bindData[2] || (bindData[2] = []), partialArgs);
    }
    // append partial right arguments
    if (isPartialRight) {
      unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
    }
    // merge flags
    bindData[1] |= bitmask;
    return createWrapper.apply(null, bindData);
  }
  // fast path for `_.bind`
  var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
  return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
}

module.exports = createWrapper;


/***/ }),

/***/ "./node_modules/lodash._getarray/index.js":
/*!************************************************!*\
  !*** ./node_modules/lodash._getarray/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = __webpack_require__(/*! lodash._arraypool */ "./node_modules/lodash._arraypool/index.js");

/**
 * Gets an array from the array pool or creates a new one if the pool is empty.
 *
 * @private
 * @returns {Array} The array from the pool.
 */
function getArray() {
  return arrayPool.pop() || [];
}

module.exports = getArray;


/***/ }),

/***/ "./node_modules/lodash._isnative/index.js":
/*!************************************************!*\
  !*** ./node_modules/lodash._isnative/index.js ***!
  \************************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Used to detect if a method is native */
var reNative = RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
 */
function isNative(value) {
  return typeof value == 'function' && reNative.test(value);
}

module.exports = isNative;


/***/ }),

/***/ "./node_modules/lodash._maxpoolsize/index.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash._maxpoolsize/index.js ***!
  \***************************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used as the max size of the `arrayPool` and `objectPool` */
var maxPoolSize = 40;

module.exports = maxPoolSize;


/***/ }),

/***/ "./node_modules/lodash._objecttypes/index.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash._objecttypes/index.js ***!
  \***************************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to determine if values are of the language type Object */
var objectTypes = {
  'boolean': false,
  'function': true,
  'object': true,
  'number': false,
  'string': false,
  'undefined': false
};

module.exports = objectTypes;


/***/ }),

/***/ "./node_modules/lodash._releasearray/index.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash._releasearray/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = __webpack_require__(/*! lodash._arraypool */ "./node_modules/lodash._arraypool/index.js"),
    maxPoolSize = __webpack_require__(/*! lodash._maxpoolsize */ "./node_modules/lodash._maxpoolsize/index.js");

/**
 * Releases the given array back to the array pool.
 *
 * @private
 * @param {Array} [array] The array to release.
 */
function releaseArray(array) {
  array.length = 0;
  if (arrayPool.length < maxPoolSize) {
    arrayPool.push(array);
  }
}

module.exports = releaseArray;


/***/ }),

/***/ "./node_modules/lodash._setbinddata/index.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash._setbinddata/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = __webpack_require__(/*! lodash._isnative */ "./node_modules/lodash._isnative/index.js"),
    noop = __webpack_require__(/*! lodash.noop */ "./node_modules/lodash.noop/index.js");

/** Used as the property descriptor for `__bindData__` */
var descriptor = {
  'configurable': false,
  'enumerable': false,
  'value': null,
  'writable': false
};

/** Used to set meta data on functions */
var defineProperty = (function() {
  // IE 8 only accepts DOM elements
  try {
    var o = {},
        func = isNative(func = Object.defineProperty) && func,
        result = func(o, o, o) && func;
  } catch(e) { }
  return result;
}());

/**
 * Sets `this` binding data on a given function.
 *
 * @private
 * @param {Function} func The function to set data on.
 * @param {Array} value The data array to set.
 */
var setBindData = !defineProperty ? noop : function(func, value) {
  descriptor.value = value;
  defineProperty(func, '__bindData__', descriptor);
};

module.exports = setBindData;


/***/ }),

/***/ "./node_modules/lodash._shimkeys/index.js":
/*!************************************************!*\
  !*** ./node_modules/lodash._shimkeys/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = __webpack_require__(/*! lodash._objecttypes */ "./node_modules/lodash._objecttypes/index.js");

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which produces an array of the
 * given object's own enumerable property names.
 *
 * @private
 * @type Function
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 */
var shimKeys = function(object) {
  var index, iterable = object, result = [];
  if (!iterable) return result;
  if (!(objectTypes[typeof object])) return result;
    for (index in iterable) {
      if (hasOwnProperty.call(iterable, index)) {
        result.push(index);
      }
    }
  return result
};

module.exports = shimKeys;


/***/ }),

/***/ "./node_modules/lodash._slice/index.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash._slice/index.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Slices the `collection` from the `start` index up to, but not including,
 * the `end` index.
 *
 * Note: This function is used instead of `Array#slice` to support node lists
 * in IE < 9 and to ensure dense arrays are returned.
 *
 * @private
 * @param {Array|Object|string} collection The collection to slice.
 * @param {number} start The start index.
 * @param {number} end The end index.
 * @returns {Array} Returns the new array.
 */
function slice(array, start, end) {
  start || (start = 0);
  if (typeof end == 'undefined') {
    end = array ? array.length : 0;
  }
  var index = -1,
      length = end - start || 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = array[start + index];
  }
  return result;
}

module.exports = slice;


/***/ }),

/***/ "./node_modules/lodash.bind/index.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash.bind/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = __webpack_require__(/*! lodash._createwrapper */ "./node_modules/lodash._createwrapper/index.js"),
    slice = __webpack_require__(/*! lodash._slice */ "./node_modules/lodash._slice/index.js");

/**
 * Creates a function that, when called, invokes `func` with the `this`
 * binding of `thisArg` and prepends any additional `bind` arguments to those
 * provided to the bound function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to bind.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var func = function(greeting) {
 *   return greeting + ' ' + this.name;
 * };
 *
 * func = _.bind(func, { 'name': 'fred' }, 'hi');
 * func();
 * // => 'hi fred'
 */
function bind(func, thisArg) {
  return arguments.length > 2
    ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
    : createWrapper(func, 1, null, null, thisArg);
}

module.exports = bind;


/***/ }),

/***/ "./node_modules/lodash.createcallback/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash.createcallback/index.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.4 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = __webpack_require__(/*! lodash._basecreatecallback */ "./node_modules/lodash._basecreatecallback/index.js"),
    baseIsEqual = __webpack_require__(/*! lodash._baseisequal */ "./node_modules/lodash._baseisequal/index.js"),
    isObject = __webpack_require__(/*! lodash.isobject */ "./node_modules/lodash.isobject/index.js"),
    keys = __webpack_require__(/*! lodash.keys */ "./node_modules/lodash.keys/index.js"),
    property = __webpack_require__(/*! lodash.property */ "./node_modules/lodash.property/index.js");

/**
 * Produces a callback bound to an optional `thisArg`. If `func` is a property
 * name the created callback will return the property value for a given element.
 * If `func` is an object the created callback will return `true` for elements
 * that contain the equivalent object properties, otherwise it will return `false`.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // wrap to create custom callback shorthands
 * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
 *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
 *   return !match ? func(callback, thisArg) : function(object) {
 *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
 *   };
 * });
 *
 * _.filter(characters, 'age__gt38');
 * // => [{ 'name': 'fred', 'age': 40 }]
 */
function createCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (func == null || type == 'function') {
    return baseCreateCallback(func, thisArg, argCount);
  }
  // handle "_.pluck" style callback shorthands
  if (type != 'object') {
    return property(func);
  }
  var props = keys(func),
      key = props[0],
      a = func[key];

  // handle "_.where" style callback shorthands
  if (props.length == 1 && a === a && !isObject(a)) {
    // fast path the common case of providing an object with a single
    // property containing a primitive value
    return function(object) {
      var b = object[key];
      return a === b && (a !== 0 || (1 / a == 1 / b));
    };
  }
  return function(object) {
    var length = props.length,
        result = false;

    while (length--) {
      if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
        break;
      }
    }
    return result;
  };
}

module.exports = createCallback;


/***/ }),

/***/ "./node_modules/lodash.foreach/index.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash.foreach/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = __webpack_require__(/*! lodash._basecreatecallback */ "./node_modules/lodash._basecreatecallback/index.js"),
    forOwn = __webpack_require__(/*! lodash.forown */ "./node_modules/lodash.forown/index.js");

/**
 * Iterates over elements of a collection, executing the callback for each
 * element. The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection). Callbacks may exit iteration early by
 * explicitly returning `false`.
 *
 * Note: As with other "Collections" methods, objects with a `length` property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
 * // => logs each number and returns '1,2,3'
 *
 * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
 * // => logs each number and returns the object (property order is not guaranteed across environments)
 */
function forEach(collection, callback, thisArg) {
  var index = -1,
      length = collection ? collection.length : 0;

  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    while (++index < length) {
      if (callback(collection[index], index, collection) === false) {
        break;
      }
    }
  } else {
    forOwn(collection, callback);
  }
  return collection;
}

module.exports = forEach;


/***/ }),

/***/ "./node_modules/lodash.forin/index.js":
/*!********************************************!*\
  !*** ./node_modules/lodash.forin/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = __webpack_require__(/*! lodash._basecreatecallback */ "./node_modules/lodash._basecreatecallback/index.js"),
    objectTypes = __webpack_require__(/*! lodash._objecttypes */ "./node_modules/lodash._objecttypes/index.js");

/**
 * Iterates over own and inherited enumerable properties of an object,
 * executing the callback for each property. The callback is bound to `thisArg`
 * and invoked with three arguments; (value, key, object). Callbacks may exit
 * iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * Shape.prototype.move = function(x, y) {
 *   this.x += x;
 *   this.y += y;
 * };
 *
 * _.forIn(new Shape, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
 */
var forIn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    for (index in iterable) {
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forIn;


/***/ }),

/***/ "./node_modules/lodash.forown/index.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash.forown/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = __webpack_require__(/*! lodash._basecreatecallback */ "./node_modules/lodash._basecreatecallback/index.js"),
    keys = __webpack_require__(/*! lodash.keys */ "./node_modules/lodash.keys/index.js"),
    objectTypes = __webpack_require__(/*! lodash._objecttypes */ "./node_modules/lodash._objecttypes/index.js");

/**
 * Iterates over own enumerable properties of an object, executing the callback
 * for each property. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, key, object). Callbacks may exit iteration early by
 * explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
 *   console.log(key);
 * });
 * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
 */
var forOwn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forOwn;


/***/ }),

/***/ "./node_modules/lodash.identity/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.identity/index.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),

/***/ "./node_modules/lodash.isarray/index.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash.isarray/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = __webpack_require__(/*! lodash._isnative */ "./node_modules/lodash._isnative/index.js");

/** `Object#toString` result shortcuts */
var arrayClass = '[object Array]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

/**
 * Checks if `value` is an array.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
 * @example
 *
 * (function() { return _.isArray(arguments); })();
 * // => false
 *
 * _.isArray([1, 2, 3]);
 * // => true
 */
var isArray = nativeIsArray || function(value) {
  return value && typeof value == 'object' && typeof value.length == 'number' &&
    toString.call(value) == arrayClass || false;
};

module.exports = isArray;


/***/ }),

/***/ "./node_modules/lodash.isfunction/index.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash.isfunction/index.js ***!
  \*************************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a function.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 */
function isFunction(value) {
  return typeof value == 'function';
}

module.exports = isFunction;


/***/ }),

/***/ "./node_modules/lodash.isobject/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.isobject/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = __webpack_require__(/*! lodash._objecttypes */ "./node_modules/lodash._objecttypes/index.js");

/**
 * Checks if `value` is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // check if the value is the ECMAScript language type of Object
  // http://es5.github.io/#x8
  // and avoid a V8 bug
  // http://code.google.com/p/v8/issues/detail?id=2291
  return !!(value && objectTypes[typeof value]);
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash.isstring/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.isstring/index.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a string.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
 * @example
 *
 * _.isString('fred');
 * // => true
 */
function isString(value) {
  return typeof value == 'string' ||
    value && typeof value == 'object' && toString.call(value) == stringClass || false;
}

module.exports = isString;


/***/ }),

/***/ "./node_modules/lodash.keys/index.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash.keys/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = __webpack_require__(/*! lodash._isnative */ "./node_modules/lodash._isnative/index.js"),
    isObject = __webpack_require__(/*! lodash.isobject */ "./node_modules/lodash.isobject/index.js"),
    shimKeys = __webpack_require__(/*! lodash._shimkeys */ "./node_modules/lodash._shimkeys/index.js");

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Creates an array composed of the own enumerable property names of an object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 * @example
 *
 * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
 * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  if (!isObject(object)) {
    return [];
  }
  return nativeKeys(object);
};

module.exports = keys;


/***/ }),

/***/ "./node_modules/lodash.map/index.js":
/*!******************************************!*\
  !*** ./node_modules/lodash.map/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = __webpack_require__(/*! lodash.createcallback */ "./node_modules/lodash.createcallback/index.js"),
    forOwn = __webpack_require__(/*! lodash.forown */ "./node_modules/lodash.forown/index.js");

/**
 * Creates an array of values by running each element in the collection
 * through the callback. The callback is bound to `thisArg` and invoked with
 * three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias collect
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of the results of each `callback` execution.
 * @example
 *
 * _.map([1, 2, 3], function(num) { return num * 3; });
 * // => [3, 6, 9]
 *
 * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
 * // => [3, 6, 9] (property order is not guaranteed across environments)
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.map(characters, 'name');
 * // => ['barney', 'fred']
 */
function map(collection, callback, thisArg) {
  var index = -1,
      length = collection ? collection.length : 0;

  callback = createCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    var result = Array(length);
    while (++index < length) {
      result[index] = callback(collection[index], index, collection);
    }
  } else {
    result = [];
    forOwn(collection, function(value, key, collection) {
      result[++index] = callback(value, key, collection);
    });
  }
  return result;
}

module.exports = map;


/***/ }),

/***/ "./node_modules/lodash.max/index.js":
/*!******************************************!*\
  !*** ./node_modules/lodash.max/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var charAtCallback = __webpack_require__(/*! lodash._charatcallback */ "./node_modules/lodash._charatcallback/index.js"),
    createCallback = __webpack_require__(/*! lodash.createcallback */ "./node_modules/lodash.createcallback/index.js"),
    forEach = __webpack_require__(/*! lodash.foreach */ "./node_modules/lodash.foreach/index.js"),
    forOwn = __webpack_require__(/*! lodash.forown */ "./node_modules/lodash.forown/index.js"),
    isArray = __webpack_require__(/*! lodash.isarray */ "./node_modules/lodash.isarray/index.js"),
    isString = __webpack_require__(/*! lodash.isstring */ "./node_modules/lodash.isstring/index.js");

/**
 * Retrieves the maximum value of a collection. If the collection is empty or
 * falsey `-Infinity` is returned. If a callback is provided it will be executed
 * for each value in the collection to generate the criterion by which the value
 * is ranked. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.max(characters, function(chr) { return chr.age; });
 * // => { 'name': 'fred', 'age': 40 };
 *
 * // using "_.pluck" callback shorthand
 * _.max(characters, 'age');
 * // => { 'name': 'fred', 'age': 40 };
 */
function max(collection, callback, thisArg) {
  var computed = -Infinity,
      result = computed;

  // allows working with functions like `_.map` without using
  // their `index` argument as a callback
  if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
    callback = null;
  }
  if (callback == null && isArray(collection)) {
    var index = -1,
        length = collection.length;

    while (++index < length) {
      var value = collection[index];
      if (value > result) {
        result = value;
      }
    }
  } else {
    callback = (callback == null && isString(collection))
      ? charAtCallback
      : createCallback(callback, thisArg, 3);

    forEach(collection, function(value, index, collection) {
      var current = callback(value, index, collection);
      if (current > computed) {
        computed = current;
        result = value;
      }
    });
  }
  return result;
}

module.exports = max;


/***/ }),

/***/ "./node_modules/lodash.noop/index.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash.noop/index.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A no-operation function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // no operation performed
}

module.exports = noop;


/***/ }),

/***/ "./node_modules/lodash.pluck/index.js":
/*!********************************************!*\
  !*** ./node_modules/lodash.pluck/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var map = __webpack_require__(/*! lodash.map */ "./node_modules/lodash.map/index.js");

/**
 * Retrieves the value of a specified property from all elements in the collection.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {string} property The name of the property to pluck.
 * @returns {Array} Returns a new array of property values.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.pluck(characters, 'name');
 * // => ['barney', 'fred']
 */
var pluck = map;

module.exports = pluck;


/***/ }),

/***/ "./node_modules/lodash.property/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.property/index.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates a "_.pluck" style function, which returns the `key` value of a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} key The name of the property to retrieve.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var characters = [
 *   { 'name': 'fred',   'age': 40 },
 *   { 'name': 'barney', 'age': 36 }
 * ];
 *
 * var getName = _.property('name');
 *
 * _.map(characters, getName);
 * // => ['barney', 'fred']
 *
 * _.sortBy(characters, getName);
 * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
 */
function property(key) {
  return function(object) {
    return object[key];
  };
}

module.exports = property;


/***/ }),

/***/ "./node_modules/lodash.support/index.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash.support/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = __webpack_require__(/*! lodash._isnative */ "./node_modules/lodash._isnative/index.js");

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/**
 * An object used to flag environments features.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

/**
 * Detect if functions can be decompiled by `Function#toString`
 * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcDecomp = !isNative(__webpack_require__.g.WinRTError) && reThis.test(function() { return this; });

/**
 * Detect if `Function#name` is supported (all but IE).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcNames = typeof Function.name == 'string';

module.exports = support;


/***/ }),

/***/ "./node_modules/lodash.zip/index.js":
/*!******************************************!*\
  !*** ./node_modules/lodash.zip/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var max = __webpack_require__(/*! lodash.max */ "./node_modules/lodash.max/index.js"),
    pluck = __webpack_require__(/*! lodash.pluck */ "./node_modules/lodash.pluck/index.js");

/**
 * Creates an array of grouped elements, the first of which contains the first
 * elements of the given arrays, the second of which contains the second
 * elements of the given arrays, and so on.
 *
 * @static
 * @memberOf _
 * @alias unzip
 * @category Arrays
 * @param {...Array} [array] Arrays to process.
 * @returns {Array} Returns a new array of grouped elements.
 * @example
 *
 * _.zip(['fred', 'barney'], [30, 40], [true, false]);
 * // => [['fred', 30, true], ['barney', 40, false]]
 */
function zip() {
  var array = arguments.length > 1 ? arguments : arguments[0],
      index = -1,
      length = array ? max(pluck(array, 'length')) : 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = pluck(array, index);
  }
  return result;
}

module.exports = zip;


/***/ }),

/***/ "./node_modules/lodash.zipobject/index.js":
/*!************************************************!*\
  !*** ./node_modules/lodash.zipobject/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isArray = __webpack_require__(/*! lodash.isarray */ "./node_modules/lodash.isarray/index.js");

/**
 * Creates an object composed from arrays of `keys` and `values`. Provide
 * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
 * or two arrays, one of `keys` and one of corresponding `values`.
 *
 * @static
 * @memberOf _
 * @alias object
 * @category Arrays
 * @param {Array} keys The array of keys.
 * @param {Array} [values=[]] The array of values.
 * @returns {Object} Returns an object composed of the given keys and
 *  corresponding values.
 * @example
 *
 * _.zipObject(['fred', 'barney'], [30, 40]);
 * // => { 'fred': 30, 'barney': 40 }
 */
function zipObject(keys, values) {
  var index = -1,
      length = keys ? keys.length : 0,
      result = {};

  if (!values && length && !isArray(keys[0])) {
    values = [];
  }
  while (++index < length) {
    var key = keys[index];
    if (values) {
      result[key] = values[index];
    } else if (key) {
      result[key[0]] = key[1];
    }
  }
  return result;
}

module.exports = zipObject;


/***/ }),

/***/ "./node_modules/regexp.execall/index.js":
/*!**********************************************!*\
  !*** ./node_modules/regexp.execall/index.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";



module.exports = function (regexp, string) {
  var match, matches = [];

  if (!regexp.global) {
    match = regexp.exec(string);
    return match ? [match] : [];
  }

  while (match = regexp.exec(string)) {
    matches.push(match);
    if (match[0] == '') {
      break;
    }
  }

  return matches;
};


/***/ }),

/***/ "./node_modules/zipmap/index.js":
/*!**************************************!*\
  !*** ./node_modules/zipmap/index.js ***!
  \**************************************/
/***/ ((module) => {

"use strict";


var toString = Function.call.bind(Object.prototype.toString);

function isObj(o) {
  return toString(o) === '[object Object]';
}

// Original zipmap
function _zipmap(keys, vals) {
  var shorter = keys.length > vals.length ? vals : keys;

  return shorter.reduce(function(map, val, idx) {
    map[keys[idx]] = vals[idx];
    return map;
  }, {});

}

function zipmapPairs(pairs) {
  return pairs.reduce(function(map, pair) {
    map[pair[0]] = pair[1];
    return map;
  }, {});
}

function zipmapObj(objs) {
  return objs.reduce(function(map, o) {
    map[o.key] = o.value;
    return map;
  }, {});
}

/**
 * Returns a map with the keys mapped to the corresponding vals.
 *
 * @param {array} keys
 * @param {array} [vals]
 *
 * @return {object}
 */
module.exports = function zipmap(keys, vals) {
  if (!vals) {
    if (Array.isArray(keys) && !keys.length) return {};
    if (Array.isArray(keys[0])) return zipmapPairs(keys);
    if (isObj(keys[0])) return zipmapObj(keys);
    throw new TypeError('Expected vals to be an array');
  }

  return _zipmap(keys, vals);
};


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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************************************!*\
  !*** ./assets/js/content-scripts/crp-page.js ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _classes_message_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../classes/message-api.js */ "./assets/js/classes/message-api.js");
/* harmony import */ var _classes_crp_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../classes/crp-api.js */ "./assets/js/classes/crp-api.js");
/* harmony import */ var _classes_page_style_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../classes/page-style.js */ "./assets/js/classes/page-style.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



 // Keyboard input events listener

document.addEventListener('keydown', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(event) {
    var name, code, openingDuration, res;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = event.key;
            code = event.code;
            _context.t0 = name;
            _context.next = _context.t0 === "c" ? 5 : _context.t0 === "s" ? 7 : _context.t0 === "t" ? 9 : 16;
            break;

          case 5:
            console.clear();
            return _context.abrupt("break", 16);

          case 7:
            timeout = setTimeout(function () {
              debugger;
            }, 0);
            return _context.abrupt("break", 16);

          case 9:
            _context.next = 11;
            return _classes_message_api_js__WEBPACK_IMPORTED_MODULE_0__["default"].getStorage("openingDuration");

          case 11:
            openingDuration = _context.sent;
            _context.next = 14;
            return _classes_crp_api_js__WEBPACK_IMPORTED_MODULE_1__["default"].OPENINGS(1420, openingDuration);

          case 14:
            res = _context.sent;
            console.log(res);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(), false);
/**
 * Initialize CrunchyrollPlus
 * Load data from the chrome storage
 */

(function () {
  var _InitPage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = _classes_page_style_js__WEBPACK_IMPORTED_MODULE_2__["default"];
            _context2.next = 3;
            return _classes_message_api_js__WEBPACK_IMPORTED_MODULE_0__["default"].getStorage("blurredThumbnails");

          case 3:
            _context2.t1 = _context2.sent;
            _context2.t2 = {
              state: _context2.t1
            };

            _context2.t0.set.call(_context2.t0, "toggleThumbnails", _context2.t2);

            _context2.t3 = _classes_page_style_js__WEBPACK_IMPORTED_MODULE_2__["default"];
            _context2.next = 9;
            return _classes_message_api_js__WEBPACK_IMPORTED_MODULE_0__["default"].getStorage("avatarFavicon");

          case 9:
            _context2.t4 = _context2.sent;
            _context2.t5 = {
              state: _context2.t4
            };

            _context2.t3.set.call(_context2.t3, "toggleAvatarFavicon", _context2.t5);

            _context2.t6 = _classes_page_style_js__WEBPACK_IMPORTED_MODULE_2__["default"];
            _context2.next = 15;
            return _classes_message_api_js__WEBPACK_IMPORTED_MODULE_0__["default"].getStorage("themeColor");

          case 15:
            _context2.t7 = _context2.sent;
            _context2.t8 = {
              color: _context2.t7
            };

            _context2.t6.set.call(_context2.t6, "updateThemeColor", _context2.t8);

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  function InitPage() {
    return _InitPage.apply(this, arguments);
  }

  return InitPage;
})()();
/**
 * Listen for background-script messages
 */

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var type = request.type,
      parameters = request.parameters;

  switch (type) {
    case "toggleThumbnails":
      _classes_page_style_js__WEBPACK_IMPORTED_MODULE_2__["default"].set("toggleThumbnails", {
        state: parameters.state
      });
      break;

    case "toggleAvatarFavicon":
      _classes_page_style_js__WEBPACK_IMPORTED_MODULE_2__["default"].set("toggleAvatarFavicon", {
        state: parameters.state
      });
      break;

    case "themeColorUpdate":
      _classes_page_style_js__WEBPACK_IMPORTED_MODULE_2__["default"].set("updateThemeColor", {
        color: parameters.themeColor
      });
      break;

    case "downloadSubtitles":
      _classes_crp_api_js__WEBPACK_IMPORTED_MODULE_1__["default"].SUBTITLES.then(function (subtitles) {
        downloadFile(subtitles.url, "subtitles_".concat(subtitles.locale, ".").concat(subtitles.format));
      });
      break;

    case "detectOpenings":
      detectOpenings(parameters, sendResponse); // Pass the sendResponse callback as parameter

      break;
  }

  return true; // Tell Chrome that response is sent asynchronously
});

function downloadFile(url, filename) {
  // File can only be downloaded from the background script
  // -> File format seems not working for security reasons
  _classes_message_api_js__WEBPACK_IMPORTED_MODULE_0__["default"].sendToBackground("downloadFile", {
    parameters: {
      url: url,
      filename: filename
    }
  });
}

function detectOpenings(_x2, _x3) {
  return _detectOpenings.apply(this, arguments);
}

function _detectOpenings() {
  _detectOpenings = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(_ref2, sendResponse) {
    var openingDuration, videoDuration, openings;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            openingDuration = _ref2.openingDuration, videoDuration = _ref2.videoDuration;
            _context3.next = 3;
            return _classes_crp_api_js__WEBPACK_IMPORTED_MODULE_1__["default"].OPENINGS(videoDuration, openingDuration);

          case 3:
            openings = _context3.sent;
            sendResponse({
              response: openings
            });

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _detectOpenings.apply(this, arguments);
}
})();

/******/ })()
;