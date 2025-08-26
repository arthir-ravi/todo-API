import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseAdminService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
      }),
    });
  }

  async sendPushNotification(fcmToken: string, title: string, body: string, data: Record<string, string> = {}) {
    try {
      const message: admin.messaging.Message = {
        token: fcmToken,
        notification: { title, body },
        data
      };
      await admin.messaging().send(message);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}
