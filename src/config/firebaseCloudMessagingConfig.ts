import admin, { ServiceAccount } from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';
import serviceAccountJson from '../../firebase.credentials.json';

// Cast the JSON as a ServiceAccount to satisfy TypeScript
const serviceAccount = serviceAccountJson as ServiceAccount;

export const fcm = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

