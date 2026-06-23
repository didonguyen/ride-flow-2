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
      trip_role: "owner" | "planner" | "member" | "viewer";
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
          cover_image_url: string | null;
          cover_image_path: string | null;
          transport: string;
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
          cover_image_url?: string | null;
          cover_image_path?: string | null;
          transport?: string;
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
      memory_entries: {
        Row: {
          id: string;
          trip_id: string;
          created_by: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          created_by: string;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["memory_entries"]["Insert"]>;
      };
      memory_assets: {
        Row: {
          id: string;
          memory_entry_id: string;
          trip_id: string;
          uploaded_by: string;
          image_url: string;
          image_path: string;
          alt_text: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          memory_entry_id: string;
          trip_id: string;
          uploaded_by: string;
          image_url: string;
          image_path: string;
          alt_text?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["memory_assets"]["Insert"]>;
      };
      expense_entries: {
        Row: {
          id: string;
          trip_id: string;
          title: string;
          amount: number;
          currency: string;
          category: string;
          paid_by_member_id: string;
          expense_date: string;
          notes: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          title: string;
          amount: number;
          currency?: string;
          category: string;
          paid_by_member_id: string;
          expense_date: string;
          notes?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["expense_entries"]["Insert"]>;
      };
      expense_participants: {
        Row: {
          id: string;
          expense_id: string;
          trip_id: string;
          trip_member_id: string;
          share_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          expense_id: string;
          trip_id: string;
          trip_member_id: string;
          share_amount: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["expense_participants"]["Insert"]>;
      };
      trip_stops: {
        Row: {
          id: string;
          trip_id: string;
          day_id: string;
          title: string;
          time: string | null;
          description: string;
          note: string;
          location_name: string | null;
          address: string | null;
          lat: number | null;
          lng: number | null;
          status: "action_needed" | "pinned";
          pinned_option_id: string | null;
          sort_order: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          day_id: string;
          title: string;
          time?: string | null;
          description?: string;
          note?: string;
          location_name?: string | null;
          address?: string | null;
          lat?: number | null;
          lng?: number | null;
          status?: "action_needed" | "pinned";
          pinned_option_id?: string | null;
          sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trip_stops"]["Insert"]>;
      };
      stop_options: {
        Row: {
          id: string;
          trip_id: string;
          stop_id: string;
          name: string;
          address: string | null;
          description: string | null;
          image_url: string | null;
          rating: number | null;
          price_level: number | null;
          distance_text: string | null;
          duration_text: string | null;
          google_place_id: string | null;
          google_maps_url: string | null;
          lat: number | null;
          lng: number | null;
          source: "ai" | "google_places" | "manual";
          status: "candidate" | "pinned" | "backup" | "removed";
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          stop_id: string;
          name: string;
          address?: string | null;
          description?: string | null;
          image_url?: string | null;
          rating?: number | null;
          price_level?: number | null;
          distance_text?: string | null;
          duration_text?: string | null;
          google_place_id?: string | null;
          google_maps_url?: string | null;
          lat?: number | null;
          lng?: number | null;
          source: "ai" | "google_places" | "manual";
          status?: "candidate" | "pinned" | "backup" | "removed";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stop_options"]["Insert"]>;
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
