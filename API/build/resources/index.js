"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "User", {
  enumerable: true,
  get: function () {
    return _user.default;
  }
});
Object.defineProperty(exports, "userRouter", {
  enumerable: true,
  get: function () {
    return _user2.default;
  }
});
Object.defineProperty(exports, "carRouter", {
  enumerable: true,
  get: function () {
    return _car.default;
  }
});
Object.defineProperty(exports, "paymentRouter", {
  enumerable: true,
  get: function () {
    return _payment.default;
  }
});
Object.defineProperty(exports, "expensesRouter", {
  enumerable: true,
  get: function () {
    return _expenses.default;
  }
});
Object.defineProperty(exports, "travelRouter", {
  enumerable: true,
  get: function () {
    return _travel.default;
  }
});
Object.defineProperty(exports, "reportsRouter", {
  enumerable: true,
  get: function () {
    return _reports.default;
  }
});
Object.defineProperty(exports, "pageRouter", {
  enumerable: true,
  get: function () {
    return _page.default;
  }
});

var _user = _interopRequireDefault(require("./user/user.model"));

var _user2 = _interopRequireDefault(require("./user/user.router"));

var _car = _interopRequireDefault(require("./car/car.router"));

var _payment = _interopRequireDefault(require("./payment/payment.router"));

var _expenses = _interopRequireDefault(require("./expenses/expenses.router"));

var _travel = _interopRequireDefault(require("./travel/travel.router"));

var _reports = _interopRequireDefault(require("./reports/reports.router"));

var _page = _interopRequireDefault(require("./pageInfo/page.router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }