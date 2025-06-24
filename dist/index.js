"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
require("dotenv").config();
var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var rateLimit = require("express-rate-limit");
var User = require("./models/user");
var app = express();
var SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";

// ✅ Middleware
app.use(express.json());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect("mongodb://localhost:27017/your-database", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("✅ Connected to MongoDB");
})["catch"](function (err) {
  return console.error("❌ MongoDB Connection Error:", err);
});

// ✅ Root Route (Fixes Cannot GET /)
app.get("/", function (req, res) {
  res.send("🚀 Server is running!");
});

// ✅ Rate Limiter
var loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, try again later."
});

// ✅ JWT Authentication Middleware
var authenticateToken = function authenticateToken(req, res, next) {
  var _req$header;
  var token = (_req$header = req.header("Authorization")) === null || _req$header === void 0 ? void 0 : _req$header.split(" ")[1];
  if (!token) return res.status(401).json({
    message: "Unauthorized"
  });
  jwt.verify(token, SECRET_KEY, function (err, user) {
    if (err) return res.status(403).json({
      message: "Invalid token"
    });
    req.user = user;
    next();
  });
};

// ✅ Register API
app.post("/api/auth/register", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$body, name, email, password, existingUser, hashedPassword, newUser, token, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          console.log("📥 Register Request Received:", req.body); // Debugging
          _context.p = 1;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;
          if (!(!name || !email || !password)) {
            _context.n = 2;
            break;
          }
          console.log("⚠️ Missing fields:", {
            name: name,
            email: email,
            password: password
          });
          return _context.a(2, res.status(400).json({
            message: "All fields are required."
          }));
        case 2:
          console.log("🔍 Checking if user already exists...");
          _context.n = 3;
          return User.findOne({
            email: email.toLowerCase().trim()
          });
        case 3:
          existingUser = _context.v;
          if (!existingUser) {
            _context.n = 4;
            break;
          }
          console.log("⚠️ User already exists:", existingUser.email);
          return _context.a(2, res.status(400).json({
            message: "User already exists."
          }));
        case 4:
          console.log("🔐 Hashing password...");
          _context.n = 5;
          return bcrypt.hash(password, 10);
        case 5:
          hashedPassword = _context.v;
          console.log("🆕 Creating new user...");
          newUser = new User({
            name: name,
            email: email.toLowerCase().trim(),
            password: hashedPassword
          });
          _context.n = 6;
          return newUser.save();
        case 6:
          console.log("✅ User saved successfully!");
          token = jwt.sign({
            userId: newUser._id,
            email: newUser.email
          }, SECRET_KEY, {
            expiresIn: "1h"
          });
          res.status(201).json({
            message: "User registered successfully!",
            token: token
          });
          _context.n = 8;
          break;
        case 7:
          _context.p = 7;
          _t = _context.v;
          console.error("❌ Register Error:", _t);
          res.status(500).json({
            message: "Internal server error."
          });
        case 8:
          return _context.a(2);
      }
    }, _callee, null, [[1, 7]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// ✅ Login API
app.post("/api/auth/login", loginLimiter, /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$body2, email, password, user, passwordMatch, token, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          console.log("📥 Login Request Body:", req.body); // Debugging
          _context2.p = 1;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          if (!(!email || !password)) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2, res.status(400).json({
            message: "Email and password are required."
          }));
        case 2:
          _context2.n = 3;
          return User.findOne({
            email: email.toLowerCase().trim()
          });
        case 3:
          user = _context2.v;
          if (user) {
            _context2.n = 4;
            break;
          }
          return _context2.a(2, res.status(400).json({
            message: "Invalid credentials."
          }));
        case 4:
          _context2.n = 5;
          return bcrypt.compare(password, user.password);
        case 5:
          passwordMatch = _context2.v;
          if (passwordMatch) {
            _context2.n = 6;
            break;
          }
          return _context2.a(2, res.status(400).json({
            message: "Invalid credentials."
          }));
        case 6:
          token = jwt.sign({
            userId: user._id,
            email: user.email
          }, SECRET_KEY, {
            expiresIn: "1h"
          });
          res.json({
            message: "Login successful!",
            token: token
          });
          _context2.n = 8;
          break;
        case 7:
          _context2.p = 7;
          _t2 = _context2.v;
          console.error("❌ Login Error:", _t2);
          res.status(500).json({
            message: "Internal server error."
          });
        case 8:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 7]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

// ✅ Logout API
app.post("/api/auth/logout", function (req, res) {
  try {
    res.clearCookie("token"); // If using cookies
    res.json({
      message: "Logout successful!"
    });
  } catch (error) {
    console.error("❌ Logout Error:", error);
    res.status(500).json({
      message: "Internal server error."
    });
  }
});

// ✅ Check Session API
app.get("/api/auth/check-session", authenticateToken, function (req, res) {
  res.json({
    message: "Session active",
    user: req.user
  });
});

// ✅ Start Server
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("\uD83D\uDE80 Server running on http://localhost:".concat(PORT));
});