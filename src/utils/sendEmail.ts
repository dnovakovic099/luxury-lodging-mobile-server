import sgMail from "@sendgrid/mail";
import { config } from "../config/envConfig";
import logger from "../config/winstonLoggerConfig";
import createHttpError from "http-errors";

sgMail.setApiKey(config.SENDGRID_API_KEY!);

const sendEmail = async (subject: string, html: any, from: string, to: string) => {
    const msg = {
        to: to,
        from: from,
        subject: subject,
        html: html
    };
    try {
        await sgMail.send(msg);
        logger.info('Email sent successfully');
    } catch (error) {
        logger.error('Error sending email:', error);
        throw createHttpError(500, 'Error sending email');
    }
};

export default sendEmail;