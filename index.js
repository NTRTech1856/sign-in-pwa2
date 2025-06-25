const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Scheduled function runs every day at 4 AM in your specified timezone
exports.scheduledClear = functions.pubsub.schedule('0 4 * * *')
  .timeZone('Europe/London') // Change this to your timezone, e.g. 'America/New_York'
  .onRun(async (context) => {
    console.log('Running scheduled clear of signedInUsers collection at 4 AM');

    try {
      const snapshot = await db.collection('signedInUsers').get();

      if (snapshot.empty) {
        console.log('No documents to delete');
        return null;
      }

      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('Successfully cleared signedInUsers collection');
      return null;
    } catch (error) {
      console.error('Error clearing signedInUsers collection:', error);
      return null;
    }
  });
