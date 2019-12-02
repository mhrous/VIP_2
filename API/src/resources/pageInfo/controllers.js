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
      onPartner: true,
      partner: _id,
      date: { $gt: start, $lt: end }
    })
      .select("driver amount reason date")
      .populate("driver", "name")
      .lean()
      .exec();

    const repairing = await Travel.find({
      repairing: { $elemMatch: { partner: _id } },
      date: { $gt: start, $lt: end }
    })
      .populate("driver", "name")
      .select("driver repairing date")
      .lean()
      .exec();

    const account = {};
    const cars = await Car.find({
      partners: { $elemMatch: { partner: _id } }
    })
      .populate("driver", "name")
      .lean()
      .exec();

    cars.forEach(c => {
      account[c._id] = {
        driverName: c.driver.name,
        carName: c.name,
        carNaumber: c.number,
        part: c.partners.find(p => p.partner == _id).value,
        travel: [],
        expenses: []
      };
    });

    const carsId = cars.map(e => e._id);

    const travelCars = await Travel.find({
      car: { $in: carsId },
      date: { $gt: start, $lt: end }
    })
      .lean()
      .exec();
    travelCars.forEach(t => {
      account[t.car].travel.push(t);
    });
    const expensesCars = await Expenses.find({
      onCar: true,
      car: { $in: carsId },
      date: { $gt: start, $lt: end }
    })
      .select("car amount")
      .lean()
      .exec();

    expensesCars.forEach(e => {
      account[e.car].expenses.push(e);
    });

    data.account = account;
    data.repairing = repairing;
    data.expenses = expenses;
    data.payment = payment;
    res.json({ data });
  } catch (e) {
    console.log(e);
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
      .select("-partners")
      .populate("driver", "name")
      .lean()
      .exec();
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

export const driverInfo = async (req, res) => {
  try {
    let { m, y } = req.query;
    m = parseInt(m) - 1;
    const data = {};

    const start = getFirstOfThisMonth(m, y);
    const end = getFirstOfNextMonth(m, y);
    const driver = await User.find({ active: true, power: "D" })
      .lean()
      .exec();
    driver.forEach(d => {
      data[d._id] = {
        travel: [],
        payment: [],
        expenses: [],
        name: d.name
      };
    });

    const travel = await Travel.find({ date: { $gt: start, $lt: end } })
      .populate("car", "-driver -partners")
      .lean()
      .exec();

    travel.forEach(e => {
      const index = e.driver._id.toString();
      data[index].travel = [...data[index].travel, e];
    });

    const expenses = await Expenses.find({
      onDriver: true,
      date: { $gt: start, $lt: end }
    })
      .select("driver amount")
      .lean()
      .exec();

    expenses.forEach(e => {
      const index = e.driver;

      data[index].expenses = [...data[index].expenses, e];
    });
    const payment = await Payment.find({
      date: { $gt: start, $lt: end }
    })
      .lean()
      .exec();

    payment.forEach(e => {
      const index = e.user;
      if (!data[index]) return;
      data[index].payment = [...data[index].payment, e];
    });

    return res.json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};
