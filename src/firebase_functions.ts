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
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

interface User {
  id: string;
  Username: string;
  Password: string;
}

interface Nomination {
  id: string;
  Nominator: string;
  ChallengeID: string;
  StartedAt: Date; 
  Icon: string;
} 

interface Request {
  id: string;
  NominationID: string;
  NomineeID: string;
  Active: boolean;
}

interface Challenge {
  id: string;
  Title: string;
  Description: string;
  CoverImage: string;
  StartedBy: string;
  CauseName: string;
  CauseURL: string;
  StartedAt: Date;
}

interface Deed {
  id: string;
  UserID: string;
  ChallengeID: string;
  Image: string;
  Comment: string;
  DoneAt: Date;
  Location: Location;
  PrevDeedID: string;
  NextDeedID: string;
  NumContributions: number;
}

interface Location {
  lat: number;
  lng: number;  
}

interface RequestDetails {
  id: string;
  Title: string;
  NominatedBy: string;
  TimeLeft: string;
  PeopleInChain: number;
  Icon: "tree" | "coffee";
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
      const data = userDoc.data();
      return {
        id: userId,
        Username: data.Username,
        Password: data.Password,
      };
    }
    return null;
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
        StartedAt: data.StartedAt.toDate(),
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
        StartedAt: data.StartedAt.toDate(),
      } as Nomination;
    }
    return null;
  } catch (error) {
    console.error("Error fetching nomination:", error);
    return null;
  }
};

export const updateRequestActive = async (requestId: string): Promise<boolean> => {
  try {
    const requestRef = doc(db, "requests", requestId);
    await updateDoc(requestRef, {
      Active: true
    });
    return true;
  } catch (error) {
    console.error("Error updating request:", error);
    return false;
  }
};

export const getRequests = async (): Promise<Request[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "requests"));
    const requests = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        NominationID: data.NominationID,
        NomineeID: data.NomineeID,
        Active: data.Active,
      } as Request;
    });
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
      const data = requestDoc.data();
      return {
        id: requestDoc.id,
        NominationID: data.NominationID,
        NomineeID: data.NomineeID,
        Active: data.Active || true,
      } as Request;
    }
    return null;
  } catch (error) {
    console.error("Error fetching request:", error);
    return null;
  }
};

export const getRequestsByNomineeId = async (
  userId: string,
  active: boolean
): Promise<Request[]> => {
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

      const request: Request = {
        id: doc.id,
        NominationID: data.NominationID,
        NomineeID: data.NomineeID,
        Active: data.Active ?? true,
      };
      return request;
    });
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
        StartedAt: data.StartedAt.toDate(),
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
        StartedAt: data.StartedAt.toDate(),
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

    return totalDeeds;
  } catch (error) {
    console.error("Error calculating total deeds generated:", error);
    return 0;
  }
};
 
export const updateDeedNextId = async (
  deedId: string, 
  nextDeedId: string
): Promise<boolean> => {
  try {
    const deedRef = doc(db, "deeds", deedId);
    await updateDoc(deedRef, {
      NextDeedID: nextDeedId
    });
    return true;
  } catch (error) {
    console.error("Error updating deed:", error);
    return false;
  }
};

