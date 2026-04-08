export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  tags: string[];
  image: string;
  latitude: number;
  longitude: number;
}

export interface Activity {
  id: string;
  destinationId: string;
  name: string;
  category: string;
  duration: string;
  shift: 'morning' | 'afternoon' | 'evening';
  description: string;
  address: string;
  tips: string;
  images: string[];
  latitude: number;
  longitude: number;
}
