"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _controllers = require("./controllers");

const router = (0, _express.Router)();
router.get("/one_partner", _controllers.onePartner);
router.get("/one_partner_const", _controllers.onePartnerConst);
router.get("/one_driver", _controllers.oneDriver);
router.get("/one_driver_const", _controllers.oneDriverConst);
router.get("/car_info", _controllers.carInfo);
router.get("/driver_info", _controllers.driverInfo);
var _default = router;
exports.default = _default;