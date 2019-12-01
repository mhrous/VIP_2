import User from "../user/user.model";
import Payment from "../payment/payment.model";
import Expenses from "../expenses/expenses.model";
import Car from "../car/car.model";
import Travel from "../travel/travel.model";
import { getFirstOfThisMonth, getFirstOfNextMonth } from "../../utils";

//partner
export const onePartnerConst = async (req, res) => {
  try {
    let { _id } = req.query;

    const data = {};
    const user = await User.findById(_id)
      .select("name")
      .lean()
      .exec();

    data.user = user;
    res.json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};

export const onePartner = async (req, res) => {
  try {
    let { _id, m, y } = req.query;
    m = parseInt(m) - 1;

    const start = getFirstOfThisMonth(m, y);
    const end = getFirstOfNextMonth(m, y);
    const data = {};

    const payment = await Payment.find({
      user: _id,
      date: { $gt: start, $lt: end }
    })
      .select("-user")
      .lean()
      .exec();

    const expenses = await Expenses.find({
      partner: _id,
      date: { $gt: start, $lt: end }
    })
      .select("driver amount reason date")
      .populate("driver", "name")
      .lean()
      .exec();
    data.expenses = expenses;
    data.payment = payment;
    res.json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};

//driver
export const oneDriverConst = async (req, res) => {
  try {
    let { _id } = req.query;

    const data = {};

    const partners = await User.find({ power: "P", active: true })
      .select("name")
      .lean()
      .exec();
    const car = await Car.findOne({ driver: _id })
      .populate("driver", "name")
      .select("-partners")
      .lean()
      .exec();

    data.partners = partners;
    data.car = car;
    res.json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};

export const oneDriver = async (req, res) => {
  try {
    let { _id, m, y } = req.query;
    m = parseInt(m) - 1;

    const start = getFirstOfThisMonth(m, y);
    const end = getFirstOfNextMonth(m, y);
    const data = {};

    const payment = await Payment.find({
      user: _id,
      date: { $gt: start, $lt: end }
    })
      .select("-user")
      .lean()
      .exec();

    const expenses = await Expenses.find({
      driver: _id,
      date: { $gt: start, $lt: end }
    })
      .populate("partner", "name")
      .lean()
      .exec();

    const travel = await Travel.find({
      driver: _id,
      date: { $gt: start, $lt: end }
    })
      .lean()
      .exec();

    data.travel = travel;
    data.expenses = expenses;
    data.payment = payment;
    res.json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};

export const carInfo = async (req, res) => {
  try {
    let { m, y } = req.query;
    m = parseInt(m) - 1;
    const data = {};

    const start = getFirstOfThisMonth(m, y);
    const end = getFirstOfNextMonth(m, y);
    const cars = await Car.find({})
      .lean()
      .exec();
    cars.forEach(c => {
      data[c._id] = {
        travel: [],
        expenses: [],
        name: c.name,
        number: c.number,
        expensesMax: c.expensesMax
      };
    });
    const travel = await Travel.find({ date: { $gt: start, $lt: end } })
      .populate("car", "-driver -partners")
      .lean()
      .exec();

    travel.forEach(e => {
      const index = e.car._id.toString();
      data[index].travel = [...data[index].travel, e];
    });
    const expenses = await Expenses.find({
      onCar: true,
      date: { $gt: start, $lt: end }
    })
      .select("car amount")
      .lean()
      .exec();

    expenses.forEach(e => {
      const index = e.car;

      data[index].expenses = [...data[index].expenses, e];
    });

    return res.json({ data });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
};


