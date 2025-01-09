import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/User";
import sendEmail from "../utils/sendEmail";
import { config } from "../config/envConfig";
import logger from "../config/winstonLoggerConfig";

export class IncomeController {
    async requestRevenueCalculation(request: CustomRequest, response: Response, next: NextFunction) {
        try {
            //send email notification
            const { message } = request.body;
            const { email, name } = request.user;

            const subject = "Revenue calculation request";
            const html = `
                <html>
                  <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f9; padding: 20px; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 20px;">
                      <h2 style="color: #007BFF; border-bottom: 2px solid #007BFF; padding-bottom: 10px;">Revenue Calculation Request</h2>
                      <p style="margin: 20px 0; font-size: 16px;">
                        <strong>Message:</strong> ${message}
                      </p>
                      <p style="margin: 20px 0; font-size: 16px;">
                        <strong>Requested By:</strong> ${name} (${email})
                      </p>
                      <p style="margin: 30px 0 0; font-size: 14px; color: #777;">Thank you!</p>
                    </div>
                  </body>
                </html>

        `;

            if (!config.EMAIL_FROM || !config.EMAIL_TO || !config.SENDGRID_API_KEY) {
                logger.error("Email notification configuration is missing");
                response.status(500).json({
                    success: false,
                    message: "Email notification configuration is missing"
                });
            }

            await sendEmail(subject, html, config.EMAIL_FROM!, config.EMAIL_TO!);

            response.status(200).json({
                success: true,
                message: "Request sent successfully"
            });
        } catch (error) {
            logger.error(`{Api:${request.url}, Error: ${error} }`);
            next(error);
        }
    }
}