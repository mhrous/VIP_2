import User from "../user/user.model";
import Payment from "../payment/payment.model";
import { getFirstOfThisMonth, getFirstOfNextMonth } from "../../utils";
export const onePartner = async (req, res) => {
  try {
    let { _id, m, y } = req.query;
    m = parseInt(m) - 1;

    const start = getFirstOfThisMonth(m, y);
    const end = getFirstOfNextMonth(m, y);
    console.log(start.getDate(), "\n", end.getDate());
    const data = {};
    const user = await User.findById(_id)
      .select("name")
      .lean()
      .exec();

    const payment = await Payment.find({
      user: _id,
      date: { $gt: start, $lt: end }
    })
      .select("-user")
      .lean()
      .exec();

    data.user = user;
    data.payment = payment;
    res.json({ data });
  } catch (e) {
    console.error(e);
  }
};
