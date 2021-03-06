"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _user = require("./user.controllers");

const router = (0, _express.Router)();
router.get("/me", _user.me);
router.put("/me", _user.updateMe);
router.get("/name", _user.getUserName);
router.get("/", _user.getAllUser);
router.post("/", _user.addUser);
router.delete("/:_id", _user.deleteUser);
router.put("/:_id", _user.updateUser);
var _default = router;
exports.default = _default;