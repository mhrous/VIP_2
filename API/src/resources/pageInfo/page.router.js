import { Router } from "express";

import { onePartner } from "./controllers";

const router = Router();

router.get("/one_partner", onePartner);

export default router;
