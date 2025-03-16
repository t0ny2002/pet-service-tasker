export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Supabase Types (generated from Supabase)
export interface Database {
  public: {
    Tables: {
      actions: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: number
          kind: string
          message: string | null
          ref: string | null
          status: string
          user_ref: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: number
          kind: string
          message?: string | null
          ref?: string | null
          status?: string
          user_ref?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: number
          kind?: string
          message?: string | null
          ref?: string | null
          status?: string
          user_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_user_ref_fkey"
            columns: ["user_ref"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      admin_invites: {
        Row: {
          created_at: string
          id: string
          invitee_email: string
          sender_id: string
          used: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          invitee_email: string
          sender_id?: string
          used?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          invitee_email?: string
          sender_id?: string
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "admin_invites_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bids: {
        Row: {
          amount: number
          bidder_id: string
          created_at: string
          description: string
          id: number
          post_id: number
        }
        Insert: {
          amount?: number
          bidder_id?: string
          created_at?: string
          description?: string
          id?: number
          post_id: number
        }
        Update: {
          amount?: number
          bidder_id?: string
          created_at?: string
          description?: string
          id?: number
          post_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      chats: {
        Row: {
          created_at: string
          id: number
          post_id: number
          user1_id: string
          user1_read_chat: boolean
          user2_id: string
          user2_read_chat: boolean | null
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          user1_id: string
          user1_read_chat?: boolean
          user2_id: string
          user2_read_chat?: boolean | null
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          user1_id?: string
          user1_read_chat?: boolean
          user2_id?: string
          user2_read_chat?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          chat_id: number
          created_at: string
          id: number
          message: string
          user_id: string
        }
        Insert: {
          chat_id: number
          created_at?: string
          id?: number
          message?: string
          user_id: string
        }
        Update: {
          chat_id?: number
          created_at?: string
          id?: number
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string
          href: string
          id: number
          kind: string
          message: string
          recipient: string
          sender: string | null
          viewed: boolean
        }
        Insert: {
          created_at?: string
          href: string
          id?: number
          kind: string
          message: string
          recipient: string
          sender?: string | null
          viewed?: boolean
        }
        Update: {
          created_at?: string
          href?: string
          id?: number
          kind?: string
          message?: string
          recipient?: string
          sender?: string | null
          viewed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_fkey"
            columns: ["recipient"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string
          id: number
          image_URL: string | null
          location: string
          owner_id: string
          selected_bidder: string | null
          start_time: string | null
          status: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          duration: string
          id?: number
          image_URL?: string | null
          location: string
          owner_id: string
          selected_bidder?: string | null
          start_time?: string | null
          status?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          id?: number
          image_URL?: string | null
          location?: string
          owner_id?: string
          selected_bidder?: string | null
          start_time?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_selected_bidder_fkey"
            columns: ["selected_bidder"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      question_likes: {
        Row: {
          created_at: string
          id: number
          question: number
          user: string
        }
        Insert: {
          created_at?: string
          id?: number
          question: number
          user: string
        }
        Update: {
          created_at?: string
          id?: number
          question?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_likes_question_fkey"
            columns: ["question"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_likes_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          answer: string | null
          asking_user: string
          created_at: string
          id: number
          last_updated: string | null
          post_id: number
          question: string
        }
        Insert: {
          answer?: string | null
          asking_user?: string
          created_at?: string
          id?: number
          last_updated?: string | null
          post_id: number
          question: string
        }
        Update: {
          answer?: string | null
          asking_user?: string
          created_at?: string
          id?: number
          last_updated?: string | null
          post_id?: number
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_asking_user_fkey"
            columns: ["asking_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      ratings: {
        Row: {
          rated_id: string
          rater_id: string | null
          rating: number | null
          rating_id: number
        }
        Insert: {
          rated_id?: string
          rater_id?: string | null
          rating?: number | null
          rating_id?: number
        }
        Update: {
          rated_id?: string
          rater_id?: string | null
          rating?: number | null
          rating_id?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          id: number
          skill: string
          user: string
        }
        Insert: {
          created_at?: string
          id?: number
          skill: string
          user: string
        }
        Update: {
          created_at?: string
          id?: number
          skill?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          bio: string
          created_at: string
          firstName: string
          id: string
          image_url: string | null
          lastName: string
          location: string | null
          phone: string | null
          role: string
        }
        Insert: {
          bio: string
          created_at?: string
          firstName?: string
          id?: string
          image_url?: string | null
          lastName?: string
          location?: string | null
          phone?: string | null
          role: string
        }
        Update: {
          bio?: string
          created_at?: string
          firstName?: string
          id?: string
          image_url?: string | null
          lastName?: string
          location?: string | null
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      average_rating: {
        Row: {
          average_rating: number | null
          number_ratings: number | null
          rated_id: string | null
        }
        Relationships: []
      }
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
