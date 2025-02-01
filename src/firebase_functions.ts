import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useState } from "react";

interface User {
  id: string;
  username: string;
  password: string;
}

interface Nomination {
  id: string;
  nominator: string;
  challengeID: string;
}

interface Request {
  id: string;
  nominationID: string;
  nomineeID: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  pictures: string[];
  started_by: string;
  started_at: Date;
  location: string;
}

interface Deed {
  id: string;
  userID: string;
  challengeID: string;
  pictures: string[];
  comment: string;
  
}



export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    }));
    return usersData;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...(userDoc.data() as Omit<User, "id">)
      };
    } else {
      console.log("No user found with ID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export type { User };
