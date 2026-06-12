export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Enums: {
      trip_role: "owner" | "planner" | "viewer";
      invite_status: "pending" | "accepted";
      place_source: "seed" | "osm" | "manual" | "google";
      ai_draft_status: "pending" | "completed" | "failed";
    };
    Tables: {
      timeline_items: {
        Row: {
          id: string;
          trip_id: string;
          trip_day_id: string;
          start_time: string;
          duration_minutes: number;
          title: string;
          notes: string;
          place_source: Database["public"]["Enums"]["place_source"] | null;
          place_source_id: string | null;
          place_name: string | null;
          place_address: string | null;
          place_lat: number | null;
          place_lng: number | null;
          place_external_url: string | null;
          updated_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["timeline_items"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["timeline_items"]["Insert"]>;
      };
    };
    Functions: {
      accept_trip_invite: {
        Args: { target_trip_id: string };
        Returns: void;
      };
    };
  };
};
