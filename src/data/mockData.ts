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
    causeName: "Global Health Foundation",
    causeURL: "https://example.com/cause"
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
    location: { lat: 40.7128, lng: -74.0060 }, // New York, USA
    createdAt: "2024-03-01T12:00:00Z",
  },
  {
    id: "2",
    userName: "Jane Smith",
    location: { lat: 51.5074, lng: -0.1278 }, // London, UK
    createdAt: "2024-03-02T15:30:00Z",
  },
  {
    id: "3",
    userName: "Maria Garcia",
    location: { lat: -33.8688, lng: 151.2093 }, // Sydney, Australia
    createdAt: "2024-03-03T09:15:00Z",
  },
  {
    id: "4",
    userName: "Yuki Tanaka",
    location: { lat: 35.6762, lng: 139.6503 }, // Tokyo, Japan
    createdAt: "2024-03-03T16:45:00Z",
  },
  {
    id: "5",
    userName: "Sarah Wilson",
    location: { lat: -1.2921, lng: 36.8219 }, // Nairobi, Kenya
    createdAt: "2024-03-04T03:20:00Z",
  },
  {
    id: "6",
    userName: "Hans Mueller",
    location: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires, Argentina
    createdAt: "2024-03-04T10:00:00Z",
  },
  {
    id: "7",
    userName: "Carlos Rodriguez",
    location: { lat: 55.7558, lng: 37.6173 }, // Moscow, Russia
    createdAt: "2024-03-05T14:30:00Z",
  },
  {
    id: "8",
    userName: "Li Wei",
    location: { lat: 1.3521, lng: 103.8198 }, // Singapore
    createdAt: "2024-03-06T08:45:00Z",
  },
  {
    id: "9",
    userName: "Ahmed Hassan",
    location: { lat: 30.0444, lng: 31.2357 }, // Cairo, Egypt
    createdAt: "2024-03-07T11:20:00Z",
  },
  {
    id: "10",
    userName: "Isabella Santos",
    location: { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro, Brazil
    createdAt: "2024-03-08T13:15:00Z",
  },
  {
    id: "11",
    userName: "Raj Patel",
    location: { lat: 19.0760, lng: 72.8777 }, // Mumbai, India
    createdAt: "2024-03-09T07:30:00Z",
  },
  {
    id: "12",
    userName: "Sofia Martinez",
    location: { lat: 19.4326, lng: -99.1332 }, // Mexico City, Mexico
    createdAt: "2024-03-10T16:45:00Z",
  }
]

export const MOCK_USER_IMPACT: UserImpact = {
  goodDeeds: 596,
  challengesJoined: 12,
  peopleInspired: 248
} 