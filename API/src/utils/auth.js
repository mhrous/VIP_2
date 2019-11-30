import config from "../config";
import { User } from "../resources";
import jwt from "jsonwebtoken";

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.jwtExp
  });
};

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

export const signin = async (req, res) => {
  if (!req.body.name || !req.body.password) {
    return res
      .status(400)
      .send({ message: "يجب ادخال اسم الامستخدم وكلمة المرور" });
  }

  try {
    const user = await User.findOne({ name: req.body.name })
      .select("name password power")
      .exec();

    if (!user) {
      return res.status(401).send({ message: "اسم المستخدم خاطى" });
    }

    if (req.body.password != user.password) {
      return res.status(401).send({ message: "كلمة المرور خاطئة" });
    }

    const token = newToken(user);
    const power = user.power;
    return res.status(201).send({ data: { token, power } });
  } catch (e) {
    return res.status(500).end();
  }
};

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).end();
  }

  const token = bearer.split("Bearer ")[1].trim();
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).end();
  }

  const user = await User.findById(payload.id)
    .lean()
    .exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};
