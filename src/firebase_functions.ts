import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

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
  done_at: Date;
  location: string;
  prevDeedID: string;
  nextDeedID: string;
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

export const getNominations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "nominations"));
    const nominations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Nomination, "id">),
    }));
    return nominations;
  } catch (error) {
    console.error("Error fetching nominations:", error);
    return [];
  }
};

export const getNominationById = async (nominationId: string): Promise<Nomination | null> => {
  try {
    const nominationDoc = await getDoc(doc(db, "nominations", nominationId));
    if (nominationDoc.exists()) {
      return {
        id: nominationDoc.id,
        ...(nominationDoc.data() as Omit<Nomination, "id">)
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching nomination:", error);
    return null;
  }
};

export const getRequests = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "requests"));
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Request, "id">),
    }));
    return requests;
  } catch (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
};

export const getRequestById = async (requestId: string): Promise<Request | null> => {
  try {
    const requestDoc = await getDoc(doc(db, "requests", requestId));
    if (requestDoc.exists()) {
      return {
        id: requestDoc.id,
        ...(requestDoc.data() as Omit<Request, "id">)
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching request:", error);
    return null;
  }
};

export const getChallenges = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "challenges"));
    const challenges = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        started_at: data.started_at.toDate(),
      } as Challenge;
    });
    return challenges;
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return [];
  }
};

export const getChallengeById = async (challengeId: string): Promise<Challenge | null> => {
  try {
    const challengeDoc = await getDoc(doc(db, "challenges", challengeId));
    if (challengeDoc.exists()) {
      const data = challengeDoc.data();
      return {
        id: challengeDoc.id,
        ...data,
        started_at: data.started_at.toDate(),
      } as Challenge;
    }
    return null;
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return null;
  }
};

export const getDeeds = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "deeds"));
    const deeds = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        done_at: data.done_at.toDate(),
      } as Deed;
    });
    return deeds;
  } catch (error) {
    console.error("Error fetching deeds:", error);
    return [];
  }
};

export const getDeedById = async (deedId: string): Promise<Deed | null> => {
  try {
    const deedDoc = await getDoc(doc(db, "deeds", deedId));
    if (deedDoc.exists()) {
      const data = deedDoc.data();
      return {
        id: deedDoc.id,
        ...data,
        done_at: data.done_at.toDate(),
      } as Deed;
    }
    return null;
  } catch (error) {
    console.error("Error fetching deed:", error);
    return null;
  }
};

export type { User, Nomination, Request, Challenge, Deed };
