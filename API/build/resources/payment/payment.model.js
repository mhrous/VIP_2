"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const paymentSchema = new _mongoose.default.Schema({
  user: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  _type: {
    type: String,
    enum: ["D", "P"],
    default: "D"
  }
});
paymentSchema.index({
  date: 1
});

var _default = _mongoose.default.model("payment", paymentSchema);

exports.default = _default;