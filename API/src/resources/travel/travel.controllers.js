import Travel from "./travel.model";
import { getFirstOfNextMonth, getFirstOfThisMonth } from "../../utils";

export const getTravel = async (req, res) => {
  try {
    // const { power, _id: idUser } = req.user;
    // let start = getFirstOfThisMonth();
    // let end = getFirstOfNextMonth();
    // let queryFind = {};
    // switch (power) {
    //   case "S":
    //     queryFind = { createdBy: idUser, date: { $lte: end, $gte: start } };
    //     break;
    //   case "D":
    //     user = req.user._id;
    //     queryFind = { driver: idUser, date: { $lte: end, $gte: start } };

    //     break;
    //   case "admin":
    //   case "s_admin":
    //     let query = req.query;

    //     const start = getFirstOfThisMonth(query.m - 1, query.y);
    //     end = getFirstOfNextMonth(query.m - 1, query.y);
    //     queryFind = { date: { $lte: end, $gte: start } };
    //     if (query.driver) {
    //       queryFind.driver = driver;
    //     }
    // }

    // const data = await Travel.find({ user, date: { $lte: end, $gte: start } })
    //   .lean()
    //   .exec();

    return res.status(200).json({ data: "hi" });
  } catch (e) {
    return res.status(400).end();
  }
};
export const addTravel = async (req, res) => {
  try {
    const { power, _id: idUser } = req.user;

    const start = getFirstOfThisMonth().getTime();
    const end = getFirstOfNextMonth().getTime();
    if (
      power != "admin" &&
      !(
        power == "S" &&
        req.body.date.getTime() >= start &&
        req.body.date.getTime() < end
      ) &&
      !(
        power == "D" &&
        req.body.driver == idUser &&
        req.body.date.getTime() >= start &&
        req.body.date.getTime() < end
      )
    ) {
      return res.status(401).end();
    }
    req.body.createdBy = idUser;
    req.body.const = power == "admin" ? true : false;
    const [y, m, d] = req.body.date.split("-");
    req.body.date = new Date().setFullYear(y, m - 1, d);

    const data = await Travel.create(req.body);

    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};
export const editTravel = async (req, res) => {
  try {
    const { power, _id: idUser } = req.user;
    const { _id } = req.params;
    const start = getFirstOfThisMonth().getTime();
    const end = getFirstOfNextMonth().getTime();

    const travel = await Travel.findById(_id)
      .lean()
      .exec();

    if (
      power != "admin" &&
      !(
        travel.createdBy == idUser &&
        travel.const == false &&
        travel.date.getTime() >= start &&
        travel.date.getTime() < end
      ) &&
      travel.const != req.body.const
    ) {
      return res.status(401).end();
    }
    if (req.body.date) {
      const [y, m, d] = req.body.date.split("-");
      req.body.date = new Date().setFullYear(y, m - 1, d);
    }
    req.body.repairing = req.body.repairing || [];
    const data = await Travel.findByIdAndUpdate(_id, req.body, {
      new: true
    })

      .lean()
      .exec();

    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};
export const deleteTravel = async (req, res) => {
  try {
    const { power, _id: idUser } = req.user;
    const { _id } = req.params;
    const start = getFirstOfThisMonth().getTime();
    const end = getFirstOfNextMonth().getTime();

    const travel = await Travel.findById(_id)
      .lean()
      .exec();

    if (
      power != "admin" &&
      !(
        travel.createdBy == idUser &&
        travel.const == false &&
        travel.date.getTime() >= start &&
        travel.date.getTime() < end
      )
    ) {
      return res.status(401).end();
    }

    const data = await Travel.findByIdAndDelete(_id)
      .lean()
      .exec();

    return res.status(200).json({ data: true });
  } catch (e) {
    return res.status(400).end();
  }
};
