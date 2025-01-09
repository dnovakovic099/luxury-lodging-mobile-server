import { Router } from "express";
import authRoutes from "./authRoutes";
import accountingRoutes from "./accountingRoutes";
const router = Router();

router.use('/auth', authRoutes);
router.use('/accounting', accountingRoutes)

export default router;