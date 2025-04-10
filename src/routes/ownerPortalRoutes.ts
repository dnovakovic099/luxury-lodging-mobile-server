import { Router, request } from "express";
import authenticate from "../middlewares/authenticate";
import { OwnerPortalController } from "../controllers/OwnerPortalController";

const router = Router();
const ownerPortalController = new OwnerPortalController();

router.route('/getpartnershipinfo')
    .get(
        authenticate,
        ownerPortalController.getPartnershipInfo
    );

router.route('/getreferralcode')
    .get(
        authenticate,
        ownerPortalController.getReferralCode
    )

export default router;