import { Challenge, Nomination, User, Request } from "@/firebase_functions";
import { collection, getDocs, addDoc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

// First define challenges without IDs
const mockChallenges: Omit<Challenge, "id">[] = [
  {
    Title: "Random Acts of Kindness",
    Description:
      "Spread joy by performing one random act of kindness each day for a month.",
    CoverImage: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b",
    StartedBy: "",
    CauseName: "Mental Health Alliance",
    CauseURL: "https://example.com/mental-health",
    StartedAt: new Date("2024-03-10"),
  },
  {
    Title: "Zero Waste Challenge",
    Description:
      "Live waste-free for 30 days by refusing single-use plastics and minimizing trash.",
    CoverImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
    StartedBy: "",
    CauseName: "Ocean Conservation Society",
    CauseURL: "https://example.com/ocean",
    StartedAt: new Date("2024-03-20"),
  },
  {
    Title: "Learn a New Language",
    Description:
      "Commit to learning basic phrases in a new language over 60 days.",
    CoverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8",
    StartedBy: "",
    CauseName: "Global Education Fund",
    CauseURL: "https://example.com/education",
    StartedAt: new Date("2024-04-01"),
  },
  {
    Title: "Community Clean-up",
    Description:
      "Organize weekly neighborhood clean-ups to beautify our community.",
    CoverImage: "https://images.unsplash.com/photo-1554265352-d7fd5129be15",
    StartedBy: "",
    CauseName: "Local Environmental Action",
    CauseURL: "https://example.com/community",
    StartedAt: new Date("2024-04-05"),
  },
  {
    Title: "Tech-Free Evenings",
    Description:
      "Spend evenings without screens and reconnect with family and hobbies.",
    CoverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    StartedBy: "",
    CauseName: "Digital Wellness Institute",
    CauseURL: "https://example.com/digital-wellness",
    StartedAt: new Date("2024-04-15"),
  },
  {
    Title: "Food Donation Drive",
    Description:
      "Collect and donate non-perishable food items to local food banks.",
    CoverImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
    StartedBy: "",
    CauseName: "Hunger Relief Foundation",
    CauseURL: "https://example.com/hunger-relief",
    StartedAt: new Date("2024-04-20"),
  },
];

// Function to populate challenges with user IDs and send to Firebase
export const populateChallenges = async () => {
  try {
    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    })) as User[];

    // Find JohnDoe's ID
    const johnDoe = users.find((user) => user.Username === "JohnDoe");
    const janeSmith = users.find((user) => user.Username === "JaneSmith");
    const bobWilson = users.find((user) => user.Username === "BobWilson");

    if (!johnDoe || !janeSmith || !bobWilson) {
      throw new Error("Required users not found");
    }

    // Assign challenges to users
    const challengesWithUsers = mockChallenges.map((challenge, index) => {
      if (index < 3) {
        // First 3 challenges assigned to JohnDoe
        return { ...challenge, StartedBy: johnDoe.id };
      } else if (index === 3) {
        return { ...challenge, StartedBy: janeSmith.id };
      } else if (index === 4) {
        return { ...challenge, StartedBy: bobWilson.id };
      } else {
        return { ...challenge, StartedBy: janeSmith.id };
      }
    });

    // Add challenges to Firebase
    const challengesCollection = collection(db, "challenges");
    for (const challenge of challengesWithUsers) {
      await addDoc(challengesCollection, challenge);
    }

    console.log("Successfully populated challenges");
  } catch (error) {
    console.error("Error populating challenges:", error);
  }
};

export const populateDB = async () => {
    const JohnDooeID = "5UFtogUUwLOOvfJKoaCO";
    const AliceID = "WKnxa879eQpZW7ZEDIIi";
    const OpenSeaChallengeId = "0usmJmMIE4DTBlU92kT1";
    const LearnNewLanguageChallengeId = "KHgzKeY8nAiK3qewAiSp";

    // Delete specific requests and deeds
    try {
        // Get requests collection reference
        const requestsRef = collection(db, "requests");
        const deedsRef = collection(db, "deeds");

        // Query for 30 Days of Fitness request
        const fitnessRequestQuery = query(
            requestsRef,
            where("NomineeID", "==", JohnDooeID),
            where("ChallengeID", "==", "30DaysFitnessID")
        );
        
        // Delete the fitness request
        const fitnessRequestDocs = await getDocs(fitnessRequestQuery);
        fitnessRequestDocs.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        // Query for 30 Days of Fitness deed
        const fitnessDeedQuery = query(
            deedsRef,
            where("UserID", "==", JohnDooeID),
            where("ChallengeID", "==", "30DaysFitnessID")
        );
        
        // Delete the fitness deed
        const fitnessDeedDocs = await getDocs(fitnessDeedQuery);
        fitnessDeedDocs.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        // Query for Daily Reading deed
        const readingDeedQuery = query(
            deedsRef,
            where("UserID", "==", JohnDooeID),
            where("ChallengeID", "==", "DailyReadingID")
        );
        
        // Delete the reading deed
        const readingDeedDocs = await getDocs(readingDeedQuery);
        readingDeedDocs.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        console.log("Successfully deleted specified requests and deeds");
    } catch (error) {
        console.error("Error deleting documents:", error);
    }
}
