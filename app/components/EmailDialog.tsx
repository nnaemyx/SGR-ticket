'use client';

import * as React from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailSchema = z.string().email('Please enter a valid email address');

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string) => void;
}

export function EmailDialog({ open, onOpenChange, onSubmit }: EmailDialogProps) {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      emailSchema.parse(email);
      onSubmit(email);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter your email</DialogTitle>
          <DialogDescription>
            We'll send your ticket to this email address after payment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="col-span-3"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 