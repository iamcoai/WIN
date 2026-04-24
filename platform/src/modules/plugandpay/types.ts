/** Internal types — mapped from P&P responses via mappers/. */

export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "ended"
  | "inactive";

export interface PnpSubscription {
  id: string;
  status: SubscriptionStatus;
  productId?: string;
  contact: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  startedAt?: string;
  endedAt?: string;
}

export interface PnpOrder {
  id: string;
  status: string;
  totalCents: number;
  currency: string;
  contact: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  products: Array<{ productId: string; quantity: number }>;
  paidAt?: string;
}

export interface PnpProduct {
  id: string;
  name: string;
  description?: string;
  priceCents?: number;
  currency: string;
  active: boolean;
}

export interface PnpPage<T> {
  data: T[];
  meta: { currentPage: number; total: number; lastPage: number };
}
