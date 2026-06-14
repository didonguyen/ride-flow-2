export type RealtimeStatus = "idle" | "connecting" | "connected" | "reconnecting" | "failed";

export type TripRealtimeEvent =
  | { type: "timeline.changed"; tripId: string }
  | { type: "members.changed"; tripId: string }
  | { type: "trip.changed"; tripId: string };

export type TripRealtimeListener = (event: TripRealtimeEvent) => void;

export interface TripRealtimeChannel {
  on(
    table: "timeline_items" | "trip_members" | "trips",
    listener: TripRealtimeListener
  ): TripRealtimeChannel;
  subscribe(): TripRealtimeChannel;
  unsubscribe(): void;
}

export interface TripRealtimeClient {
  channel(name: string): TripRealtimeChannel;
}

export type RealtimeSubscription = {
  status: RealtimeStatus;
  events: TripRealtimeEvent[];
  unsubscribe: () => void;
};

export type SubscribeTripRealtimeInput = {
  client: TripRealtimeClient | null;
  tripId: string;
  pollIntervalMs?: number;
  poll?: () => Promise<void>;
};
