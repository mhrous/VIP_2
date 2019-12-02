import { Router } from "express";
import {
  InfoCar,
  InfoDriver,
  InfoPartner,
  // accountDriver,
  // accountPartner,
  _partner,
  _driver,
  accountCar
} from "./reports.controller";

const router = Router();
router.get("/info/driver", InfoDriver);
router.get("/info/partner", InfoPartner);
router.get("/info/car", InfoCar);

router.get("/account/cars", accountCar);
// router.get("/account/drivers", accountDriver);
// router.get("/account/partners", accountPartner);

router.get("/account/_driver", _driver);
router.get("/account/_partner", _partner);

export default router;
