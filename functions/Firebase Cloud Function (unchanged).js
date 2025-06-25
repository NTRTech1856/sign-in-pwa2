const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.clearSignedInUsersDaily = functions.pubsub
  .schedule("0 4 * * *") // 4 AM daily UTC, change timezone below
  .timeZone("Europe/London") // e.g. "America/New_York"
  .onRun(async () => {
    const snapshot = await db.collection("signedInUsers").get();
    const batch = db.batch();

    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    console.log("Cleared signedInUsers collection at 4 AM");
    return null;
  });
