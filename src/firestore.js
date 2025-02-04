import { db } from "./firebase"; // Sørg for at din firebase-config allerede importerer db
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";

// Reference til Firestore-samlingen
const activitiesCollection = collection(db, "activities");

// 🔹 Opret en ny aktivitet (CREATE)
export const createActivity = async (activity) => {
  try {
    const docRef = await addDoc(activitiesCollection, activity);
    return docRef.id;
  } catch (error) {
    console.error("Fejl ved oprettelse af aktivitet:", error);
  }
};

// 🔹 Hent alle aktiviteter (READ)
export const getActivities = async () => {
  try {
    const querySnapshot = await getDocs(activitiesCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
const upgradeToAdmin = async (userId) => {
  await updateDoc(doc(db, "users", userId), {
    role: "admin",
  });
  alert("Brugeren er nu admin!");
};