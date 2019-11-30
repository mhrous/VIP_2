"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const travelSchema = new _mongoose.default.Schema({
  car: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "car",
    required: true
  },
  driver: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "driver",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  totalTo: {
    type: Number,
    default: 0
  },
  totalBack: {
    type: Number,
    default: 0
  },
  expenses: {
    type: Number,
    default: 0
  },
  repairing: {
    type: [{
      _id: {
        type: Date,
        default: new Date()
      },
      clientName: {
        type: String
      },
      clientPhone: {
        type: String
      },
      value: {
        type: Number,
        default: 0
      },
      partner: {
        type: _mongoose.default.Schema.Types.ObjectId,
        ref: "user",
        required: true
      },
      _type: {
        type: String,
        enum: ["g", "b"]
      },
      from: {
        type: String
      }
    }]
  },
  const: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
});
travelSchema.index({
  date: 1
});

var _default = _mongoose.default.model("travel", travelSchema);

exports.default = _default;