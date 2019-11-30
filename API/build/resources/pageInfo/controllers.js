"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onePartner = void 0;

var _user = _interopRequireDefault(require("../user/user.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const onePartner = async (req, res) => {
  try {
    const {
      query
    } = req;
    console.log(query);
    const data = {};
    const user = await _user.default.findById(query._id).select("name").lean().exec();
    data.user = user;
    res.json({
      data
    });
  } catch (e) {
    console.error(e);
  }
};

exports.onePartner = onePartner;