"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _payment = require("./payment.controllers");

const router = (0, _express.Router)();
router.get("/", _payment.getPayment);
router.post("/", _payment.addPayment);
router.put("/:_id", _payment.editPayment);
router.delete("/:_id", _payment.deletePayment);
var _default = router;
exports.default = _default;