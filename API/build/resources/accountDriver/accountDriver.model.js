"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const accountDriverSchema = new _mongoose.default.Schema({
  partner: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  numberReceipts: {
    type: Number,
    default: 0
  },
  totalReceipts: {
    type: Number,
    default: 0
  },
  externalRequests: {
    type: Number,
    default: 0
  },
  totalPayment: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    required: true
  }
});
const updateOrInsert = {
  upsert: true,
  new: true,
  setDefaultsOnInsert: true
};

accountDriverSchema.static.addTravel = async travel => {};

accountDriverSchema.static.removeTravel = async travel => {};

accountDriverSchema.static.addPayment = async payment => {};

accountDriverSchema.static.removePayment = async payment => {};

accountDriverSchema.static.addExpenses = async expenses => {};

accountDriverSchema.static.removeExpenses = async expenses => {};

var _default = _mongoose.default.model("accountDriver", accountDriverSchema);

exports.default = _default;