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
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      trips: {
        Row: {
          id: string;
          name: string;
          destination: string;
          start_date: string;
          end_date: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          destination: string;
          start_date: string;
          end_date: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trips"]["Insert"]>;
      };
      trip_members: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string | null;
          invited_email: string;
          role: Database["public"]["Enums"]["trip_role"];
          invite_status: Database["public"]["Enums"]["invite_status"];
          created_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id?: string | null;
          invited_email?: string;
          role: Database["public"]["Enums"]["trip_role"];
          invite_status?: Database["public"]["Enums"]["invite_status"];
          created_at?: string;
          accepted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["trip_members"]["Insert"]>;
      };
      trip_days: {
        Row: {
          id: string;
          trip_id: string;
          date: string;
          day_index: number;
        };
        Insert: {
          id?: string;
          trip_id: string;
          date: string;
          day_index: number;
        };
        Update: Partial<Database["public"]["Tables"]["trip_days"]["Insert"]>;
      };
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
        Insert: {
          id?: string;
          trip_id: string;
          trip_day_id: string;
          start_time: string;
          duration_minutes: number;
          title: string;
          notes?: string;
          place_source?: Database["public"]["Enums"]["place_source"] | null;
          place_source_id?: string | null;
          place_name?: string | null;
          place_address?: string | null;
          place_lat?: number | null;
          place_lng?: number | null;
          place_external_url?: string | null;
          updated_by?: never;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["timeline_items"]["Insert"], "updated_by">> & {
          updated_by?: never;
        };
      };
      ai_draft_runs: {
        Row: {
          id: string;
          trip_id: string;
          requested_by: string;
          prompt: string;
          status: Database["public"]["Enums"]["ai_draft_status"];
          validated_summary: Json | null;
          raw_response: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          requested_by: string;
          prompt?: string;
          status?: Database["public"]["Enums"]["ai_draft_status"];
          validated_summary?: Json | null;
          raw_response?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_draft_runs"]["Insert"]>;
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
