import { Router } from "express";
import {
  getExpenses,
  editExpenses,
  addExpenses,
  deleteExpenses
} from "./expenses.controllers";

const router = Router();

router.get("/", getExpenses);
router.post("/", addExpenses);
router.put("/:_id", editExpenses);
router.delete("/:_id", deleteExpenses);

export default router;
