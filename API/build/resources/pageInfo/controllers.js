"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.oneDriver = exports.oneDriverConst = exports.onePartner = exports.onePartnerConst = void 0;

var _user = _interopRequireDefault(require("../user/user.model"));

var _payment = _interopRequireDefault(require("../payment/payment.model"));

var _car = _interopRequireDefault(require("../car/car.model"));

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//partner
const onePartnerConst = async (req, res) => {
  try {
    let {
      _id
    } = req.query;
    const data = {};
    const user = await _user.default.findById(_id).select("name").lean().exec();
    data.user = user;
    res.json({
      data
    });
  } catch (e) {
    console.error(e);
  }
};

exports.onePartnerConst = onePartnerConst;

const onePartner = async (req, res) => {
  try {
    let {
      _id,
      m,
      y
    } = req.query;
    m = parseInt(m) - 1;
    const start = (0, _utils.getFirstOfThisMonth)(m, y);
    const end = (0, _utils.getFirstOfNextMonth)(m, y);
    console.log(start.getDate(), "\n", end.getDate());
    const data = {};
    const payment = await _payment.default.find({
      user: _id,
      date: {
        $gt: start,
        $lt: end
      }
    }).select("-user").lean().exec();
    data.payment = payment;
    res.json({
      data
    });
  } catch (e) {
    console.error(e);
  }
}; //driver


exports.onePartner = onePartner;

const oneDriverConst = async (req, res) => {
  try {
    let {
      _id
    } = req.query;
    const data = {};
    const user = await _user.default.findById(_id).select("name").lean().exec();
    const car = await _car.default.findOne({
      driver: _id
    }).select("-partners -driver").lean().exec();
    data.user = user;
    data.car = car;
    res.json({
      data
    });
  } catch (e) {
    console.error(e);
  }
};

exports.oneDriverConst = oneDriverConst;

const oneDriver = async (req, res) => {
  try {
    let {
      _id,
      m,
      y
    } = req.query;
    m = parseInt(m) - 1;
    const start = (0, _utils.getFirstOfThisMonth)(m, y);
    const end = (0, _utils.getFirstOfNextMonth)(m, y);
    console.log(start.getDate(), "\n", end.getDate());
    const data = {};
    const payment = await _payment.default.find({
      user: _id,
      date: {
        $gt: start,
        $lt: end
      }
    }).select("-user").lean().exec();
    data.payment = payment;
    res.json({
      data
    });
  } catch (e) {
    console.error(e);
  }
};

exports.oneDriver = oneDriver;