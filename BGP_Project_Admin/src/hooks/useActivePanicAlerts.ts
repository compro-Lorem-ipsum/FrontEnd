import { useState, useEffect, useCallback, useRef } from "react";
import { panicAlertService } from "../services/panicAlertService";
import type { PanicAlertData } from "../types/panicAlert";
import { getRole } from "../Utils/helpers";

export const useActivePanicAlerts = (intervalMs = 10000) => {
  const [activeAlert, setActiveAlert] = useState<PanicAlertData | null>(null);
  const dismissedAlertsRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchActiveAlerts = useCallback(async () => {
    try {
      const response = await panicAlertService.getActive();
      if (response && response.data && response.data.length > 0) {
        // Find the first alert that hasn't been dismissed
        const newAlert = response.data.find(
          (alert) => !dismissedAlertsRef.current.has(alert.uuid)
        );
        setActiveAlert(newAlert || null);
      } else {
        setActiveAlert(null);
      }
    } catch (error) {
      console.error("Error polling active panic alerts:", error);
    }
  }, []);

  useEffect(() => {
    const role = getRole();
    // Start polling as long as user is authenticated (has a role)
    if (role) {
      fetchActiveAlerts(); // Initial fetch
      intervalRef.current = setInterval(fetchActiveAlerts, intervalMs);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchActiveAlerts, intervalMs]);

  const dismissAlert = (uuid: string) => {
    dismissedAlertsRef.current.add(uuid);
    setActiveAlert(null);
    // Immediately check if there is another alert in the queue that hasn't been dismissed
    fetchActiveAlerts();
  };

  return {
    activeAlert,
    dismissAlert,
  };
};
