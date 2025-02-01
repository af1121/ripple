import { Challenge, Participant, UserImpact } from '@/types'

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "30 Days of Fitness",
    description: "Join the fitness revolution! Complete 30 days of progressive workouts.",
    startDate: "2024-03-01",
    endDate: "2024-03-30",
    participants: 1234,
    location: "Global",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80",
    charityName: "Global Health Foundation",
    charityUrl: "https://example.com/charity"
  },
  {
    id: "2",
    title: "Plant a Tree Challenge",
    description: "Help combat climate change by planting trees in your community.",
    startDate: "2024-03-15",
    participants: 567,
    location: "Worldwide",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
  }
]

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: "1",
    userName: "John Doe",
    location: { lat: 40.7128, lng: -74.0060 }, // New York
    createdAt: "2024-03-01T12:00:00Z",
  },
  {
    id: "2",
    userName: "Jane Smith",
    location: { lat: 51.5074, lng: -0.1278 }, // London
    createdAt: "2024-03-02T15:30:00Z",
  },
  {
    id: "3",
    userName: "Maria Garcia",
    location: { lat: 48.8566, lng: 2.3522 }, // Paris
    createdAt: "2024-03-03T09:15:00Z",
  },
  {
    id: "4",
    userName: "Yuki Tanaka",
    location: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    createdAt: "2024-03-03T16:45:00Z",
  },
  {
    id: "5",
    userName: "Sarah Wilson",
    location: { lat: -33.8688, lng: 151.2093 }, // Sydney
    createdAt: "2024-03-04T03:20:00Z",
  },
  {
    id: "6",
    userName: "Hans Mueller",
    location: { lat: 52.5200, lng: 13.4050 }, // Berlin
    createdAt: "2024-03-04T10:00:00Z",
  },
  {
    id: "7",
    userName: "Carlos Rodriguez",
    location: { lat: 19.4326, lng: -99.1332 }, // Mexico City
    createdAt: "2024-03-05T14:30:00Z",
  },
  {
    id: "8",
    userName: "Li Wei",
    location: { lat: 31.2304, lng: 121.4737 }, // Shanghai
    createdAt: "2024-03-06T08:45:00Z",
  }
]

export const MOCK_USER_IMPACT: UserImpact = {
  goodDeeds: 596,
  challengesJoined: 12,
  peopleInspired: 248
} 