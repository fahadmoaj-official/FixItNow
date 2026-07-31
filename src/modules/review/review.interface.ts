export interface ReviewPayload {
  rating: number;
  comment?: string;
  bookingId: string;
  technicianId: string;
  reviewerId: string;
}