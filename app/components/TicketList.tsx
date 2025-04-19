'use client';

import { useState, useEffect } from 'react';
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

  const handlePayment = async (category: TicketCategory) => {
    try {
      console.log('Processing payment with email:', localEmail);
      const quantity = quantities[category.id] || 1;
      const amount = category.price * quantity * 100; // Convert to kobo

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: localEmail.trim(), // Ensure email is trimmed
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
        callback: (response: any) => {
          toast.success('Payment successful! Check your email for the ticket.');
          // Here you would typically call your API to process the successful payment
          // and send the ticket via email
        },
        onClose: () => {
          toast.error('Payment cancelled');
        }
      });

      handler.openIframe();
    } catch (error) {
      toast.error('Payment initialization failed');
      console.error('Payment error:', error);
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
              >
                Buy Now
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