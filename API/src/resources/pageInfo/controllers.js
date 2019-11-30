import User from "../user/user.model";
import Payment from "../payment/payment.model";
import { getFirstOfThisMonth, getFirstOfNextMonth } from "../../utils";

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
    console.error(e);
  }
};

export const onePartner = async (req, res) => {
  try {
    let { _id, m, y } = req.query;
    m = parseInt(m) - 1;

    const start = getFirstOfThisMonth(m, y);
    const end = getFirstOfNextMonth(m, y);
    console.log(start.getDate(), "\n", end.getDate());
    const data = {};

    const payment = await Payment.find({
      user: _id,
      date: { $gt: start, $lt: end }
    })
      .select("-user")
      .lean()
      .exec();

    data.payment = payment;
    res.json({ data });
  } catch (e) {
    console.error(e);
  }
};