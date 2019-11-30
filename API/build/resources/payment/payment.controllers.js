"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePayment = exports.editPayment = exports.addPayment = exports.getPayment = void 0;

var _payment = _interopRequireDefault(require("./payment.model"));

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getPayment = async (req, res) => {
  try {
    // const { power } = req.user;
    // let start, end, user;
    // switch (power) {
    //   case "S":
    //     return res.status(401).end();
    //   case "P":
    //   case "D":
    //     start = getFirstOfThisMonth();
    //     end = getFirstOfNextMonth();
    //     user = req.user._id;
    //     break;
    //   case "admin":
    //   case "s_admin":
    //     const query = req.query;
    //     user = query.user;
    //     start = getFirstOfThisMonth(query.m - 1, query.y);
    //     end = getFirstOfNextMonth(query.m - 1, query.y);
    // }
    // const data = await Payment.find({ user, date: { $lte: end, $gte: start } })
    //   .lean()
    //   .exec();
    return res.status(200).json({
      data: "hi"
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.getPayment = getPayment;

const addPayment = async (req, res) => {
  try {
    const {
      power
    } = req.user;

    if (power != "admin") {
      return res.status(401).end();
    }

    const {
      user,
      amount,
      date
    } = req.body;

    if (!user || !amount || !date) {
      return res.status(400).json({
        error: "بعض المعلومات ناقصة"
      });
    }

    const {
      y,
      m,
      d
    } = date;
    req.body.date = new Date().setFullYear(y, m - 1, d);
    const data = await _payment.default.create(req.body);
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.addPayment = addPayment;

const editPayment = async (req, res) => {
  try {
    const {
      power
    } = req.user;

    if (power != "admin") {
      return res.status(401).end();
    }

    const {
      _id
    } = req.params;

    if (req.body.user) {
      return res.status(400).json({
        error: "لا يمكنك تعديل صاحب الدفعة"
      });
    }

    if (req.body.date) {
      const {
        y,
        m,
        d
      } = req.body.date;
      req.body.date = new Date().setFullYear(y, m - 1, d);
    }

    const data = await _payment.default.findByIdAndUpdate(_id, req.body, {
      new: true
    }).lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.editPayment = editPayment;

const deletePayment = async (req, res) => {
  try {
    const {
      power
    } = req.user;

    if (power != "admin") {
      return res.status(401).end();
    }

    const {
      _id
    } = req.params;
    const data = await _payment.default.findByIdAndDelete(_id).lean().exec();
    return res.status(200).json({
      data: true
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.deletePayment = deletePayment;