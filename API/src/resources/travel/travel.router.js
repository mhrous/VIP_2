import { Router } from "express";
import {
  getTravel,
  editTravel,
  addTravel,
  deleteTravel
} from "./travel.controllers";

const router = Router();

router.get("/", getTravel);
router.post("/", addTravel);
router.put("/:_id", editTravel);
router.delete("/:_id", deleteTravel);

export default router;
