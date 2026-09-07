export interface PanicAlertSatpam {
  uuid: string;
  nama: string;
  nip: string;
}

export interface PanicAlertData {
  uuid: string;
  status: "active" | "handled" | "resolved";
  lat: number;
  lng: number;
  satpam: PanicAlertSatpam;
  client: string;
  created_at: string;
  updated_at: string;
}

export interface PanicAlertActiveResponse {
  data: PanicAlertData[];
  meta: {
    active: number;
    polled_at: string;
  };
}

export interface PanicAlertsResponse {
  data: PanicAlertData[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}
