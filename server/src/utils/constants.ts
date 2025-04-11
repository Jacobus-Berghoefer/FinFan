// utils/constants.ts

export const BetStatus = {
    PENDING: 'pending',
    ACTIVE: 'active',
    WON: 'won',
    LOST: 'lost',
  } as const;
  
  export type BetStatusType = typeof BetStatus[keyof typeof BetStatus];
  
  export const PayoutStatus = {
    WON: 'won',
    LOST: 'lost',
  } as const;
  
  export type PayoutStatusType = typeof PayoutStatus[keyof typeof PayoutStatus];