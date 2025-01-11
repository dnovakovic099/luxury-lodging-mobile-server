import { Router } from "express";
import authRoutes from "./authRoutes";
import accountingRoutes from "./accountingRoutes";
import listingRoutes from "./listingRoutes";
const router = Router();

router.use('/auth', authRoutes);
router.use('/accounting', accountingRoutes)
router.use('/listing', listingRoutes);

export default router;