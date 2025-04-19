export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface CartItem {
  categoryId: string;
  quantity: number;
}

export interface PaymentDetails {
  email: string;
  amount: number;
  reference: string;
  metadata: {
    tickets: CartItem[];
  };
}

export interface EmailSubmission {
  email: string;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    status: string;
    transaction: string;
  };
} 