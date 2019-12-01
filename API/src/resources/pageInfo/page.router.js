import { Router } from "express";

import {
  onePartner,
  onePartnerConst,
  oneDriverConst,
  oneDriver,
  carInfo
} from "./controllers";

const router = Router();

router.get("/one_partner", onePartner);
router.get("/one_partner_const", onePartnerConst);
router.get("/one_driver", oneDriver);
router.get("/one_driver_const", oneDriverConst);
router.get("/car_info", carInfo);
export default router;
