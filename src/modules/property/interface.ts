export type PropertyPayload = {
  title: string;
  description: string;
  address: string;
  city: string;
  area?: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  amenities?: string[];
  images?: string[];
  status?: "AVAILABLE" | "UNAVAILABLE";
  categoryId: string;
};
