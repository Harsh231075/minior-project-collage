export type AlertSeverity = "info" | "warn" | "critical";
export type AlertStatus = "active" | "ack" | "resolved" | "archived";

export type AlertType =
  | "LOW_MOISTURE"
  | "HIGH_TEMPERATURE"
  | "ABNORMAL_PH"
  | "RAIN_DETECTED"
  | "DEVICE_OFFLINE"
  | "SENSOR_FAULT";
