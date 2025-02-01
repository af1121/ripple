import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useState } from "react";

interface User {
  id: string;
  username: string;
  password: string;
}

const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    }));
    return usersData;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export default getUsers;
