import { db } from "../config/Firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
    joining_at: docSnap.data().joining_at?.toDate
      ? docSnap.data().joining_at.toDate().toLocaleDateString()
      : "N/A",
    updated_at: docSnap.data().updated_at?.toDate
      ? docSnap.data().updated_at.toDate().toLocaleString()
      : "N/A",
    createdAt: docSnap.data().createdAt?.toDate
      ? docSnap.data().createdAt.toDate().toLocaleString()
      : "N/A",
  }));
};

export const updateUser = async (id, data) => {
  const userRef = doc(db, "users", id);
  await updateDoc(userRef, {
    ...data,
    updated_at: new Date(), // refresh updated time
  });
};

export const deleteUser = async (id) => {
  const userRef = doc(db, "users", id);
  await deleteDoc(userRef);
};
