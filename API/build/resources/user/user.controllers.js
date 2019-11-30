"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserName = exports.addUser = exports.getAllUser = exports.updateUser = exports.deleteUser = exports.updateMe = exports.me = void 0;

var _user = _interopRequireDefault(require("./user.model"));

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const me = (req, res) => {
  const data = Object.assign({}, req.user);
  delete data.power;
  delete data.password;
  return res.status(200).json({
    data
  });
};

exports.me = me;

const updateMe = async (req, res) => {
  try {
    const {
      power,
      password
    } = req.body;

    if (power) {
      return res.status(401).json({
        error: "ليس لديك الصلاحية"
      });
    }

    if (password != req.user.password) {
      return res.status(401).json({
        error: "كلمة المرور خاطئة"
      });
    }

    if (req.body.newpPassword) {
      req.body.password = req.body.newpPassword;
    }

    const data = await _user.default.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    }).lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.updateMe = updateMe;

const deleteUser = async (req, res) => {
  try {
    const {
      _id
    } = req.params;
    const {
      power,
      _id: userId
    } = req.user;

    if (power != "admin" || _id == userId) {
      return res.status(401).end();
    }

    await _user.default.findByIdAndUpdate(_id, {
      active: false
    });
    return res.status(200).json({
      data: true
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.deleteUser = deleteUser;

const updateUser = async (req, res) => {
  try {
    const {
      _id
    } = req.params;
    const {
      power
    } = req.user;

    if (power != "admin" || req.body.power == "admin") {
      return res.status(401).end();
    }

    const user = await _user.default.findOne({
      name: req.body.name
    }).lean().exec();

    if (user && user._id.toString() !== _id) {
      return res.status(400).json({
        error: "هذا المستخدم موجود"
      });
    }

    const data = await _user.default.findByIdAndUpdate(_id, req.body, {
      new: true
    }).lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.updateUser = updateUser;

const getAllUser = async (req, res) => {
  try {
    const query = req.query;
    const {
      power
    } = req.user;
    let array = ["D"];
    let selectStr = "";
    const findQuery = {
      power: []
    };

    switch (power) {
      case "admin":
        findQuery.power = query.power ? [query.power] : ["s_admin", "S", "P", "D"];
        break;

      case "s_admin":
        selectStr = "-password -power";
        findQuery.power = query.power ? [query.power] : ["S", "P", "D"];
        break;

      case "S":
        selectStr = "-password -power";
        findQuery.power = ["D"];
        break;

      default:
        return res.status(401).end();
    }

    const data = await _user.default.find(_objectSpread({}, findQuery, {
      active: true
    })).select(selectStr).lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.getAllUser = getAllUser;

const addUser = async (req, res) => {
  try {
    const {
      power
    } = req.user;

    if (power != "admin" || req.body.power === "admin") {
      return res.status(401).end();
    }

    const user = await _user.default.findOne({
      name: req.body.name
    }).lean().exec();

    if (user) {
      return res.status(400).json({
        error: "هذا المستخدم مضاف سابقا"
      });
    }

    req.body.password = (0, _utils.randomPassword)();
    const data = await _user.default.create(req.body);
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.addUser = addUser;

const getUserName = async (req, res) => {
  try {
    const query = req.query;
    const findQuery = {};

    switch (query.power) {
      case "D":
        findQuery.power = "D";
        break;

      case "P":
        findQuery.power = "P";
        break;

      default:
        findQuery.power = ["D", "P"];
    }

    console.log(findQuery);
    const data = await _user.default.find(_objectSpread({}, findQuery, {
      active: true
    })).select("name power").lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.getUserName = getUserName;