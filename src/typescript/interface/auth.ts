export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "OWNER" | "DOCTOR" | "SHOP" | "ADMIN" | "SUPER-ADMIN";
  kyc_status: "PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED";
  kyc_document_url: string | null;
  avatar_url?: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isRegistering: boolean;
  error: string | null;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<UserProfile>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    role: "OWNER" | "DOCTOR" | "SHOP" | "ADMIN" | "SUPER-ADMIN";
    kycDocument?: File | null;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile | null, session: any) => void;
  setLoading: (status: boolean) => void;
}
