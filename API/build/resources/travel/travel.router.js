"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _travel = require("./travel.controllers");

const router = (0, _express.Router)();
router.get("/", _travel.getTravel);
router.post("/", _travel.addTravel);
router.put("/:_id", _travel.editTravel);
router.delete("/:_id", _travel.deleteTravel);
var _default = router;
exports.default = _default;