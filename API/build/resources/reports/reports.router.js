"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _reports = require("./reports.controller");

const router = (0, _express.Router)();
router.get("/", (req, res) => res.json({
  data: "ggggg"
}));
router.get("/info/driver", _reports.InfoDriver);
router.get("/info/partner", _reports.InfoPartner);
router.get("/info/car", _reports.InfoCar);
router.get("/account/driver", _reports.accountDriver);
router.get("/account/partner", _reports.accountPartner);
router.get("/account/all/driver", _reports.accountALLDriver);
router.get("/account/all/partner", _reports.accountALLPartner);
var _default = router;
exports.default = _default;