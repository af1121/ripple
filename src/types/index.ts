export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  participants: number;
  location: string;
  imageUrl: string;
  charityName?: string;
  charityUrl?: string;
}

export interface Participant {
  id: string;
  userName: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface UserImpact {
  goodDeeds: number;
  challengesJoined: number;
  peopleInspired: number;
} 