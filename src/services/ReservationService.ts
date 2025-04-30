import { appDatabase } from "../config/database";
import logger from "../config/winstonLoggerConfig";
import { HostawayUser } from "../entity/HostawayUser";
import { formatCurrency } from "../helpers/helpers";
import { sendNotificationToAll, sendNotificationToUser } from "../utils/sendNotification";

interface Reservation {
    guestName: string;
    arrivalDate: string;
    departureDate: string;
    totalPrice: number;
    guestFirstName: string;
    listingName: string;
    listingMapId: number;
}

export class ReservationService {
    private hostawayUserRepo = appDatabase.getRepository(HostawayUser);

    async processNewReservation(reservation: Reservation) {
        const guestName = reservation.guestName;
        const checkIn = reservation.arrivalDate;
        const checkOut = reservation.departureDate;
        const totalPrice = reservation.totalPrice;
        const guestFirstName = reservation.guestFirstName || reservation.guestName;
        const listingName = reservation.listingName;
        const listingMapId = reservation.listingMapId;

        const payload = {
            title: `🎉 New Booking: ${formatCurrency(totalPrice)} Earned!`,
            body: `${guestFirstName} booked ${listingName} from ${checkIn} to ${checkOut}. Tap to view details!`
        };

        // find the user that needs to be notified
        const hostawayUsers = await this.hostawayUserRepo.find({ where: { listingId: listingMapId } });
        if (!hostawayUsers || hostawayUsers.length == 0) {
            logger.info(`[processNewReservation] No hostaway user found for the listingMapId:${listingMapId}`);
            return;
        }

        const userIds = hostawayUsers.map(user => user.ha_userId);

        await sendNotificationToUser(userIds, payload);
        return;
    }

}