'use client';

import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

const emailSchema = z.string().email('Please enter a valid email address');

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
}

const EmailForm = ({ email, setEmail }: EmailFormProps) => {
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      emailSchema.parse(email);
      // Here you would typically save the email to your database
      toast.success('Email submitted successfully!');
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-8">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Enter your E-mail to receive your ticket
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail:"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmailForm; 