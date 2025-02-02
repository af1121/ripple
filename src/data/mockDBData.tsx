// Use functions from firebase_functions to create and populate the database with mock data which connect wwith each other
import { addDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import type {
  User,
  Challenge,
  Nomination,
  Request,
  Deed,
} from "../firebase_functions";

// Mock Users
const mockUsers: Omit<User, "id">[] = [
  {
    Username: "John Doe", // Our main test user
    Password: "password123",
  },
  {
    Username: "Amy Smith",
    Password: "password456",
  },
  {
    Username: "Kenny Williams",
    Password: "password789",
  },
  {
    Username: "Ali Khan",
    Password: "password101",
  },
];

// Group 1: 11 users
const mockUsersGroup1: Omit<User, "id">[] = [
  {
    Username: "Sarah Johnson",
    Password: "pass123",
  },
  {
    Username: "Michael Chen",
    Password: "pass234", 
  },
  {
    Username: "Emma Wilson",
    Password: "pass345",
  },
  {
    Username: "David Lee",
    Password: "pass456",
  },
  {
    Username: "Sofia Garcia",
    Password: "pass567",
  },
  {
    Username: "James Taylor",
    Password: "pass678",
  },
  {
    Username: "Olivia Brown",
    Password: "pass789",
  },
  {
    Username: "Lucas Martinez",
    Password: "pass890",
  },
  {
    Username: "Isabella Kim",
    Password: "pass901",
  },
  {
    Username: "William Davis",
    Password: "pass012",
  },
  {
    Username: "Ava Anderson",
    Password: "pass321",
  },
];

// Group 2: 20 users
const mockUsersGroup2: Omit<User, "id">[] = [
  {
    Username: "Ethan Murphy",
    Password: "group2pass1",
  },
  {
    Username: "Mia Thompson",
    Password: "group2pass2",
  },
  {
    Username: "Alexander Wright",
    Password: "group2pass3",
  },
  {
    Username: "Charlotte King",
    Password: "group2pass4",
  },
  {
    Username: "Daniel Lopez",
    Password: "group2pass5",
  },
  {
    Username: "Sophie Turner",
    Password: "group2pass6",
  },
  {
    Username: "Henry White",
    Password: "group2pass7",
  },
  {
    Username: "Victoria Scott",
    Password: "group2pass8",
  },
  {
    Username: "Benjamin Green",
    Password: "group2pass9",
  },
  {
    Username: "Zoe Baker",
    Password: "group2pass10",
  },
  {
    Username: "Christopher Hall",
    Password: "group2pass11",
  },
  {
    Username: "Lily Adams",
    Password: "group2pass12",
  },
  {
    Username: "Nathan Young",
    Password: "group2pass13",
  },
  {
    Username: "Grace Allen",
    Password: "group2pass14",
  },
  {
    Username: "Andrew Hill",
    Password: "group2pass15",
  },
  {
    Username: "Chloe Rivera",
    Password: "group2pass16",
  },
  {
    Username: "Ryan Cooper",
    Password: "group2pass17",
  },
  {
    Username: "Hannah Morgan",
    Password: "group2pass18",
  },
  {
    Username: "Jack Phillips",
    Password: "group2pass19",
  },
  {
    Username: "Scarlett Ross",
    Password: "group2pass20",
  },
];

// Group 3: 32 users
const mockUsersGroup3: Omit<User, "id">[] = [
  {
    Username: "Leo Bennett",
    Password: "group3pass1",
  },
  {
    Username: "Aria Wood",
    Password: "group3pass2",
  },
  {
    Username: "Mason Price",
    Password: "group3pass3",
  },
  {
    Username: "Luna Stewart",
    Password: "group3pass4",
  },
  {
    Username: "Owen Morris",
    Password: "group3pass5",
  },
  {
    Username: "Nora Sanders",
    Password: "group3pass6",
  },
  {
    Username: "Gabriel Barnes",
    Password: "group3pass7",
  },
  {
    Username: "Layla Fisher",
    Password: "group3pass8",
  },
  {
    Username: "Miles Howard",
    Password: "group3pass9",
  },
  {
    Username: "Aurora Russell",
    Password: "group3pass10",
  },
  {
    Username: "Felix Hayes",
    Password: "group3pass11",
  },
  {
    Username: "Ruby Graham",
    Password: "group3pass12",
  },
  {
    Username: "Atlas Sullivan",
    Password: "group3pass13",
  },
  {
    Username: "Hazel Murray",
    Password: "group3pass14",
  },
  {
    Username: "Caleb Foster",
    Password: "group3pass15",
  },
  {
    Username: "Nova Powell",
    Password: "group3pass16",
  },
  {
    Username: "Theo Henderson",
    Password: "group3pass17",
  },
  {
    Username: "Iris Coleman",
    Password: "group3pass18",
  },
  {
    Username: "Jasper Jenkins",
    Password: "group3pass19",
  },
  {
    Username: "Willow Perry",
    Password: "group3pass20",
  },
  {
    Username: "August Long",
    Password: "group3pass21",
  },
  {
    Username: "Violet Patterson",
    Password: "group3pass22",
  },
  {
    Username: "River Hughes",
    Password: "group3pass23",
  },
  {
    Username: "Sage Washington",
    Password: "group3pass24",
  },
  {
    Username: "Finn Butler",
    Password: "group3pass25",
  },
  {
    Username: "Eden Brooks",
    Password: "group3pass26",
  },
  {
    Username: "Kai Simmons",
    Password: "group3pass27",
  },
  {
    Username: "Juniper Foster",
    Password: "group3pass28",
  },
  {
    Username: "Ash Hamilton",
    Password: "group3pass29",
  },
  {
    Username: "Wren Marshall",
    Password: "group3pass30",
  },
  {
    Username: "Phoenix Grant",
    Password: "group3pass31",
  },
  {
    Username: "Sky Johnston",
    Password: "group3pass32",
  },
];

// Maps to store user IDs
const mockUsersMap = new Map<string, string>();
const mockUsersGroup1Map = new Map<string, string>();
const mockUsersGroup2Map = new Map<string, string>();
const mockUsersGroup3Map = new Map<string, string>();

// Function to add users and store their IDs
const addUsersToDb = async () => {
  // Add original mock users
  for (const user of mockUsers) {
    const userRef = await addDoc(collection(db, "Users"), user);
    mockUsersMap.set(user.Username, userRef.id);
  }

  // Add group 1 users
  for (const user of mockUsersGroup1) {
    const userRef = await addDoc(collection(db, "Users"), user);
    mockUsersGroup1Map.set(user.Username, userRef.id);
  }

  // Add group 2 users
  for (const user of mockUsersGroup2) {
    const userRef = await addDoc(collection(db, "Users"), user);
    mockUsersGroup2Map.set(user.Username, userRef.id);
  }

  // Add group 3 users
  for (const user of mockUsersGroup3) {
    const userRef = await addDoc(collection(db, "Users"), user);
    mockUsersGroup3Map.set(user.Username, userRef.id);
  }
};


// Mock Challenges Group 2
const mockChallengesGroup2: Omit<Challenge, "id">[] = [
  {
    Title: "10 Pushups Challenge",
    Description: "Complete 10 pushups daily to build strength and discipline.",
    CoverImage: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00",
    StartedBy: "", // Will be set dynamically
    CauseName: "Fitness for All",
    CauseURL: "https://example.com/fitness",
    StartedAt: new Date("2024-03-01"),
  },
  {
    Title: "Plant a Tree",
    Description: "Make our planet greener by planting a tree in your community.",
    CoverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
    StartedBy: "", // Will be set dynamically
    CauseName: "Green Earth Initiative",
    CauseURL: "https://example.com/green-earth",
    StartedAt: new Date("2024-03-15"),
  },
  {
    Title: "Help the Homeless",
    Description: "Support homeless individuals by donating essential items or funds.",
    CoverImage: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6",
    StartedBy: "", // Will be set dynamically
    CauseName: "Homeless Support Network",
    CauseURL: "https://example.com/homeless-support",
    StartedAt: new Date("2024-03-10"),
  },
  {
    Title: "Coffee Kindness",
    Description: "Spread joy by buying a coffee for a stranger or someone in need.",
    CoverImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    StartedBy: "", // Will be set dynamically
    CauseName: "Random Acts of Kindness",
    CauseURL: "https://example.com/kindness",
    StartedAt: new Date("2024-03-05"),
  },
  {
    Title: "Volunteer Your Time",
    Description: "Give back to your community by volunteering at local organizations.",
    CoverImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433",
    StartedBy: "", // Will be set dynamically
    CauseName: "Community Service Initiative",
    CauseURL: "https://example.com/volunteer",
    StartedAt: new Date("2024-03-20"),
  },
];

// Create pushup challenge and assign to John Doe
let pushupChallengeId = "";
const createPushupChallenge = async () => {
  const challengeRef = await addDoc(collection(db, "challenges"), {
    ...mockChallengesGroup2[0],
    StartedBy: mockUsersMap.get("John Doe")
  });
  pushupChallengeId = challengeRef.id;
};

// Create deeds for all group 3 users for the pushup challenge
const createGroup3PushupDeeds = async () => {
  // Get all users from group 3
  const usersSnapshot = await getDocs(collection(db, "users"));
  const group3UserIds = usersSnapshot.docs
    .filter(doc => mockUsersGroup3.some(mockUser => mockUser.Username === doc.data().Username))
    .map(doc => doc.id);

  // Create a deed for each user
  for (const userId of group3UserIds) {
    await addDoc(collection(db, "deeds"), {
      ChallengeID: pushupChallengeId,
      UserID: userId,
      CompletedAt: new Date(),
      Description: "Completed 10 pushups challenge",
      ImageURL: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00",
      Verified: true
    });
  }
};


// Create tree planting challenge and assign to Amy Smith
let treeChallengeId = "";
const createTreeChallenge = async () => {
  const challengeRef = await addDoc(collection(db, "challenges"), {
    ...mockChallengesGroup2[1], // Tree planting challenge
    StartedBy: mockUsersMap.get("Amy Smith")
  });
  treeChallengeId = challengeRef.id;
};

// Create deeds for all group 1 users for Amy's tree challenge
const createGroup1TreeDeeds = async () => {
  // Get all users from group 1
  const usersSnapshot = await getDocs(collection(db, "users"));
  const group1UserIds = usersSnapshot.docs
    .filter(doc => mockUsersGroup1.some(mockUser => mockUser.Username === doc.data().Username))
    .map(doc => doc.id);

  // Also add Amy's deed
  const userIds = [...group1UserIds, mockUsersMap.get("Amy Smith")];

  // Create a deed for each user
  for (const userId of userIds) {
    await addDoc(collection(db, "deeds"), {
      ChallengeID: treeChallengeId,
      UserID: userId,
      CompletedAt: new Date(),
      Description: "Planted a tree in my community",
      ImageURL: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
      Verified: true
    });
  }
};

// Create nomination from Amy for the tree challenge
let treeNominationId = "";
const createTreeNomination = async () => {
  const nominationRef = await addDoc(collection(db, "nominations"), {
    Nominator: mockUsersMap.get("Amy Smith"),
    ChallengeID: treeChallengeId,
    StartedAt: new Date(),
    Icon: "tree"
  });
  treeNominationId = nominationRef.id;
};

// Create request for John Doe
const createTreeRequest = async () => {
  await addDoc(collection(db, "requests"), {
    NominationID: treeNominationId,
    NomineeID: mockUsersMap.get("John Doe"),
    Active: false
  });
};

// Assign 3rd challenge (Daily Reading) to Kenny and store ID
let readingChallengeId = "";
const createReadingChallenge = async () => {
  const challengeRef = await addDoc(collection(db, "challenges"), {
    Title: "Daily Reading Challenge",
    Description: "Read for at least 30 minutes every day to improve literacy.",
    CoverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    StartedBy: mockUsersMap.get("Kenny Williams"),
    CauseName: "Education for All", 
    CauseURL: "https://example.com/education",
    StartedAt: new Date("2024-03-10")
  });
  readingChallengeId = challengeRef.id;
};

// Create deeds for group 2 users for Kenny's reading challenge
const createGroup2ReadingDeeds = async () => {
  // Get all users from group 2
  const usersSnapshot = await getDocs(collection(db, "users"));
  const group2UserIds = usersSnapshot.docs
    .filter(doc => mockUsersGroup2.some(mockUser => mockUser.Username === doc.data().Username))
    .map(doc => doc.id);

  // Also add Kenny's deed
  const userIds = [...group2UserIds, mockUsersMap.get("Kenny Williams")];

  // Create a deed for each user
  for (const userId of userIds) {
    await addDoc(collection(db, "deeds"), {
      ChallengeID: readingChallengeId,
      UserID: userId,
      CompletedAt: new Date(),
      Description: "Read for 30 minutes today",
      ImageURL: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
      Verified: true
    });
  }
};

// Create nomination from Kenny for the reading challenge
let readingNominationId = "";
const createReadingNomination = async () => {
  const nominationRef = await addDoc(collection(db, "nominations"), {
    Nominator: mockUsersMap.get("Kenny Williams"),
    ChallengeID: readingChallengeId,
    StartedAt: new Date(),
    Icon: "book"
  });
  readingNominationId = nominationRef.id;
};

// Create active request for John Doe
const createReadingRequest = async () => {
  await addDoc(collection(db, "requests"), {
    NominationID: readingNominationId,
    NomineeID: mockUsersMap.get("John Doe"),
    Active: true
  });
};

// Assign 4th challenge (Beach Cleanup) to Ali and store ID
let beachCleanupChallengeId = "";
const createBeachCleanupChallenge = async () => {
  const challengeRef = await addDoc(collection(db, "challenges"), {
    Title: "Beach Cleanup Drive",
    Description: "Help keep our beaches clean and protect marine life.",
    CoverImage: "https://images.unsplash.com/photo-beach-cleanup",
    StartedBy: mockUsersMap.get("Ali Khan"),
    CauseName: "Ocean Conservation",
    CauseURL: "https://example.com/ocean",
    StartedAt: new Date("2024-03-05")
  });
  beachCleanupChallengeId = challengeRef.id;
};

// Create deeds for all groups and John Doe for Ali's beach cleanup challenge
const createBeachCleanupDeeds = async () => {
  // Get users from all groups
  const usersSnapshot = await getDocs(collection(db, "users"));
  
  const group1UserIds = usersSnapshot.docs
    .filter(doc => mockUsersGroup1.some(mockUser => mockUser.Username === doc.data().Username))
    .map(doc => doc.id);
  
  const group2UserIds = usersSnapshot.docs
    .filter(doc => mockUsersGroup2.some(mockUser => mockUser.Username === doc.data().Username))
    .map(doc => doc.id);
    
  const group3UserIds = usersSnapshot.docs
    .filter(doc => mockUsersGroup3.some(mockUser => mockUser.Username === doc.data().Username))
    .map(doc => doc.id);

  // Combine all users including Ali and John Doe
  const userIds = [
    ...group1UserIds,
    ...group2UserIds,
    ...group3UserIds,
    mockUsersMap.get("Ali Khan"),
    mockUsersMap.get("John Doe")
  ];

  // Create a deed for each user
  for (const userId of userIds) {
    await addDoc(collection(db, "deeds"), {
      ChallengeID: beachCleanupChallengeId,
      UserID: userId,
      CompletedAt: new Date(),
      Description: "Participated in beach cleanup",
      ImageURL: "https://images.unsplash.com/photo-beach-cleanup",
      Verified: true
    });
  }
};

// Function to populate database with all mock data
export const populateDatabase = async () => {
  try {
    // First add all users and store their IDs in maps
    await addUsersToDb();
    console.log("Added all users");

    // Create pushup challenge and related deeds
    await createPushupChallenge();
    await createGroup3PushupDeeds();
    console.log("Created pushup challenge and deeds");

    // Create tree planting challenge and related deeds
    await createTreeChallenge();
    await createGroup1TreeDeeds();
    await createTreeNomination();
    await createTreeRequest();
    console.log("Created tree planting challenge, deeds, nomination and request");

    // Create beach cleanup challenge and related deeds
    await createBeachCleanupChallenge();
    await createBeachCleanupDeeds();
    console.log("Created beach cleanup challenge and deeds");

    // Create Amy's reading challenge and related deeds
    await createReadingChallenge();
    await createGroup2ReadingDeeds();
    await createReadingNomination();
    await createReadingRequest();
    console.log("Created reading challenge, deeds, nomination and request");

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
};



export const clearDatabase = async () => {
  try {
    // Delete all documents from each collection
    const collections = [
      "users",
      "challenges",
      "nominations",
      "requests",
      "deeds",
    ];

    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      console.log(`Deleted all documents from ${collectionName}`);
    }

    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
};
