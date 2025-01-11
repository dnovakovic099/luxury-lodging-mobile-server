import { Router, request } from "express";
import authenticate from "../middlewares/authenticate";
import { validate } from "../helpers/validate";
import { ListingController } from "../controllers/ListingController";
import { getListingUpdatesSchema } from "../validation/listing";

const router = Router();
const listingController = new ListingController();

router.route('/getlistingupdates')
    .get(
        authenticate,
        validate(getListingUpdatesSchema),
        listingController.getListingUpdates
    );

export default router;