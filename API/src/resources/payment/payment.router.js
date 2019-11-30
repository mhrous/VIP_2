import { Router } from "express";
import {
  getPayment,
  editPayment,
  addPayment,
  deletePayment
} from "./payment.controllers";

const router = Router();

router.get("/", getPayment);
router.post("/", addPayment);
router.put("/:_id", editPayment);
router.delete("/:_id", deletePayment);

export default router;
