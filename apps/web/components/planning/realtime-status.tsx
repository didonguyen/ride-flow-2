"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Wifi, WifiOff } from "lucide-react";

import { subscribeTripRealtime } from "@/src/application/realtime/subscription";
import type {
  RealtimeStatus,
  TripRealtimeEvent
} from "@/src/application/realtime/types";
import { getPublicEnv } from "@/src/lib/env";

const statusCopy: Record<RealtimeStatus, { label: string; tone: string }> = {
  idle: { label: "Idle", tone: "bg-slate-100 text-slate-500 ring-slate-200" },
  connecting: {
    label: "Connecting…",
    tone: "bg-amber-50 text-amber-700 ring-amber-200"
  },
  connected: {
    label: "Live sync",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200"
  },
  reconnecting: {
    label: "Reconnecting",
    tone: "bg-amber-50 text-amber-700 ring-amber-200"
  },
  failed: { label: "Offline", tone: "bg-red-50 text-red-700 ring-red-200" }
};

type UseTripRealtimeOptions = {
  poll?: () => Promise<void>;
  pollIntervalMs?: number;
};

export function useTripRealtime(tripId: string, options: UseTripRealtimeOptions = {}) {
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [events, setEvents] = useState<TripRealtimeEvent[]>([]);

  useEffect(() => {
    if (!tripId) {
      return;
    }

    let client: ReturnType<typeof createBrowserClient> | null = null;

    try {
      const env = getPublicEnv();
      client = createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    } catch (error) {
      client = null;
    }

    const subscription = subscribeTripRealtime({
      client: client as unknown as Parameters<typeof subscribeTripRealtime>[0]["client"],
      tripId,
      poll: options.poll,
      pollIntervalMs: options.pollIntervalMs
    });

    const pollHandle = setInterval(() => {
      setStatus(subscription.status());
      const newEvents = subscription.events.splice(0);
      if (newEvents.length > 0) {
        setEvents((previous) => [...previous, ...newEvents].slice(-50));
      }
    }, 1500);

    return () => {
      clearInterval(pollHandle);
      subscription.unsubscribe();
    };
  }, [tripId, options.poll, options.pollIntervalMs]);

  return { events, status };
}

type RealtimeStatusPillProps = {
  status: RealtimeStatus;
};

export function RealtimeStatusPill({ status }: RealtimeStatusPillProps) {
  const copy = statusCopy[status];
  const Icon = status === "connected" ? Wifi : WifiOff;

  return (
    <span
      aria-live="polite"
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ring-1",
        copy.tone
      ].join(" ")}
      data-testid="realtime-status"
      data-status={status}
    >
      <Icon aria-hidden="true" className="h-3 w-3" />
      {copy.label}
    </span>
  );
}
