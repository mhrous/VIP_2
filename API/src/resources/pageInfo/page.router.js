import { Router } from "express";

import {
  onePartner,
  onePartnerConst,
  oneDriverConst,
  oneDriver
} from "./controllers";

const router = Router();

router.get("/one_partner", onePartner);
router.get("/one_partner_const", onePartnerConst);
router.get("/one_driver", oneDriver);
router.get("/one_driver_const", oneDriverConst);
export default router;
