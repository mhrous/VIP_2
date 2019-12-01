"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteExpenses = exports.editExpenses = exports.addExpenses = exports.getExpenses = void 0;

var _expenses = _interopRequireDefault(require("./expenses.model"));

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getExpenses = async (req, res) => {
  try {
    // const { power } = req.user;
    // let start, end, user, car;
    // switch (power) {
    //   case "P":
    //   case "S":
    //     return res.status(401).end();
    //   case "D":
    //     start = getFirstOfThisMonth();
    //     end = getFirstOfNextMonth();
    //     user = req.user._id;
    //     break;
    //   case "admin":
    //   case "s_admin":
    //     const query = req.query;
    //     user = query.user;
    //     car = query.car;
    //     start = getFirstOfThisMonth(query.m - 1, query.y);
    //     end = getFirstOfNextMonth(query.m - 1, query.y);
    // }
    // let obj = {};
    // if (user) obj.user = user;
    // if (car) obj.car = car;
    // const data = await Expenses.find({
    //   ...obj,
    //   date: { $lte: end, $gte: start }
    // })
    //   .lean()
    //   .exec();
    return res.status(200).json({
      data: "hi"
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.getExpenses = getExpenses;

const addExpenses = async (req, res) => {
  try {
    const {
      power
    } = req.user;

    if (power != "admin") {
      return res.status(401).end();
    }

    const {
      driver,
      car,
      amount,
      date
    } = req.body;
    console.log(req.body);

    if (!driver || !amount || !date || !car) {
      return res.status(400).json({
        error: "بعض المعلومات ناقصة"
      });
    }

    const [y, m, d] = date.split("-");
    req.body.date = new Date().setFullYear(y, m - 1, d);
    const data1 = await _expenses.default.create(req.body);
    const data = await _expenses.default.findById(data1._id).populate("partner", "name").lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
};

exports.addExpenses = addExpenses;

const editExpenses = async (req, res) => {
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
    console.log(req.body);

    if (req.body.driver || req.body.car) {
      return res.status(400).json({
        error: "لا يمكنك  تعديل هذا المعلمومات "
      });
    }

    if (req.body.date) {
      const [y, m, d] = req.body.date.split("-");
      req.body.date = new Date().setFullYear(y, m - 1, d);
    }

    const data = await _expenses.default.findByIdAndUpdate(_id, req.body, {
      new: true
    }).populate("partner", "name").lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
};

exports.editExpenses = editExpenses;

const deleteExpenses = async (req, res) => {
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
    const data = await _expenses.default.findByIdAndDelete(_id).lean().exec();
    return res.status(200).json({
      data: true
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.deleteExpenses = deleteExpenses;