import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";

// Reference til Firestore-samlingen
const activitiesCollection = collection(db, "activities");

// 🔹 Opret en ny aktivitet & tilføj brugere til "Mangler svar"
export const createActivityWithUsers = async (activity) => {
  try {
    // 1️⃣ Opret aktivitet
    const docRef = await addDoc(activitiesCollection, activity);

    // 2️⃣ Hent alle brugere fra Firestore
    const usersSnapshot = await getDocs(collection(db, "users"));
    const allUsers = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: `${doc.data().firstName} ${doc.data().lastName}`,
    }));

    // 3️⃣ Tilføj brugerne til "Mangler svar" under `usersList`
    await setDoc(doc(db, "usersList", docRef.id), {
      attending: [],
      notAttending: [],
      pending: allUsers, // Alle starter i "Mangler svar"
    });

    console.log("Aktivitet oprettet med ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Fejl ved oprettelse af aktivitet:", error);
  }
};

// 🔹 Hent alle aktiviteter (READ)
export const getActivities = async () => {
  try {
    const querySnapshot = await getDocs(activitiesCollection);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Fejl ved hentning af aktiviteter:", error);
  }
};

// 🔹 Opdater en aktivitet (UPDATE)
export const updateActivity = async (id, updatedData) => {
  try {
    const activityDoc = doc(db, "activities", id);
    await updateDoc(activityDoc, updatedData);
  } catch (error) {
    console.error("Fejl ved opdatering af aktivitet:", error);
  }
};

// 🔹 Slet en aktivitet (DELETE)
export const deleteActivity = async (id) => {
  try {
    const activityDoc = doc(db, "activities", id);
    await deleteDoc(activityDoc);
  } catch (error) {
    console.error("Fejl ved sletning af aktivitet:", error);
  }
};

// 🔹 Opgrader bruger til admin
export const upgradeToAdmin = async (userId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      role: "admin",
    });
    alert("Brugeren er nu admin!");
  } catch (error) {
    console.error("Fejl ved opgradering til admin:", error);
  }
};

// 🔹 Hent deltagelsesstatus for en aktivitet
export const getAttendance = async (activityId) => {
  try {
    const activityRef = doc(db, "usersList", activityId);
    const activityDoc = await getDoc(activityRef);
    if (activityDoc.exists()) {
      return activityDoc.data() || { attending: [], notAttending: [], pending: [] };
    }
    return null;
  } catch (error) {
    console.error("Fejl ved hentning af deltagelse:", error);
    return null;
  }
};

export const attendActivity = async (activityId, user) => {
  try {
    const activityRef = doc(db, "usersList", activityId);
    const activityDoc = await getDoc(activityRef);
    if (activityDoc.exists()) {
      let attendance = activityDoc.data() || { attending: [], notAttending: [], pending: [] };

      // Find brugeren i pending-listen for at bevare navn
      const userData = attendance.pending.find((u) => u.id === user.id);

      if (userData) {
        // Flyt brugeren til "attending" og fjern fra de andre lister
        attendance.attending.push(userData);
        attendance.pending = attendance.pending.filter((u) => u.id !== user.id);
        attendance.notAttending = attendance.notAttending.filter((u) => u.id !== user.id);

        await updateDoc(activityRef, { attending: attendance.attending, pending: attendance.pending, notAttending: attendance.notAttending });
      }
    }
  } catch (error) {
    console.error("Fejl ved tilmelding:", error);
  }
};

export const declineActivity = async (activityId, user) => {
  try {
    const activityRef = doc(db, "usersList", activityId);
    const activityDoc = await getDoc(activityRef);
    if (activityDoc.exists()) {
      let attendance = activityDoc.data() || { attending: [], notAttending: [], pending: [] };

      // Find brugeren i pending-listen for at bevare navn
      const userData = attendance.pending.find((u) => u.id === user.id);

      if (userData) {
        // Flyt brugeren til "notAttending" og fjern fra de andre lister
        attendance.notAttending.push(userData);
        attendance.pending = attendance.pending.filter((u) => u.id !== user.id);
        attendance.attending = attendance.attending.filter((u) => u.id !== user.id);

        await updateDoc(activityRef, { attending: attendance.attending, pending: attendance.pending, notAttending: attendance.notAttending });
      }
    }
  } catch (error) {
    console.error("Fejl ved afmelding:", error);
  }
};
