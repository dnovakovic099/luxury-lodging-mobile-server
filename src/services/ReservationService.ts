import { formatCurrency } from "../helpers/helpers";
import { sendNotificationToAll } from "../utils/sendNotification";

interface Reservation {
    guestName: string;
    arrivalDate: string;
    departureDate: string;
    totalPrice: number;
    guestFirstName: string;
    listingName: string;
}

export class ReservationService {
    async processNewReservation(reservation: Reservation) {
        const guestName = reservation.guestName;
        const checkIn = reservation.arrivalDate;
        const checkOut = reservation.departureDate;
        const totalPrice = reservation.totalPrice;
        const guestFirstName = reservation.guestFirstName || reservation.guestName;
        const listingName = reservation.listingName;

        const payload = {
            title: `🎉 New Booking: ${formatCurrency(totalPrice)} Earned!`,
            body: `${guestFirstName} booked ${listingName} from ${checkIn} to ${checkOut}. Tap to view details!`
        };

        await sendNotificationToAll(payload);
        return;
    }

}