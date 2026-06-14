import { describe, expect, it, vi } from "vitest";

import { subscribeTripRealtime } from "@/src/application/realtime/subscription";
import type {
  TripRealtimeChannel,
  TripRealtimeClient
} from "@/src/application/realtime/types";

function makeClient(): {
  client: TripRealtimeClient;
  events: { table: string; payload: unknown }[];
  channel: TripRealtimeChannel;
  unsubscribeSpy: ReturnType<typeof vi.fn>;
} {
  const events: { table: string; payload: unknown }[] = [];
  const unsubscribeSpy = vi.fn();

  const channel: TripRealtimeChannel = {
    on(table, listener) {
      events.push({ table, payload: listener });
      return channel;
    },
    subscribe() {
      return channel;
    },
    unsubscribe() {
      unsubscribeSpy();
    }
  };

  const client: TripRealtimeClient = {
    channel: vi.fn(() => channel)
  };

  return { client, events, channel, unsubscribeSpy };
}

describe("subscribeTripRealtime", () => {
  it("subscribes to trip-scoped timeline, members, and trip tables", () => {
    const { client, events, channel } = makeClient();
    const subscription = subscribeTripRealtime({
      client,
      tripId: "trip-1"
    });

    expect(events.map((entry) => entry.table)).toEqual([
      "timeline_items",
      "trip_members",
      "trips"
    ]);
    expect(subscription.status()).toBe("connected");

    subscription.unsubscribe();
    expect(channel).toBeDefined();
  });

  it("falls back to polling when no client is provided", () => {
    const poll = vi.fn(async () => undefined);
    const subscription = subscribeTripRealtime({
      client: null,
      tripId: "trip-1",
      poll,
      pollIntervalMs: 50
    });

    expect(subscription.status()).toBe("reconnecting");

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(poll).toHaveBeenCalled();
        subscription.unsubscribe();
        resolve();
      }, 80);
    });
  });

  it("marks the subscription failed when channel construction throws", () => {
    const client: TripRealtimeClient = {
      channel() {
        throw new Error("connection refused");
      }
    };

    const subscription = subscribeTripRealtime({
      client,
      tripId: "trip-1"
    });

    expect(subscription.status()).toBe("failed");
    subscription.unsubscribe();
  });
});
