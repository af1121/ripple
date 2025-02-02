import { collection, getDocs, doc, getDoc, addDoc, Timestamp, query, where, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

interface UserType {
  id: string;
  username: string;
  password: string;
}

interface Nomination {
  id: string;
  nominator: string;
  challengeID: string;  
  started_at: Date;
  text: string;     
  icon: string;
}

interface Request {
  id: string;
  nominationID: string;
  nomineeID: string;
  active: boolean;
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
  numContributions: number;
}


export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<UserType, "id">),
    }));
    console.log("Users data:", usersData);
    return usersData;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (userId: string): Promise<UserType | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      const userData: UserType = {
        id: userId,
        username: data.Username,
        password: data.Password
      };
      return userData;
    } else {
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
    const nominations = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        started_at: data.StartedAt.toDate(),
      } as Nomination;
    });
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
      const data = nominationDoc.data();
      console.log("Nomination data:", data);
      return {
        id: nominationDoc.id,
        ...data,    
        started_at: data.StartedAt.toDate(),
      } as Nomination;
    }
    return null;
  } catch (error) {
    console.error("Error fetching nomination:", error);
    return null;
  }
};

export const getRequests = async (): Promise<Request[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "requests"));
    const requests = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nominationID: data.NominationID,
        nomineeID: data.NomineeID,
        active: data.Active
      } as Request;
    });
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
      const data = requestDoc.data();
      return {
        id: requestDoc.id,
        nominationID: data.NominationID,
        nomineeID: data.NomineeID,
        active: data.Active || true
      } as Request;
    }
    return null;
  } catch (error) {
    console.error("Error fetching request:", error);
    return null;
  }
};

export const getRequestsByNomineeId = async (userId: string, active: boolean): Promise<Request[]> => {
  try {
    const requestsRef = collection(db, "requests");
    const q = query(
      requestsRef, 
      where("NomineeID", "==", userId),
      where("Active", "==", active)
    );
    const querySnapshot = await getDocs(q);
    
    const requests: Request[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Raw request data:", data); // Debug log to see the raw data

      const request: Request = {
        id: doc.id,
        nominationID: data.NominationID,
        nomineeID: data.NomineeID,
        active: data.Active ?? true
      };
      
      console.log("Mapped request:", request); // Debug log to see the mapped data
      return request;
    });
    
    console.log("All requests:", requests);
    return requests;
  } catch (error) {
    console.error("Error fetching requests for nominee:", error);
    return [];
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
        started_at: data.StartedAt.toDate(),
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
      console.log("Challenge data:", data);
      return {
        id: challengeDoc.id,
        ...data,
        started_at: data.StartedAt.toDate(),
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
        done_at: data.DoneAt.toDate(),
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
        done_at: data.DoneAt.toDate(),
      } as Deed;
    }
    return null;
  } catch (error) {
    console.error("Error fetching deed:", error);
    return null;
  }
};

export const getDeedsByUserId = async (userId: string): Promise<Deed[]> => {
  try {
    const deedsRef = collection(db, "deeds");
    const q = query(deedsRef, where("userID", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const deeds = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        done_at: data.DoneAt.toDate(),
      } as Deed;
    });
    
    return deeds;
  } catch (error) {
    console.error("Error fetching deeds for user:", error);
    return [];
  }
};

export const createUser = async (userData: Omit<UserType, 'id'>): Promise<UserType | null> => {
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    return {
      id: docRef.id,
      ...userData
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const createNomination = async (
  nominationData: Omit<Nomination, 'id' | 'started_at'> & { started_at?: Date }
): Promise<Nomination | null> => {
  try {
    const data = {
      ...nominationData,
      StartedAt: Timestamp.fromDate(nominationData.started_at || new Date())
    };
    
    const docRef = await addDoc(collection(db, "nominations"), data);
    return {
      id: docRef.id,
      ...nominationData,
      started_at: nominationData.started_at || new Date()
    };
  } catch (error) {
    console.error("Error creating nomination:", error);
    return null;
  }
};

export const createRequest = async (
  requestData: Omit<Request, 'id'> & { active?: boolean }
): Promise<Request | null> => {
  try {
    const data = {
      NominationID: requestData.nominationID,
      NomineeID: requestData.nomineeID,
      Active: requestData.active ?? true // defaults to true if not provided
    };
    
    const docRef = await addDoc(collection(db, "requests"), data);
    return {
      id: docRef.id,
      nominationID: data.NominationID,
      nomineeID: data.NomineeID,
      active: data.Active
    } as Request;
  } catch (error) {
    console.error("Error creating request:", error);
    return null;
  }
};

export const createChallenge = async (
  challengeData: Omit<Challenge, 'id' | 'started_at'> & { started_at?: Date }
): Promise<Challenge | null> => {
  try {
    const data = {
      ...challengeData,
      StartedAt: Timestamp.fromDate(challengeData.started_at || new Date())
    };
    
    const docRef = await addDoc(collection(db, "challenges"), data);
    return {
      id: docRef.id,
      ...challengeData,
      started_at: challengeData.started_at || new Date()
    };    
  } catch (error) {
    console.error("Error creating challenge:", error);
    return null;
  }
};

export const createDeed = async (
  deedData: Omit<Deed, 'id' | 'done_at'> & { done_at?: Date }
): Promise<Deed | null> => {
  try {
    const data = {
      ...deedData,
      DoneAt: Timestamp.fromDate(deedData.done_at || new Date())
    };
    
    const docRef = await addDoc(collection(db, "deeds"), data);
    return {
      id: docRef.id,
      ...deedData,
      done_at: deedData.done_at || new Date()
    };
  } catch (error) {
    console.error("Error creating deed:", error);
    return null;
  }
};

export const deleteRequest = async (requestId: string): Promise<boolean> => {
  try {
    const requestRef = doc(db, "requests", requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      console.log("Request not found:", requestId);
      return false;
    }
    
    await deleteDoc(requestRef);
    return true;
  } catch (error) {
    console.error("Error deleting request:", error);
    return false;
  }
};

export type { UserType, Nomination, Request, Challenge, Deed };
