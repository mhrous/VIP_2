import { Router } from "express";
import {
  getCarDriver,
  getCars,
  editCar,
  deleteCar,
  addCar
} from "./car.controllers";

const router = Router();

router.get("/", getCars);
router.post("/", addCar);
router.delete("/:_id", deleteCar);
router.put("/:_id", editCar);
router.get("/driver", getCarDriver);

export default router;
