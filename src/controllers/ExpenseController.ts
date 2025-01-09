import { Response, NextFunction } from "express";
import { ExpenseService } from "../services/ExpenseService";
import logger from "../config/winstonLoggerConfig";
import { CustomRequest } from "../interfaces/User";

export class ExpenseController {
    private expenseService = new ExpenseService();

    async getTotalExpense(request: CustomRequest, response: Response, next: NextFunction) {
        try {
            const userId = request.user.userId;
            const listingId = request.query.listingId || null;
            const expenseService = new ExpenseService();
            const totalExpense = await expenseService.getTotalExpenseByUserId(userId, Number(listingId));
            response.status(200).json({
                success: true,
                totalExpense
            });
        } catch (error) {
            logger.error(`{Api:${request.url}, Error: ${error} }`);
            next(error);
        }
    }
}