// Use functions from firebase_functions to create and populate the database with mock data which connect wwith each other
import { addDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { User, Challenge, Nomination, Request, Deed } from "../firebase_functions";

// Mock Users
const mockUsers: Omit<User, "id">[] = [
  {
    Username: "JohnDoe", // Our main test user
    Password: "password123"
  },
  {
    Username: "JaneSmith",
    Password: "password456"
  },
  {
    Username: "BobWilson",
    Password: "password789"
  },
  {
    Username: "AliceJohnson", 
    Password: "password101"
  }
];

// Mock Challenges
const mockChallenges: Omit<Challenge, "id">[] = [
  {
    Title: "30 Days of Fitness",
    Description: "Join the fitness revolution! Complete 30 days of progressive workouts.",
    CoverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    StartedBy: "", // Will be set after user creation
    CauseName: "Global Health Foundation",
    CauseURL: "https://example.com/cause",
    StartedAt: new Date("2024-03-01")
  },
  {
    Title: "Plant a Tree Challenge",
    Description: "Help combat climate change by planting trees in your community.",
    CoverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
    StartedBy: "", // Will be set after user creation
    CauseName: "Environmental Protection Fund", 
    CauseURL: "https://example.com/environment",
    StartedAt: new Date("2024-03-15")
  },
  {
    Title: "Daily Reading Challenge",
    Description: "Read for at least 30 minutes every day to improve literacy.",
    CoverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    StartedBy: "", // Will be set after user creation
    CauseName: "Education for All",
    CauseURL: "https://example.com/education", 
    StartedAt: new Date("2024-03-10")
  }
];

export const populateDatabase = async () => {
  try {
    // Add Users
    const userRefs = await Promise.all(
      mockUsers.map(user => 
        addDoc(collection(db, "users"), user)
      )
    );
    console.log("Added users:", userRefs.map(ref => ref.id));

    const mainUserRef = userRefs[0]; // JohnDoe is our main test user

    // Add Challenges with real user references
    const challengesWithUsers = mockChallenges.map((challenge, index) => ({
      ...challenge,
      StartedBy: userRefs[index % userRefs.length].id
    }));
    
    const challengeRefs = await Promise.all(
      challengesWithUsers.map(challenge =>
        addDoc(collection(db, "challenges"), challenge)
      )
    );
    console.log("Added challenges:", challengeRefs.map(ref => ref.id));

    // Create nominations targeting our main user
    const mockNominations: Omit<Nomination, "id">[] = [
      {
        Nominator: userRefs[1].id, // JaneSmith nominates
        ChallengeID: challengeRefs[0].id,
        StartedAt: new Date(),
        Icon: "dumbbell"
      },
      {
        Nominator: userRefs[2].id, // BobWilson nominates
        ChallengeID: challengeRefs[1].id,
        StartedAt: new Date(),
        Icon: "tree"
      },
      {
        Nominator: userRefs[3].id, // AliceJohnson nominates
        ChallengeID: challengeRefs[2].id,
        StartedAt: new Date(),
        Icon: "book"
      }
    ];

    const nominationRefs = await Promise.all(
      mockNominations.map(nomination =>
        addDoc(collection(db, "nominations"), nomination)
      )
    );

    // Create 3 active requests for our main user
    const mockRequests: Omit<Request, "id">[] = [
      {
        NominationID: nominationRefs[0].id,
        NomineeID: mainUserRef.id,
        Active: true
      },
      {
        NominationID: nominationRefs[1].id,
        NomineeID: mainUserRef.id,
        Active: true
      },
      {
        NominationID: nominationRefs[2].id,
        NomineeID: mainUserRef.id,
        Active: true
      }
    ];

    await Promise.all(
      mockRequests.map(request =>
        addDoc(collection(db, "requests"), request)
      )
    );

    // Create 10 deeds for our main user across the 3 challenges
    const mockDeeds: Omit<Deed, "id">[] = [
      // 4 fitness deeds
      ...Array(4).fill(null).map((_, i) => ({
        UserID: mainUserRef.id,
        ChallengeID: challengeRefs[0].id,
        Image: `https://example.com/fitness-deed-${i+1}.jpg`,
        Comment: `Day ${i+1} of fitness challenge complete! Feeling stronger!`,
        DoneAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // One deed per day
        Location: { lat: 40.7128, lng: -74.0060 }, // New York
        PrevDeedID: "",
        NextDeedID: "",
        NumContributions: i + 1
      })),
      
      // 3 tree planting deeds
      ...Array(3).fill(null).map((_, i) => ({
        UserID: mainUserRef.id,
        ChallengeID: challengeRefs[1].id,
        Image: `https://example.com/tree-deed-${i+1}.jpg`,
        Comment: `Planted tree #${i+1} today! Making our planet greener.`,
        DoneAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
        Location: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
        PrevDeedID: "",
        NextDeedID: "",
        NumContributions: i + 1
      })),

      // 3 reading deeds
      ...Array(3).fill(null).map((_, i) => ({
        UserID: mainUserRef.id,
        ChallengeID: challengeRefs[2].id,
        Image: `https://example.com/reading-deed-${i+1}.jpg`,
        Comment: `Finished chapter ${i+1} of my book! Learning so much.`,
        DoneAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
        Location: { lat: 41.8781, lng: -87.6298 }, // Chicago
        PrevDeedID: "",
        NextDeedID: "",
        NumContributions: i + 1
      }))
    ];

    await Promise.all(
      mockDeeds.map(deed =>
        addDoc(collection(db, "deeds"), deed)
      )
    );

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
};

export const clearDatabase = async () => {
  try {
    // Delete all documents from each collection
    const collections = ["users", "challenges", "nominations", "requests", "deeds"];
    
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`Deleted all documents from ${collectionName}`);
    }

    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
};