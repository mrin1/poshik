export interface AppointmentActionsProps {
  id: string;
  status: string;
  onUpdateStatus: (id: string, status: string) => void;
}