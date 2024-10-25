import { serviceAccount } from './config';
import * as admin from 'firebase-admin';

const ADMIN_APP_NAME = 'firebase-frameworks';

const adminApp =
  admin.apps.find((app) => app?.name === ADMIN_APP_NAME) ||
  admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    },
    ADMIN_APP_NAME
  );

export const adminAuth = admin.auth(adminApp);
export const adminDb = admin.firestore(adminApp);
try {
  adminDb.settings({ ignoreUndefinedProperties: true });
} catch (e) {
  // console.error(e);
}

export { admin };