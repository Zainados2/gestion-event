"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/has-flag";
exports.ids = ["vendor-chunks/has-flag"];
exports.modules = {

/***/ "(ssr)/./node_modules/has-flag/index.js":
/*!****************************************!*\
  !*** ./node_modules/has-flag/index.js ***!
  \****************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = function (flag) {\n  var argv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.argv;\n  var prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--';\n  var position = argv.indexOf(prefix + flag);\n  var terminatorPosition = argv.indexOf('--');\n  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaGFzLWZsYWcvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWJBLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHLFVBQUNDLElBQUksRUFBMEI7RUFBQSxJQUF4QkMsSUFBSSxHQUFBQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBR0csT0FBTyxDQUFDSixJQUFJO0VBQzFDLElBQU1LLE1BQU0sR0FBR04sSUFBSSxDQUFDTyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFJUCxJQUFJLENBQUNHLE1BQU0sS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUs7RUFDM0UsSUFBTUssUUFBUSxHQUFHUCxJQUFJLENBQUNRLE9BQU8sQ0FBQ0gsTUFBTSxHQUFHTixJQUFJLENBQUM7RUFDNUMsSUFBTVUsa0JBQWtCLEdBQUdULElBQUksQ0FBQ1EsT0FBTyxDQUFDLElBQUksQ0FBQztFQUM3QyxPQUFPRCxRQUFRLEtBQUssQ0FBQyxDQUFDLEtBQUtFLGtCQUFrQixLQUFLLENBQUMsQ0FBQyxJQUFJRixRQUFRLEdBQUdFLGtCQUFrQixDQUFDO0FBQ3ZGLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHVkaW9waG90by8uL25vZGVfbW9kdWxlcy9oYXMtZmxhZy9pbmRleC5qcz9mM2Y2Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoZmxhZywgYXJndiA9IHByb2Nlc3MuYXJndikgPT4ge1xuXHRjb25zdCBwcmVmaXggPSBmbGFnLnN0YXJ0c1dpdGgoJy0nKSA/ICcnIDogKGZsYWcubGVuZ3RoID09PSAxID8gJy0nIDogJy0tJyk7XG5cdGNvbnN0IHBvc2l0aW9uID0gYXJndi5pbmRleE9mKHByZWZpeCArIGZsYWcpO1xuXHRjb25zdCB0ZXJtaW5hdG9yUG9zaXRpb24gPSBhcmd2LmluZGV4T2YoJy0tJyk7XG5cdHJldHVybiBwb3NpdGlvbiAhPT0gLTEgJiYgKHRlcm1pbmF0b3JQb3NpdGlvbiA9PT0gLTEgfHwgcG9zaXRpb24gPCB0ZXJtaW5hdG9yUG9zaXRpb24pO1xufTtcbiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiZmxhZyIsImFyZ3YiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJwcm9jZXNzIiwicHJlZml4Iiwic3RhcnRzV2l0aCIsInBvc2l0aW9uIiwiaW5kZXhPZiIsInRlcm1pbmF0b3JQb3NpdGlvbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/has-flag/index.js\n");

/***/ })

};
;