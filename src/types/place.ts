// types/place.ts
export interface PlaceData {
  name: string;
  description?: string;
  customFilename?: string;
  [key: string]: any; // optional: allows other dynamic fields
}

export interface PlaceWithImage extends PlaceData {
  imageUrl: string | null;
}
