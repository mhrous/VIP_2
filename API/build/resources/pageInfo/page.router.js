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
var _default = router;
exports.default = _default;