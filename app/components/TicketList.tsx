'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { TicketCategory } from '../types';
import { EmailDialog } from './EmailDialog';

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => { openIframe: () => void };
    };
  }
}

// Define Paystack response type
interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
  [key: string]: any;
}

interface TicketListProps {
  categories: TicketCategory[];
  userEmail: string;
  onEmailSubmit: (email: string) => void;
}

const TicketList = ({ categories, userEmail, onEmailSubmit }: TicketListProps) => {
  // Initialize quantities state with default values
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null);
  const [localEmail, setLocalEmail] = useState(userEmail);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paystackKey, setPaystackKey] = useState<string>('');
  const currentPaymentRef = useRef<{ category: TicketCategory; quantity: number } | null>(null);

  // Load Paystack key on component mount
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (key) {
      setPaystackKey(key);
      console.log('Paystack key loaded:', key.substring(0, 10) + '...');
    } else {
      console.error('Paystack key is missing!');
    }
  }, []);

  // Update local email when userEmail prop changes
  useEffect(() => {
    if (userEmail) {
      setLocalEmail(userEmail);
    }
  }, [userEmail]);

  // Set initial quantities when component mounts
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    categories.forEach(category => {
      initialQuantities[category.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [categories]);

  const handleDecrement = (categoryId: string) => {
    setQuantities(prev => {
      const currentQuantity = prev[categoryId] || 1;
      if (currentQuantity <= 1) return prev;
      return { ...prev, [categoryId]: currentQuantity - 1 };
    });
  };

  const handleIncrement = (categoryId: string) => {
    setQuantities(prev => {
      const currentQuantity = prev[categoryId] || 1;
      return { ...prev, [categoryId]: currentQuantity + 1 };
    });
  };

  const handleBuyNow = (category: TicketCategory) => {
    if (!localEmail) {
      setSelectedCategory(category);
      setEmailDialogOpen(true);
      return;
    }
    
    handlePayment(category);
  };

  const handleEmailSubmit = (email: string) => {
    console.log('Email submitted in TicketList:', email);
    setLocalEmail(email);
    onEmailSubmit(email);
    setEmailDialogOpen(false);
    
    if (selectedCategory) {
      handlePayment(selectedCategory);
      setSelectedCategory(null);
    }
  };

  const sendTicketEmail = async (ticketType: string, quantity: number) => {
    console.log('Attempting to send ticket email to:', localEmail);
    console.log('Ticket type:', ticketType);
    console.log('Quantity:', quantity);
    
    try {
      console.log('Sending request to /api/send-ticket');
      const response = await fetch('/api/send-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: localEmail,
          ticketType,
          quantity,
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to send ticket email');
      }

      const data = await response.json();
      console.log('Email sent successfully:', data);
      toast.success('Ticket sent to your email!');
    } catch (error) {
      console.error('Error sending ticket email:', error);
      toast.error('Failed to send ticket email. Please contact support.');
    }
  };

  // Define callback functions using useCallback to ensure they're stable
  const handlePaymentSuccess = useCallback(async (response: PaystackResponse) => {
    console.log('Payment successful:', response);
    
    if (currentPaymentRef.current) {
      const { category, quantity } = currentPaymentRef.current;
      console.log('Processing ticket email with stored data:', { 
        ticketType: category.name, 
        quantity: quantity,
        email: localEmail 
      });
      
      if (!localEmail) {
        console.error('No email address available');
        toast.error('Email address is missing. Please try again.');
        return;
      }
      
      toast.success('Payment successful! Sending your ticket...');
      await sendTicketEmail(category.name, quantity);
      currentPaymentRef.current = null;
    } else {
      console.error('No payment information found');
      toast.error('Could not determine ticket type for email. Please contact support.');
    }
    
    // Reset processing state
    setIsProcessingPayment(false);
  }, [localEmail]);

  const handlePaymentClose = useCallback(() => {
    console.log('Payment closed');
    toast.error('Payment cancelled');
    setIsProcessingPayment(false);
  }, []);

  const handlePayment = async (category: TicketCategory) => {
    try {
      // Check if Paystack key is available
      if (!paystackKey) {
        console.error('Paystack key is missing');
        toast.error('Payment system is not properly configured. Please contact support.');
        return;
      }

      setIsProcessingPayment(true);
      
      console.log('Processing payment with email:', localEmail);
      const quantity = quantities[category.id] || 1;
      const amount = category.price * quantity * 100; // Convert to kobo

      // Store the current payment information
      currentPaymentRef.current = { category, quantity };

      // Log payment configuration for debugging
      console.log('Payment configuration:', {
        key: paystackKey.substring(0, 10) + '...',
        email: localEmail,
        amount,
        currency: 'NGN',
        ticketType: category.name,
        quantity
      });

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: localEmail.trim(),
        amount,
        currency: 'NGN',
        ref: `${Math.floor(Math.random() * 1000000000)}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Ticket Type",
              variable_name: "ticket_type",
              value: category.name
            },
            {
              display_name: "Quantity",
              variable_name: "quantity",
              value: quantity.toString()
            }
          ]
        },
        callback: function(response: PaystackResponse) {
          console.log('Paystack callback triggered with response:', response);
          handlePaymentSuccess(response);
        },
        onClose: function() {
          console.log('Paystack onClose triggered');
          handlePaymentClose();
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error(`Payment initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsProcessingPayment(false);
      currentPaymentRef.current = null;
    }
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const quantity = quantities[category.id] || 1;
        const totalPrice = category.price * quantity;
        
        return (
          <div
            key={category.id}
            className="border-2 border-black p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="text-[20px] font-bold text-[#CF0C0C] greconian">{category.name}</h3>
              <p className="text-[#171717] text-[20px] font-[400]">₦{category.price.toLocaleString()}</p>
              <p className="text-[12px]">{category.description}</p>
              {quantity > 1 && (
                <p className="text-[#171717] text-[14px] font-[500] mt-2">
                  Total: ₦{totalPrice.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-col items-center space-y-[9px]">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleDecrement(category.id)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full"
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleIncrement(category.id)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleBuyNow(category)}
                className="bg-[#067976] text-white px-[31px] font-semibold py-3 hover:bg-teal-700 transition-colors"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          </div>
        );
      })}
      
      <EmailDialog 
        open={emailDialogOpen} 
        onOpenChange={setEmailDialogOpen} 
        onSubmit={handleEmailSubmit} 
      />
    </div>
  );
};

export default TicketList;