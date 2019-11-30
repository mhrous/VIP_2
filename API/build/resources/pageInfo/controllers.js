"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onePartner = void 0;

var _user = _interopRequireDefault(require("../user/user.model"));

var _payment = _interopRequireDefault(require("../payment/payment.model"));

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const user = await _user.default.findById(_id).select("name").lean().exec();
    const payment = await _payment.default.find({
      user: _id,
      date: {
        $gt: start,
        $lt: end
      }
    }).select("-user").lean().exec();
    data.user = user;
    data.payment = payment;
    res.json({
      data
    });
  } catch (e) {
    console.error(e);
  }
};

exports.onePartner = onePartner;