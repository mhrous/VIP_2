"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCarDriver = exports.deleteCar = exports.editCar = exports.addCar = exports.getCars = void 0;

var _car = _interopRequireDefault(require("./car.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCars = async (req, res) => {
  try {
    const {
      power
    } = req.user;

    if (power != "admin" && power != "s_admin") {
      return res.status(401).end();
    }

    const data = await _car.default.find({}).populate("driver", "name").populate("partners.partner", "name").lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.getCars = getCars;

const addCar = async (req, res) => {
  try {
    const {
      power
    } = req.user;

    if (power != "admin") {
      return res.status(401).end();
    }

    const car = await _car.default.create(req.body);
    const data = await _car.default.findById(car._id).populate("driver", "name").populate("partners.partner", "name").lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.addCar = addCar;

const editCar = async (req, res) => {
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
    const data = await _car.default.findByIdAndUpdate(_id, req.body, {
      new: true
    }).populate("driver", "name").populate("partners.partner", "name").lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.editCar = editCar;

const deleteCar = async (req, res) => {
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
    const data = await _car.default.findByIdAndDelete(_id).lean().exec();
    return res.status(200).json({
      data: true
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.deleteCar = deleteCar;

const getCarDriver = async (req, res) => {
  try {
    if (power != "admin" || power != "S") {
      return res.status(401).end();
    }

    const data = await _car.default.find({}).select("-expensesMax -partners ").populate("driver name").lean().exec();
    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

exports.getCarDriver = getCarDriver;