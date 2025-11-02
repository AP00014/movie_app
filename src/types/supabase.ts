export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      games: {
        Row: {
          id: string
          title: string
          description: string | null
          genre: string[]
          platform: string[]
          release_date: string
          icon_url: string | null
          cover_url: string | null
          file_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          genre: string[]
          platform: string[]
          release_date: string
          icon_url?: string | null
          cover_url?: string | null
          file_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          genre?: string[]
          platform?: string[]
          release_date?: string
          icon_url?: string | null
          cover_url?: string | null
          file_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      movies: {
        Row: {
          id: string
          title: string
          description: string | null
          genre: string[]
          country: string
          release_date: string
          rating: number | null
          poster_url: string | null
          trailer_url: string | null
          file_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          genre: string[]
          country: string
          release_date: string
          rating?: number | null
          poster_url?: string | null
          trailer_url?: string | null
          file_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          genre?: string[]
          country?: string
          release_date?: string
          rating?: number | null
          poster_url?: string | null
          trailer_url?: string | null
          file_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      music: {
        Row: {
          id: string
          title: string
          artist: string
          album: string | null
          genre: string[]
          release_date: string
          cover_url: string | null
          preview_url: string | null
          file_url: string | null
          duration: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          artist: string
          album?: string | null
          genre: string[]
          release_date: string
          cover_url?: string | null
          preview_url?: string | null
          file_url?: string | null
          duration?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist?: string
          album?: string | null
          genre?: string[]
          release_date?: string
          cover_url?: string | null
          preview_url?: string | null
          file_url?: string | null
          duration?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      library: {
        Row: {
          id: string
          user_id: string
          content_id: string
          content_type: string
          title: string
          poster_url: string | null
          year: string | null
          rating: string | null
          genre: string | null
          download_date: string
          file_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          content_type: string
          title: string
          poster_url?: string | null
          year?: string | null
          rating?: string | null
          genre?: string | null
          download_date?: string
          file_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          content_type?: string
          title?: string
          poster_url?: string | null
          year?: string | null
          rating?: string | null
          genre?: string | null
          download_date?: string
          file_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          content_id: string
          content_type: string
          title: string
          poster_url: string | null
          year: string | null
          rating: string | null
          genre: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          content_type: string
          title: string
          poster_url?: string | null
          year?: string | null
          rating?: string | null
          genre?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          content_type?: string
          title?: string
          poster_url?: string | null
          year?: string | null
          rating?: string | null
          genre?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}