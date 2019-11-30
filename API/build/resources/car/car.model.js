"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const carSchema = new _mongoose.default.Schema({
  number: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  expensesMax: {
    type: Number,
    require: true
  },
  driver: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  partners: {
    type: [{
      _id: {
        type: Date,
        default: new Date()
      },
      partner: {
        type: _mongoose.default.Schema.Types.ObjectId,
        ref: "user",
        required: true
      },
      value: {
        type: Number,
        max: 24,
        min: 0,
        require: true
      }
    }]
  }
});

var _default = _mongoose.default.model("car", carSchema);

exports.default = _default;