export interface DashboardStats {
  appointmentsToday: number;
  pendingRequests: number;
  totalPatients: number;
}

export interface DashboardData {
  schedule: any[];
  stats: DashboardStats;
}