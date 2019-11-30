import { Router } from "express";

import { onePartner, onePartnerConst } from "./controllers";

const router = Router();

router.get("/one_partner", onePartner);
router.get("/one_partner_const", onePartnerConst);
export default router;
