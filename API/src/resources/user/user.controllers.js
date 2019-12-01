import User from "./user.model";
import Car from "../car/car.model";
import { randomPassword } from "../../utils";

export const me = (req, res) => {
  const data = Object.assign({}, req.user);
  delete data.power;
  delete data.password;
  return res.status(200).json({ data });
};

export const updateMe = async (req, res) => {
  try {
    const { power, password } = req.body;
    if (power) {
      return res.status(401).json({ error: "ليس لديك الصلاحية" });
    }
    if (password != req.user.password) {
      return res.status(401).json({ error: "كلمة المرور خاطئة" });
    }

    if (req.body.newpPassword) {
      req.body.password = req.body.newpPassword;
    }

    const data = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    })
      .lean()
      .exec();

    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const { power, _id: userId } = req.user;
    if (power != "admin" || _id == userId) {
      return res.status(401).end();
    }

    await User.findByIdAndUpdate(_id, { active: false });
    return res.status(200).json({ data: true });
  } catch (e) {
    return res.status(400).end();
  }
};

export const updateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const { power } = req.user;
    if (power != "admin" || req.body.power == "admin") {
      return res.status(401).end();
    }

    const user = await User.findOne({ name: req.body.name })
      .lean()
      .exec();
    if (user && user._id.toString() !== _id) {
      return res.status(400).json({ error: "هذا المستخدم موجود" });
    }

    const data = await User.findByIdAndUpdate(_id, req.body, {
      new: true
    })
      .lean()
      .exec();

    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};

export const getAllUser = async (req, res) => {
  try {
    const query = req.query;
    const { power } = req.user;
    let array = ["D"];
    let selectStr = "";
    const findQuery = { power: [] };

    switch (power) {
      case "admin":
        findQuery.power = query.power
          ? [query.power]
          : ["s_admin", "S", "P", "D"];
        break;
      case "s_admin":
        selectStr = "-password -power";

        findQuery.power = query.power ? [query.power] : ["S", "P", "D"];
        break;
      case "S":
        selectStr = "-password -power";
        findQuery.power = ["D"];
        break;
      default:
        return res.status(401).end();
    }
    let data = await User.find({ ...findQuery, active: true })
      .select(selectStr)
      .lean()
      .exec();

    if (query.onCar) {
      const car = await Car.find({})
        .select("driver")
        .lean()
        .exec();

      data = data.filter(e =>
        car.find(c => c.driver.toString() == e._id.toString())
      );
    }
    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};

export const addUser = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin" || req.body.power === "admin") {
      return res.status(401).end();
    }

    const user = await User.findOne({ name: req.body.name })
      .lean()
      .exec();

    if (user) {
      return res.status(400).json({ error: "هذا المستخدم مضاف سابقا" });
    }

    req.body.password = randomPassword();
    const data = await User.create(req.body);

    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

export const getUserName = async (req, res) => {
  try {
    const query = req.query;
    const findQuery = {};
    switch (query.power) {
      case "D":
        findQuery.power = "D";
        break;
      case "P":
        findQuery.power = "P";
        break;
      default:
        findQuery.power = ["D", "P"];
    }

    const data = await User.find({ ...findQuery, active: true })
      .select("name power")
      .lean()
      .exec();

    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};
