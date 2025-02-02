import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  Timestamp,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
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
  UserID: string;
  ChallengeID: string;
  Pictures: string[];
  Comment: string;
  DoneAt: Date;
  Location: string;
  PrevDeedID: string;
  NextDeedID: string;
  NumContributions: number;
}

interface RequestDetails {
  id: string;
  title: string;
  nominatedBy: string;
  timeLeft: string;
  peopleInChain: number;
  icon: "tree" | "coffee";
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
        ...(userDoc.data() as Omit<User, "id">),
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
    const nominations = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        started_at: data.started_at.toDate(),
      } as Nomination;
    });
    return nominations;
  } catch (error) {
    console.error("Error fetching nominations:", error);
    return [];
  }
};

export const getNominationById = async (
  nominationId: string
): Promise<Nomination | null> => {
  try {
    const nominationDoc = await getDoc(doc(db, "nominations", nominationId));
    if (nominationDoc.exists()) {
      const data = nominationDoc.data();
      return {
        id: nominationDoc.id,
        ...data,
        started_at: data.started_at.toDate(),
      } as Nomination;
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

export const getRequestById = async (
  requestId: string
): Promise<Request | null> => {
  try {
    const requestDoc = await getDoc(doc(db, "requests", requestId));
    if (requestDoc.exists()) {
      return {
        id: requestDoc.id,
        ...(requestDoc.data() as Omit<Request, "id">),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching request:", error);
    return null;
  }
};

export const getRequestsByNomineeId = async (
  userId: string
): Promise<Request[]> => {
  try {
    const requestsRef = collection(db, "requests");
    const q = query(
      requestsRef,
      where("NomineeID", "==", userId),
      where("Active", "==", true)
    );
    const querySnapshot = await getDocs(q);

    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Request, "id">),
    }));

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
        started_at: data.started_at.toDate(),
      } as Challenge;
    });
    return challenges;
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return [];
  }
};

export const getChallengeById = async (
  challengeId: string
): Promise<Challenge | null> => {
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
        DoneAt: data.DoneAt.toDate(),
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
        DoneAt: data.DoneAt.toDate(),
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
    const q = query(deedsRef, where("UserID", "==", userId));
    const querySnapshot = await getDocs(q);

    const deeds = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        DoneAt: data.DoneAt.toDate(),
      } as Deed;
    });

    return deeds;
  } catch (error) {
    console.error("Error fetching deeds for user:", error);
    return [];
  }
};

export const getTotalDeedsGenerated = async (
  userId: string
): Promise<number> => {
  try {
    // First get all deeds by this user
    const deedsRef = collection(db, "deeds");
    const userDeedsQuery = query(deedsRef, where("UserID", "==", userId));
    const userDeeds = await getDocs(userDeedsQuery);

    let totalDeeds = 0;

    // For each deed by this user, add up the number of contributions
    for (const deedDoc of userDeeds.docs) {
      const deed = deedDoc.data() as Deed;
      totalDeeds += deed.NumContributions;
    }

    console.log("Total deeds generated by user:", totalDeeds);
    return totalDeeds;
  } catch (error) {
    console.error("Error calculating total deeds generated:", error);
    return 0;
  }
};

export const createUser = async (
  userData: Omit<User, "id">
): Promise<User | null> => {
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    return {
      id: docRef.id,
      ...userData,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const createNomination = async (
  nominationData: Omit<Nomination, "id" | "started_at"> & { started_at?: Date }
): Promise<Nomination | null> => {
  try {
    const data = {
      ...nominationData,
      started_at: Timestamp.fromDate(nominationData.started_at || new Date()),
    };

    const docRef = await addDoc(collection(db, "nominations"), data);
    return {
      id: docRef.id,
      ...nominationData,
      started_at: nominationData.started_at || new Date(),
    };
  } catch (error) {
    console.error("Error creating nomination:", error);
    return null;
  }
};

export const createRequest = async (
  requestData: Omit<Request, "id"> & { active?: boolean }
): Promise<Request | null> => {
  try {
    const data = {
      ...requestData,
      active: requestData.active ?? true, // defaults to true if not provided
    };

    const docRef = await addDoc(collection(db, "requests"), data);
    return {
      id: docRef.id,
      ...data,
    };
  } catch (error) {
    console.error("Error creating request:", error);
    return null;
  }
};

export const createChallenge = async (
  challengeData: Omit<Challenge, "id" | "started_at"> & { started_at?: Date }
): Promise<Challenge | null> => {
  try {
    const data = {
      ...challengeData,
      started_at: Timestamp.fromDate(challengeData.started_at || new Date()),
    };

    const docRef = await addDoc(collection(db, "challenges"), data);
    return {
      id: docRef.id,
      ...challengeData,
      started_at: challengeData.started_at || new Date(),
    };
  } catch (error) {
    console.error("Error creating challenge:", error);
    return null;
  }
};

export const createDeed = async (
  deedData: Omit<Deed, "id" | "DoneAt"> & { DoneAt?: Date }
): Promise<Deed | null> => {
  try {
    const data = {
      ...deedData,
      DoneAt: Timestamp.fromDate(deedData.DoneAt || new Date()),
    };

    const docRef = await addDoc(collection(db, "deeds"), data);
    return {
      id: docRef.id,
      ...deedData,
      DoneAt: deedData.DoneAt || new Date(),
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

export const getRequestsList = async (
  userId: string
): Promise<RequestDetails[]> => {
  try {
    const requestsRef = collection(db, "requests");
    const q = query(
      requestsRef,
      where("NomineeID", "==", userId),
      where("Active", "==", true)
    );
    const requestsSnapshot = await getDocs(q);

    const requestsWithDetails = await Promise.all(
      requestsSnapshot.docs.map(async (requestDoc) => {
        const request = requestDoc.data();

        // Check if NominationID exists
        if (!request?.NominationID) {
          console.warn(`Request ${requestDoc.id} has no NominationID`);
          return null;
        }

        // Get nomination to find challenge
        const nominationDoc = await getDoc(
          doc(db, "nominations", request.NominationID)
        );
        const nomination = nominationDoc.exists() ? nominationDoc.data() : null;

        // Check if ChallengeID exists
        if (!nomination?.ChallengeID) {
          console.warn(`Nomination ${request.NominationID} has no ChallengeID`);
          return null;
        }

        // Get challenge details
        const challengeDoc = await getDoc(
          doc(db, "challenges", nomination.ChallengeID)
        );
        const challenge = challengeDoc.exists() ? challengeDoc.data() : null;

        // Check if Nominator exists
        if (!nomination?.Nominator) {
          console.warn(`Nomination ${request.NominationID} has no Nominator`);
          return null;
        }

        // Get nominator's name
        const nominatorDoc = await getDoc(
          doc(db, "users", nomination.Nominator)
        );
        const nominator = nominatorDoc.exists() ? nominatorDoc.data() : null;

        return {
          id: requestDoc.id,
          title: challenge?.Title || "Unknown Challenge",
          nominatedBy: nominator?.Username || "Unknown User",
          timeLeft: "24:00:00",
          peopleInChain: challenge?.Participants || 0,
          icon: (nomination?.Icon as "tree" | "coffee") || "tree",
        };
      })
    );

    const validRequests = requestsWithDetails.filter(
      (request): request is RequestDetails => request !== null
    );
    console.log("Requests list:", validRequests);
    return validRequests;
  } catch (error) {
    console.error("Error fetching requests list:", error);
    return [];
  }
};

export type { User, Nomination, Request, Challenge, Deed };
