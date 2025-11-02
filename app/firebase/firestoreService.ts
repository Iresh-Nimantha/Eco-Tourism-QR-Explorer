// firebase/firestoreService.ts
import { db } from "./clientApp";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// Type for location data
export interface LocationData {
  locationName: string;
  description: string;
  customFilename: string;
  credit: string;
  tags: string;
  imageUrl: string;
  createdAt?: any;
}

export async function addLocationToFirebase(data: LocationData) {
  const docRef = await addDoc(collection(db, "locations"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Fetch all from "locations" collection
export async function fetchLocationsFromFirebase() {
  const querySnapshot = await getDocs(collection(db, "locations"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
} // Delete one
export async function deleteLocationFromFirebase(id: string) {
  await deleteDoc(doc(db, "locations", id));
}

// Edit (update) one
export async function updateLocationInFirebase(id: string, data: object) {
  await updateDoc(doc(db, "locations", id), data);
}
