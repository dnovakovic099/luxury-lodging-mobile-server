import { Router } from "express";
import { ExpenseController } from "../controllers/ExpenseController";
import authenticate from "../middlewares/authenticate";

const router = Router();
const expenseController = new ExpenseController();

router.route('/gettotalexpense').get(authenticate, expenseController.getTotalExpense);

export default router;