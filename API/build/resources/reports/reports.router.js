"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _reports = require("./reports.controller");

const router = (0, _express.Router)();
router.get("/info/driver", _reports.InfoDriver);
router.get("/info/partner", _reports.InfoPartner);
router.get("/info/car", _reports.InfoCar);
router.get("/account/cars", _reports.accountCar);
router.get("/account/drivers", _reports.accountDriver); // router.get("/account/partners", accountPartner);

router.get("/account/_driver", _reports._driver);
router.get("/account/_partner", _reports._partner);
var _default = router;
exports.default = _default;