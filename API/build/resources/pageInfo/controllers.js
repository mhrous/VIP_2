"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.driverInfo = exports.carInfo = exports.oneDriver = exports.oneDriverConst = exports.onePartner = exports.onePartnerConst = void 0;

var _user = _interopRequireDefault(require("../user/user.model"));

var _payment = _interopRequireDefault(require("../payment/payment.model"));

var _expenses = _interopRequireDefault(require("../expenses/expenses.model"));

var _car = _interopRequireDefault(require("../car/car.model"));

var _travel = _interopRequireDefault(require("../travel/travel.model"));

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
    return res.status(400).end();
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
    const data = {};
    const payment = await _payment.default.find({
      user: _id,
      date: {
        $gt: start,
        $lt: end
      }
    }).select("-user").lean().exec();
    const expenses = await _expenses.default.find({
      partner: _id,
      date: {
        $gt: start,
        $lt: end
      }
    }).select("driver amount reason date").populate("driver", "name").lean().exec();
    data.expenses = expenses;
    data.payment = payment;
    res.json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
}; //driver


exports.onePartner = onePartner;

const oneDriverConst = async (req, res) => {
  try {
    let {
      _id
    } = req.query;
    const data = {};
    const partners = await _user.default.find({
      power: "P",
      active: true
    }).select("name").lean().exec();
    const car = await _car.default.findOne({
      driver: _id
    }).populate("driver", "name").select("-partners").lean().exec();
    data.partners = partners;
    data.car = car;
    res.json({
      data
    });
  } catch (e) {
    return res.status(400).end();
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
    const data = {};
    const payment = await _payment.default.find({
      user: _id,
      date: {
        $gt: start,
        $lt: end
      }
    }).select("-user").lean().exec();
    const expenses = await _expenses.default.find({
      driver: _id,
      date: {
        $gt: start,
        $lt: end
      }
    }).populate("partner", "name").lean().exec();
    const travel = await _travel.default.find({
      driver: _id,
      date: {
        $gt: start,
        $lt: end
      }
    }).lean().exec();
    data.travel = travel;
    data.expenses = expenses;
    data.payment = payment;
    res.json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.oneDriver = oneDriver;

const carInfo = async (req, res) => {
  try {
    let {
      m,
      y
    } = req.query;
    m = parseInt(m) - 1;
    const data = {};
    const start = (0, _utils.getFirstOfThisMonth)(m, y);
    const end = (0, _utils.getFirstOfNextMonth)(m, y);
    const cars = await _car.default.find({}).select("-partners").populate("driver", "name").lean().exec();
    cars.forEach(c => {
      data[c._id] = {
        travel: [],
        expenses: [],
        name: c.name,
        number: c.number,
        expensesMax: c.expensesMax,
        driverName: c.driver.name
      };
    });
    const travel = await _travel.default.find({
      date: {
        $gt: start,
        $lt: end
      }
    }).populate("car", "-driver -partners").lean().exec();
    travel.forEach(e => {
      const index = e.car._id.toString();

      data[index].travel = [...data[index].travel, e];
    });
    const expenses = await _expenses.default.find({
      onCar: true,
      date: {
        $gt: start,
        $lt: end
      }
    }).select("car amount").lean().exec();
    expenses.forEach(e => {
      const index = e.car;
      data[index].expenses = [...data[index].expenses, e];
    });
    return res.json({
      data
    });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
};

exports.carInfo = carInfo;

const driverInfo = async (req, res) => {
  try {
    let {
      m,
      y
    } = req.query;
    m = parseInt(m) - 1;
    const data = {};
    const start = (0, _utils.getFirstOfThisMonth)(m, y);
    const end = (0, _utils.getFirstOfNextMonth)(m, y);
    const driver = await _user.default.find({
      active: true,
      power: "D"
    }).lean().exec();
    driver.forEach(d => {
      data[d._id] = {
        travel: [],
        payment: [],
        expenses: [],
        name: d.name
      };
    });
    const travel = await _travel.default.find({
      date: {
        $gt: start,
        $lt: end
      }
    }).populate("car", "-driver -partners").lean().exec();
    travel.forEach(e => {
      const index = e.driver._id.toString();

      data[index].travel = [...data[index].travel, e];
    });
    const expenses = await _expenses.default.find({
      onDriver: true,
      date: {
        $gt: start,
        $lt: end
      }
    }).select("driver amount").lean().exec();
    expenses.forEach(e => {
      const index = e.driver;
      data[index].expenses = [...data[index].expenses, e];
    });
    const payment = await _payment.default.find({
      date: {
        $gt: start,
        $lt: end
      }
    }).lean().exec();
    payment.forEach(e => {
      const index = e.user;
      if (!data[index]) return;
      data[index].payment = [...data[index].payment, e];
    });
    return res.json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.driverInfo = driverInfo;