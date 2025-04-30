// sendNotification.ts
import { fcm } from '../config/firebaseCloudMessagingConfig';
import logger from '../config/winstonLoggerConfig';
import { appDatabase } from "../config/database";
import { FCMToken } from '../entity/FCMToken';
import { In } from 'typeorm';

type NotificationPayload = {
    title: string;
    body: string;
};

export const sendNotificationToUser = async (
    userIds: number[],
    payload: NotificationPayload
) => {
    const fcmRepo = appDatabase.getRepository(FCMToken);

    const tokens = await fcmRepo.find({
        where: {
            userId: In(userIds)
        },
    });

    const tokenList = tokens.map((t: any) => t.token);
    if (tokenList.length === 0) {
        logger.info(`[sendNotificationToUser] No FCM tokens found for user ${userIds}`);
        return;
    }

    const message = {
        notification: {
            title: payload.title,
            body: payload.body,
        },
        tokens: tokenList,
    };

    try {
        const response = await fcm.messaging().sendEachForMulticast(message);
        logger.info(`[sendNotificationToUser] FCM sent to ${response.successCount} devices, failed: ${response.failureCount}`);

        // Clean up invalid tokens
        const failedTokens = response.responses
            .map((res: any, i: any) => (!res.success ? tokenList[i] : null))
            .filter(Boolean) as string[];

        if (failedTokens.length > 0) {
            // await fcmRepo.delete({ token: In(failedTokens) });
            logger.info(`[sendNotificationToUser] Deleted ${failedTokens.length} invalid tokens`);
        }
    } catch (err) {
        logger.error('[sendNotificationToUser] Error sending FCM notification:', err);
    }
};


export const sendNotificationToAll = async (
    payload: NotificationPayload
) => {
    const fcmRepo = appDatabase.getRepository(FCMToken);

    const tokens = await fcmRepo.find({});

    const tokenList = tokens.map((t: any) => t.token);
    if (tokenList.length === 0) {
        logger.info(`[sendNotificationToUser] No FCM tokens found`);
        return;
    }

    const message = {
        notification: {
            title: payload.title,
            body: payload.body,
        },
        tokens: tokenList,
    };

    try {
        const response = await fcm.messaging().sendEachForMulticast(message);
        logger.info(`[sendNotificationToUser] FCM sent to ${response.successCount} devices, failed: ${response.failureCount}`);

        // Clean up invalid tokens
        const failedTokens = response.responses
            .map((res: any, i: any) => (!res.success ? tokenList[i] : null))
            .filter(Boolean) as string[];

        if (failedTokens.length > 0) {
            // await fcmRepo.delete({ token: In(failedTokens) });
            logger.info(`[sendNotificationToUser] Deleted ${failedTokens.length} invalid tokens`);
        }
    } catch (err) {
        logger.error('[sendNotificationToUser] Error sending FCM notification:', err);
    }
};
