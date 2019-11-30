import { Router } from "express";
import {
  me,
  updateMe,
  getAllUser,
  addUser,
  deleteUser,
  updateUser,
  getUserName
} from "./user.controllers";

const router = Router();

router.get("/me", me);
router.put("/me", updateMe);

router.get("/name", getUserName);

router.get("/", getAllUser);
router.post("/", addUser);
router.delete("/:_id", deleteUser);
router.put("/:_id", updateUser);

export default router;
