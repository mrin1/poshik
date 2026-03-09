export interface PlatformEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  type: string;
}

export interface KYCApplication {
  id: string;
  full_name: string;
  role: "OWNER" | "DOCTOR" | "SHOP" | "ADMIN" | "SUPER-ADMIN";
  email: string;
  kyc_status: "PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED";
  kyc_document_url: string | null;
  created_at: string;
  phone?: string;
  address?: string;
}


export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  status: "ACTIVE" | "BANNED";
  reports: number;
}


export interface RecentUser {
  id: string;
  name: string;
  role: string;
  date: string;
  status: string;
}

export interface PlatformStats {
  totalUsers: number;
  pendingKyc: number;
  activeEvents: number;
  monthlyRevenue: number;
}