export const getTotalDeedGeneratedByChallenge = async (
  challengeId: string
): Promise<number> => {
  try {
    // Get the challenge to find the creator
    const challengeRef = doc(db, "challenges", challengeId);
    const challengeSnap = await getDoc(challengeRef);

    if (!challengeSnap.exists()) {
      throw new Error("Challenge not found");
    }

    const challenge = challengeSnap.data();
    const creatorId = challenge.StartedBy;

    // Get the deed matching the challenge and creator
    const deedsRef = collection(db, "deeds");
    const q = query(
      deedsRef,
      where("ChallengeID", "==", challengeId),
      where("UserID", "==", creatorId)
    );
    const deedSnap = await getDocs(q);

    if (deedSnap.empty) {
      return 0;
    }

    // Return the NumContributions from the first matching deed
    const deed = deedSnap.docs[0].data();
    return deed.NumContributions || 0;
  } catch (error) {
    console.error("Error getting total deeds for challenge:", error);
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
  nominationData: Omit<Nomination, "id" | "StartedAt"> & { StartedAt?: Date }
): Promise<Nomination | null> => {
  try {
    const data = {
      ...nominationData,
      StartedAt: Timestamp.fromDate(nominationData.StartedAt || new Date()),
    };

    const docRef = await addDoc(collection(db, "nominations"), data);
    return {
      id: docRef.id,
      ...nominationData,
      StartedAt: nominationData.StartedAt || new Date(),
    };
  } catch (error) {
    console.error("Error creating nomination:", error);
    return null;
  }
};

export const createRequest = async (
  requestData: Omit<Request, "id"> & { Active?: boolean }
): Promise<Request | null> => {
  try {
    const data = {
      NominationID: requestData.NominationID,
      NomineeID: requestData.NomineeID,
      Active: requestData.Active ?? true,
    };

    const docRef = await addDoc(collection(db, "requests"), data);
    return {
      id: docRef.id,
      ...data,
    } as Request;
  } catch (error) {
    console.error("Error creating request:", error);
    return null;
  }
};

export const createChallenge = async (
  challengeData: Omit<Challenge, "id" | "StartedAt"> & { StartedAt?: Date }
): Promise<Challenge | null> => {
  try {
    const data = {
      ...challengeData,
      // StartedAt: Timestamp.fromDate(challengeData.StartedAt || new Date()),
    };

    const docRef = await addDoc(collection(db, "challenges"), data);
    return {
      id: docRef.id,
      ...challengeData,
      StartedAt: challengeData.StartedAt || new Date(),
    };
  } catch (error) {
    console.error("Error creating challenge:", error);
    return null;
  }
};

// export const createDeed = async (
//   deedData: Omit<Deed, "id" | "DoneAt"> & { DoneAt?: Date }
// ): Promise<Deed | null> => {
//   try {
//     const data = {
//       ...deedData,
//       DoneAt: Timestamp.fromDate(deedData.DoneAt || new Date()),
//     };

//     const docRef = await addDoc(collection(db, "deeds"), data);
//     return {
//       id: docRef.id,
//       ...deedData,
//       DoneAt: deedData.DoneAt || new Date(),
//     };
//   } catch (error) {
//     console.error("Error creating deed:", error);
//     return null;
//   }
// };

export const createDeed = async (deedData: Omit<Deed, 'id'>): Promise<Deed | null> => {
  try {
    // Add the deed to Firestore
    const deedsRef = collection(db, "deeds");
    const docRef = await addDoc(deedsRef, deedData);

    // Return the complete deed object with the ID
    return {
      id: docRef.id, // Explicitly include the document ID
      ...deedData
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
          Title: challenge?.Title || "Unknown Challenge",
          NominatedBy: nominator?.Username || "Unknown User",
          TimeLeft: "24:00:00",
          PeopleInChain: challenge?.Participants || 0,
          Icon: (nomination?.Icon as "tree" | "coffee") || "tree",
        };
      })
    );

    const validRequests = requestsWithDetails.filter(
      (request): request is RequestDetails => request !== null
    );
    return validRequests;
  } catch (error) {
    console.error("Error fetching requests list:", error);
    return [];
  }
};

export const getContributionsForUserInChallenge = async (
  challengeId: string,
  userId: string
): Promise<string> => {
  try {
    console.log("challengeId", challengeId);
    console.log("userId", userId);
    // Get the deed matching the challenge and user
    const deedsRef = collection(db, "deeds");
    const q = query(

      deedsRef,
      where("ChallengeID", "==", challengeId),
      where("UserID", "==", userId)
    );
    const deedSnap = await getDocs(q);

    if (deedSnap.empty) {
      console.log("no deed found");
      return "";
    }

    // Return the deed id from the first matching deed
    // const deed = deedSnap.docs[0].data(); 
    // return deed.id || "";
    console.log("deedSnap.docs[0].id: ", deedSnap.docs[0].id);
    return deedSnap.docs[0].id;


  } catch (error) {
    console.error("Error getting contributions for user in challenge:", error);
    return "";
  }
};

export const getRequestByUserAndChallenge = async (
  userId: string,
  challengeId: string
): Promise<Request | null> => {
  try {
    // First get all requests for this user
    const requestsRef = collection(db, "requests");
    const userRequestsQuery = query(
      requestsRef,
      where("NomineeID", "==", userId)
    );
    const userRequests = await getDocs(userRequestsQuery);

    // For each request, get its nomination and check the challenge ID
    for (const requestDoc of userRequests.docs) {
      const request = requestDoc.data() as Request;
      const nomination = await getNominationById(request.NominationID);
      
      if (nomination && nomination.ChallengeID === challengeId) {
        return {
          id: requestDoc.id,
          ...request
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting request for user and challenge:", error);
    return null;
  }
};

export const getDeedsByPrevId = async (prevDeedId: string): Promise<Deed[]> => {
  try {
    const deedsRef = collection(db, "deeds");
    const q = query(
      deedsRef,
      where("PrevDeedID", "==", prevDeedId)
    );
    
    const querySnapshot = await getDocs(q);
    const deeds = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Deed, "id">),
    }));

    return deeds;
  } catch (error) {
    console.error("Error getting deeds by previous deed ID:", error);
    return [];
  }
};

export const incrementAllPreviousDeedsContributions = async (deedId: string): Promise<void> => {
  try {
    let currentDeedId = deedId;
    
    while (currentDeedId) {
      // Get the current deed document
      const deedRef = doc(db, "deeds", currentDeedId);
      const deedSnap = await getDoc(deedRef);
      
      if (!deedSnap.exists()) {
        break;
      }
      
      const deedData = deedSnap.data();
      
      // Increment NumContributions
      await updateDoc(deedRef, {
        NumContributions: (deedData.NumContributions || 0) + 1
      });
      
      // Move to previous deed
      currentDeedId = deedData.PrevDeedID;
    }
  } catch (error) {
    console.error("Error incrementing previous deeds contributions:", error);
  }
};

export type { User, Nomination, Request, Challenge, Deed };
