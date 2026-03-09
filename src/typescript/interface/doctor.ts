export interface Appointment {
  id: string;
  petName: string;
  breed: string;
  ownerName: string;
  date: string;
  time: string;
  type: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  isOnline: boolean;
}