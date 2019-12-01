import { Router } from "express";
import {
  InfoCar,
  InfoDriver,
  InfoPartner,
  accountDriver,
  accountPartner,
  accountALLPartner,
  accountALLDriver,
  accountCar
} from "./reports.controller";

const router = Router();
router.get("/", (req, res) => res.json({ data: "ggggg" }));
router.get("/info/driver", InfoDriver);
router.get("/info/partner", InfoPartner);
router.get("/info/car", InfoCar);
router.get("/account/car", accountCar);
router.get("/account/driver", accountDriver);
router.get("/account/partner", accountPartner);
router.get("/account/all/driver", accountALLDriver);
router.get("/account/all/partner", accountALLPartner);

export default router;
