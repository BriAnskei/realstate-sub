export interface Land {
  _id?: number;
  name: string;
  location: string;
  totalArea: string;
  totalLots: number;
  available: number;
  lotsSold: number;
  createdAt?: string;
}
