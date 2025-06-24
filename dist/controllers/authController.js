"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var User = require("../models/user");
var SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";

// ✅ User Registration
exports.register = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$body, email, password, existingUser, hashedPassword, newUser, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          console.log("📥 Registration Request Body:", req.body);
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          if (!(!email || !password)) {
            _context.n = 1;
            break;
          }
          return _context.a(2, res.status(400).json({
            message: "Email and password are required"
          }));
        case 1:
          _context.p = 1;
          _context.n = 2;
          return User.findOne({
            email: email.toLowerCase().trim()
          });
        case 2:
          existingUser = _context.v;
          if (!existingUser) {
            _context.n = 3;
            break;
          }
          return _context.a(2, res.status(400).json({
            message: "User already exists"
          }));
        case 3:
          _context.n = 4;
          return bcrypt.hash(password, 10);
        case 4:
          hashedPassword = _context.v;
          newUser = new User({
            email: email.toLowerCase().trim(),
            password: hashedPassword
          });
          _context.n = 5;
          return newUser.save();
        case 5:
          res.status(201).json({
            message: "User registered successfully"
          });
          _context.n = 7;
          break;
        case 6:
          _context.p = 6;
          _t = _context.v;
          console.error("❌ Registration Error:", _t);
          res.status(500).json({
            message: "Failed to register user"
          });
        case 7:
          return _context.a(2);
      }
    }, _callee, null, [[1, 6]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// ✅ User Login
exports.login = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$body2, email, password, user, passwordMatch, token, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          console.log("🟢 Login Request Received:", req.body);
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          if (!(!email || !password)) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, res.status(400).json({
            message: "Email and password are required"
          }));
        case 1:
          _context2.p = 1;
          _context2.n = 2;
          return User.findOne({
            email: email.toLowerCase().trim()
          });
        case 2:
          user = _context2.v;
          if (user) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, res.status(400).json({
            message: "Invalid credentials"
          }));
        case 3:
          _context2.n = 4;
          return bcrypt.compare(password, user.password);
        case 4:
          passwordMatch = _context2.v;
          if (passwordMatch) {
            _context2.n = 5;
            break;
          }
          return _context2.a(2, res.status(400).json({
            message: "Invalid credentials"
          }));
        case 5:
          token = jwt.sign({
            userId: user._id,
            email: user.email
          }, SECRET_KEY, {
            expiresIn: "1h"
          });
          res.json({
            message: "Login successful",
            token: token
          });
          _context2.n = 7;
          break;
        case 6:
          _context2.p = 6;
          _t2 = _context2.v;
          console.error("❌ Login Error:", _t2);
          res.status(500).json({
            message: "Failed to login"
          });
        case 7:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 6]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// ✅ Forgot Password (Dummy Implementation)
exports.forgotPassword = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          return _context3.a(2, res.status(501).json({
            message: "Forgot password feature not implemented yet"
          }));
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// ✅ Reset Password (Dummy Implementation)
exports.resetPassword = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          return _context4.a(2, res.status(501).json({
            message: "Reset password feature not implemented yet"
          }));
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();