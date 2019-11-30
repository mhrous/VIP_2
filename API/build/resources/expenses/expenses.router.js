"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expenses = require("./expenses.controllers");

const router = (0, _express.Router)();
router.get("/", _expenses.getExpenses);
router.post("/", _expenses.addExpenses);
router.put("/:_id", _expenses.editExpenses);
router.delete("/:_id", _expenses.deleteExpenses);
var _default = router;
exports.default = _default;