import express from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";

import config from "./config";
import { connect, signin, protect } from "./utils";

import {
  userRouter,
  carRouter,
  paymentRouter,
  expensesRouter,
  travelRouter,
  reportsRouter,
  pageRouter
} from "./resources";

export const app = express();

app.disable("etag");

app.use(json());
app.use(
  urlencoded({
    extended: true
  })
);
app.use(cors());
app.use(morgan("dev"));

app.post("/signin", signin);
app.use(protect);
app.use("/api/user", userRouter);
app.use("/api/car", carRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/travel", travelRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/page", pageRouter);

export const start = async () => {
  try {
    await connect();

    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/vip_2`);
    });
  } catch (e) {}
};
