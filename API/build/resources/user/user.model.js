"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: [{
      phoneType: String,
      value: String,
      _id: {
        type: Date,
        default: new Date()
      }
    }]
  },
  address: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  power: {
    type: String,
    enum: ["admin", "s_admin", "S", "D", "P"]
  }
});

var _default = _mongoose.default.model("user", userSchema);

exports.default = _default;