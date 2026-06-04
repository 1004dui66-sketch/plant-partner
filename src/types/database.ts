export type Profile = {
  id: string;
  created_at: string;
  display_name: string | null;
  bio: string | null;
  care_alerts_enabled: boolean;
};

export type PlantCategory = '실내' | '실외' | '다육식물';

export type Plant = {
  id: string;
  user_id: string;
  nickname: string | null;
  plant_name: string;
  scientific_name: string | null;
  image_url: string | null;
  category: PlantCategory;
  created_at: string;
};

export type Analysis = {
  id: string;
  user_id: string;
  plant_id: string | null;
  image_url: string;
  plant_name: string;
  scientific_name: string | null;
  health_status: string;
  diagnosis: string;
  recommendation: string;
  care_summary: unknown;
  confidence: number | null;
  symbolism: string | null;
  created_at: string;
};

export type GrowthLog = {
  id: string;
  plant_id: string;
  image_url: string | null;
  memo: string | null;
  activity_type: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          display_name?: string | null;
          bio?: string | null;
          care_alerts_enabled?: boolean;
          created_at?: string;
        };
        Update: {
          display_name?: string | null;
          bio?: string | null;
          care_alerts_enabled?: boolean;
          created_at?: string;
        };
      };
      plants: {
        Row: Plant;
        Insert: {
          user_id: string;
          nickname?: string | null;
          plant_name: string;
          scientific_name?: string | null;
          image_url?: string | null;
          category?: PlantCategory;
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Plant, 'id' | 'user_id'>>;
      };
      analyses: {
        Row: Analysis;
        Insert: {
          user_id: string;
          plant_id?: string | null;
          image_url: string;
          plant_name: string;
          scientific_name?: string | null;
          health_status: string;
          diagnosis: string;
          recommendation: string;
          care_summary?: unknown;
          confidence?: number | null;
          symbolism?: string | null;
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Analysis, 'id' | 'user_id'>>;
      };
      growth_logs: {
        Row: GrowthLog;
        Insert: {
          plant_id: string;
          image_url?: string | null;
          memo?: string | null;
          activity_type?: string;
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<GrowthLog, 'id' | 'plant_id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
