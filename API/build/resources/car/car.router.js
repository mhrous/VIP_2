"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _car = require("./car.controllers");

const router = (0, _express.Router)();
router.get("/", _car.getCars);
router.post("/", _car.addCar);
router.delete("/:_id", _car.deleteCar);
router.put("/:_id", _car.editCar);
router.get("/driver", _car.getCarDriver);
var _default = router;
exports.default = _default;