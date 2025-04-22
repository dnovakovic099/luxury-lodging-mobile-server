import { sendNotificationToAll } from "../utils/sendNotification";

interface Reservation {
    guestName: string;
    arrivalDate: string;
    departureDate: string;
}

export class ReservationService {
    async processNewReservation(reservation: Reservation) {
        const guestName = reservation.guestName;
        const checkIn = reservation.arrivalDate;
        const checkOut = reservation.departureDate;

        const payload = {
            title: `New Reservation!`,
            body: `Guest ${guestName} booked ${checkIn} - ${checkOut}`
        };

        await sendNotificationToAll(payload);
        return;
    }

}