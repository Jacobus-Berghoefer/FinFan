// server/src/types/sleeper.d.ts

export interface SleeperUser {
    user_id: string;
    display_name: string;
    avatar: string | null;
    metadata?: Record<string, any>;
    // Add more as needed from Sleeper API
  }
  