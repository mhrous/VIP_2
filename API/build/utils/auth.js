"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protect = exports.signin = exports.verifyToken = exports.newToken = void 0;

var _config = _interopRequireDefault(require("../config"));

var _resources = require("../resources");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const newToken = user => {
  return _jsonwebtoken.default.sign({
    id: user.id
  }, _config.default.secrets.jwt, {
    expiresIn: _config.default.jwtExp
  });
};

exports.newToken = newToken;

const verifyToken = token => new Promise((resolve, reject) => {
  _jsonwebtoken.default.verify(token, _config.default.secrets.jwt, (err, payload) => {
    if (err) return reject(err);
    resolve(payload);
  });
});

exports.verifyToken = verifyToken;

const signin = async (req, res) => {
  if (!req.body.name || !req.body.password) {
    return res.status(400).send({
      message: "يجب ادخال اسم الامستخدم وكلمة المرور"
    });
  }

  try {
    const user = await _resources.User.findOne({
      name: req.body.name
    }).select("name password power").exec();

    if (!user) {
      return res.status(401).send({
        message: "اسم المستخدم خاطى"
      });
    }

    if (req.body.password != user.password) {
      return res.status(401).send({
        message: "كلمة المرور خاطئة"
      });
    }

    const token = newToken(user);
    const power = user.power;
    return res.status(201).send({
      data: {
        token,
        power
      }
    });
  } catch (e) {
    return res.status(500).end();
  }
};

exports.signin = signin;

const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).end();
  }

  const token = bearer.split("Bearer ")[1].trim();
  let payload;

  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).end();
  }

  const user = await _resources.User.findById(payload.id).lean().exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};

exports.protect = protect;