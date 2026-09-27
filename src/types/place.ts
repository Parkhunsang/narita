export type CategoryId = 
  | 'all'
  | 'my_stay'
  | 'sushi'
  | 'ramen'
  | 'meat'
  | 'izakaya'
  | 'cafe'
  | 'attraction'
  | 'shopping'
  | 'narita_special'
  | 'transit'
  | 'restaurant'
  | 'stay';

export type RegionId = 'all' | 'narita' | 'ueno_asakusa' | 'shinjuku_shibuya' | 'tokyo_ginza';

export interface Place {
  id: string;
  name: string;
  nameJa: string;
  nameEn: string;
  category: CategoryId;
  subCategory?: string;
  region: RegionId;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  address: string;
  addressJa: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  priceLevel: '₩' | '₩₩' | '₩₩₩' | '₩₩₩₩';
  businessHours: string;
  closedDay?: string;
  transitTip: string; // e.g., '나리타공항에서 스카이라이너로 41분'
  tags: string[];
  googleMapsUrl: string;
}

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  iconName: string;
  color: string;
}

export interface RegionInfo {
  id: RegionId;
  label: string;
  center: [number, number];
  zoom: number;
}
