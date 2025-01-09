import { Router, request } from "express";
import { ExpenseController } from "../controllers/ExpenseController";
import authenticate from "../middlewares/authenticate";
import { validate } from "../helpers/validate";
import { revenueCalculationSchema } from "../validation/income";
import { IncomeController } from "../controllers/IncomeController";

const router = Router();
const expenseController = new ExpenseController();
const incomeController = new IncomeController();

router.route('/gettotalexpense').get(authenticate, expenseController.getTotalExpense);

router.route('/requestrevenuecalculation')
    .post(
        authenticate,
        validate(revenueCalculationSchema),
        incomeController.requestRevenueCalculation
    );

export default router;