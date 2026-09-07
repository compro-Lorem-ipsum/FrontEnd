export interface TrackingSessionAttendance {
  uuid: string;
  status: string;
  checked_in_at: string;
  checked_out_at: string;
  late_minutes: number;
  early_leave_minutes: number;
}

export interface TrackingSessionSatpam {
  uuid: string;
  nama: string;
  nip: string;
}

export interface TrackingSessionItem {
  uuid: string;
  status: string;
  work_date: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  duration_minutes: number;
  distance_meters: number;
  attendance: TrackingSessionAttendance;
  satpam: TrackingSessionSatpam;
  created_at: string;
}

export interface TrackingSessionDetail extends TrackingSessionItem {
  clean_polyline?: string;
}
