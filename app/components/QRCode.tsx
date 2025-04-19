'use client';

import { useState } from 'react';
import Image from 'next/image';

interface QRCodeProps {
  url: string;
  size?: number;
}

export default function QRCode({ url, size = 200 }: QRCodeProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Image
          src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`}
          alt="Scan to visit our site"
          width={size}
          height={size}
          className="rounded-md"
        />
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Scan to visit our site</p>
        <button
          onClick={handleCopy}
          className="text-sm text-teal-600 hover:text-teal-800 underline"
        >
          {isCopied ? 'Copied!' : 'Copy URL'}
        </button>
      </div>
    </div>
  );
} 