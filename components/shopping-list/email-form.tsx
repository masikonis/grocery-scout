"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmailSuccess } from "./email-success";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GroceryDeal } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  totalSavings: number;
  itemCount: number;
  selectedDeals: GroceryDeal[];
}

export function EmailForm({ onClose, isOpen, totalSavings, itemCount, selectedDeals, onSuccess }: EmailFormProps) {
  const [email, setEmail] = useState("nerijus@masikonis.lt");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          deals: selectedDeals,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setIsSuccess(true);
      onSuccess();
    } catch (error) {
      console.error('Error sending email:', error);
      setError(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          <EmailSuccess
            email={email}
            itemCount={itemCount}
            totalSavings={totalSavings}
            onClose={handleClose}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Email Shopping List</DialogTitle>
              <DialogDescription>
                Get your shopping list with {itemCount} items and €{totalSavings.toFixed(2)} in savings sent to your email.
              </DialogDescription>
            </DialogHeader>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <Select
                  value={email}
                  onValueChange={setEmail}
                  defaultValue="nerijus@masikonis.lt"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select email" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nerijus@masikonis.lt">
                      nerijus@masikonis.lt
                    </SelectItem>
                    <SelectItem value="odeta.vaiciunaite@gmail.com">
                      odeta.vaiciunaite@gmail.com
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send List
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}