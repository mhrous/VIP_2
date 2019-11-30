"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = exports.app = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = require("body-parser");

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _config = _interopRequireDefault(require("./config"));

var _utils = require("./utils");

var _resources = require("./resources");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
exports.app = app;
app.disable("etag");
app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({
  extended: true
}));
app.use((0, _cors.default)());
app.use((0, _morgan.default)("dev"));
app.post("/signin", _utils.signin);
app.use(_utils.protect);
app.use("/api/user", _resources.userRouter);
app.use("/api/car", _resources.carRouter);
app.use("/api/payment", _resources.paymentRouter);
app.use("/api/expenses", _resources.expensesRouter);
app.use("/api/travel", _resources.travelRouter);
app.use("/api/reports", _resources.reportsRouter);
app.use("/api/page", _resources.pageRouter);

const start = async () => {
  try {
    await (0, _utils.connect)();
    app.listen(_config.default.port, () => {
      console.log(`REST API on http://localhost:${_config.default.port}/vip_2`);
    });
  } catch (e) {}
};

exports.start = start;