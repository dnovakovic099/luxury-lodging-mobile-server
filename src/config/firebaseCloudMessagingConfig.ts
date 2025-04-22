import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import serviceAccountJson from '../../firebase.credentials.json';

// Cast the JSON as a ServiceAccount to satisfy TypeScript
const serviceAccount = serviceAccountJson as ServiceAccount;

initializeApp({
    credential: cert(serviceAccount),
});

export const messaging: any = getMessaging();
