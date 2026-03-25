export type DeviceStatus = "online" | "offline";

export interface DevicePublic {
  deviceId: string;
  name?: string;
  status: DeviceStatus;
  lastSeen: string | null;
  firmwareVersion?: string;
  createdAt: string;
  updatedAt: string;
}
