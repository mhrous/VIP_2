"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomPassword = exports.getFirstOfNextMonth = exports.getFirstOfThisMonth = void 0;

const getFirstOfThisMonth = (m = new Date().getMonth(), y = new Date().getFullYear()) => new Date(y, parseInt(m), 1, 0, 0, 0, 0);

exports.getFirstOfThisMonth = getFirstOfThisMonth;

const getFirstOfNextMonth = (m = new Date().getMonth(), y = new Date().getFullYear()) => new Date(y, parseInt(m) + 1, 1, 0, 0, 0, 0);

exports.getFirstOfNextMonth = getFirstOfNextMonth;

const randomPassword = () => {
  let str = "";

  for (let i = 0; i < 8; i++) {
    str += Math.floor(Math.random() * 9);
  }

  return str;
};

exports.randomPassword = randomPassword;