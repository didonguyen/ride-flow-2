import type {
  RealtimeStatus,
  SubscribeTripRealtimeInput,
  TripRealtimeChannel,
  TripRealtimeEvent,
  TripRealtimeListener
} from "@/src/application/realtime/types";

export type SubscribeResult = {
  events: TripRealtimeEvent[];
  status: () => RealtimeStatus;
  unsubscribe: () => void;
};

const tables: Array<"timeline_items" | "trip_members" | "trips"> = [
  "timeline_items",
  "trip_members",
  "trips"
];

const tableToEventType: Record<
  (typeof tables)[number],
  TripRealtimeEvent["type"]
> = {
  timeline_items: "timeline.changed",
  trip_members: "members.changed",
  trips: "trip.changed"
};

export function subscribeTripRealtime(
  input: SubscribeTripRealtimeInput
): SubscribeResult {
  const events: TripRealtimeEvent[] = [];
  let status: RealtimeStatus = "idle";
  let channel: TripRealtimeChannel | null = null;
  let pollHandle: ReturnType<typeof setInterval> | null = null;

  const updateStatus = (next: RealtimeStatus) => {
    status = next;
  };

  const startPolling = () => {
    if (!input.poll || pollHandle) {
      return;
    }
    pollHandle = setInterval(() => {
      input.poll?.().catch(() => undefined);
    }, input.pollIntervalMs ?? 8000);
  };

  const stopPolling = () => {
    if (pollHandle) {
      clearInterval(pollHandle);
      pollHandle = null;
    }
  };

  if (!input.client) {
    updateStatus("reconnecting");
    startPolling();
    return {
      events,
      status: () => status,
      unsubscribe: () => {
        stopPolling();
      }
    };
  }

  updateStatus("connecting");

  const fire = (event: TripRealtimeEvent) => {
    events.push(event);
  };

  try {
    const rawChannel = input.client.channel(`trip:${input.tripId}`);
    let builtChannel: TripRealtimeChannel = rawChannel;

    tables.forEach((table) => {
      const eventType = tableToEventType[table];
      const listener: TripRealtimeListener = () => {
        fire({ type: eventType, tripId: input.tripId });
      };
      builtChannel = builtChannel.on(table, listener);
    });

    channel = builtChannel.subscribe();
    updateStatus("connected");
  } catch (error) {
    updateStatus("failed");
    startPolling();
  }

  return {
    events,
    status: () => status,
    unsubscribe: () => {
      try {
        channel?.unsubscribe();
      } catch (error) {
        // ignore cleanup errors
      }
      stopPolling();
    }
  };
}
