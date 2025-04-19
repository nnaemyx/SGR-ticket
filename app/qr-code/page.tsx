'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function QRCodePage() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Get the current URL for the QR code
    if (typeof window !== 'undefined') {
      // Use the production URL if available, otherwise use the current URL
      const productionUrl = 'https://sgr-ticket.vercel.app';
      setUrl(productionUrl);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Scan to Purchase Tickets</h1>
        
        <div className="flex justify-center mb-6">
          {url && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`}
                alt="Scan to purchase tickets"
                width={300}
                height={300}
                className="rounded-md"
              />
            </div>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-lg mb-2">Scan this QR code to purchase tickets for</p>
          <h2 className="text-xl font-bold text-[#CF0C0C] mb-4">Lagos in Port Harcourt</h2>
          <p className="text-sm text-gray-600">
            This QR code will take you directly to our ticket purchase page.
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Print this page to display at your event</p>
      </div>
    </div>
  );
} 