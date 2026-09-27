export type TravelMode = 'TRANSIT' | 'WALKING' | 'DRIVING';

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  travelMode: string;
  transitDetails?: {
    lineName: string;
    vehicleType: string;
    departureStop: string;
    arrivalStop: string;
    numStops: number;
    color?: string;
  };
}

export interface RouteResult {
  summary: string;
  duration: string;
  distance: string;
  departureTime?: string;
  arrivalTime?: string;
  fare?: string;
  steps: RouteStep[];
  googleMapsUrl: string;
}

export interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
}

export const PRESET_ORIGINS: LocationPoint[] = [
  { name: '✈️ 나리타공항 제1터미널', lat: 35.7652, lng: 140.3863 },
  { name: '✈️ 나리타공항 제2·3터미널', lat: 35.7725, lng: 140.3875 },
  { name: '🚆 게이세이 우에노역', lat: 35.7119, lng: 139.7744 },
  { name: '🗼 도쿄역 (마루노우치)', lat: 35.6812, lng: 139.7671 },
  { name: '🏙️ 신주쿠역', lat: 35.6896, lng: 139.7006 },
  { name: '⚡ 시부야역', lat: 35.6580, lng: 139.7016 },
  { name: '⛩️ 아사쿠사역', lat: 35.7126, lng: 139.7975 },
];
