import Payment from "./payment.model";
import { getFirstOfNextMonth, getFirstOfThisMonth } from "../../utils";

export const getPayment = async (req, res) => {
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

    return res.status(200).json({ data: "hi" });
  } catch (e) {
    return res.status(400).end();
  }
};
export const addPayment = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }
    console.log(req.body);
    const { user, amount, date } = req.body;
    if (!user || !amount || !date) {
      return res.status(400).json({ error: "بعض المعلومات ناقصة" });
    }
    const [y, m, d] = date.split("-");
    req.body.date = new Date().setFullYear(y, m - 1, d);
    const data = await Payment.create(req.body);

    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};
export const editPayment = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }
    const { _id } = req.params;

    if (req.body.user) {
      return res.status(400).json({ error: "لا يمكنك تعديل صاحب الدفعة" });
    }

    if (req.body.date) {
      const [y, m, d] = req.body.date.split("-");
      req.body.date = new Date().setFullYear(y, m - 1, d);
    }

    const data = await Payment.findByIdAndUpdate(_id, req.body, {
      new: true
    })
      .lean()
      .exec();

    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};
export const deletePayment = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }
    const { _id } = req.params;
    const data = await Payment.findByIdAndDelete(_id)
      .lean()
      .exec();

    return res.status(200).json({ data: true });
  } catch (e) {
    return res.status(400).end();
  }
};
