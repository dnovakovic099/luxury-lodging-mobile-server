import { Router } from "express";
import authRoutes from "./authRoutes";
import accountingRoutes from "./accountingRoutes";
import listingRoutes from "./listingRoutes";
import ownerPortalRoutes from "./ownerPortalRoutes";
import reservationRoutes from "./reservationRoutes";
const router = Router();

router.use('/auth', authRoutes);
router.use('/accounting', accountingRoutes)
router.use('/listing', listingRoutes);
router.use('/owner-portal', ownerPortalRoutes)
router.use('/reservation', reservationRoutes)

export default router;