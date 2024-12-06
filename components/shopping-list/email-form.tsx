"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
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

interface EmailFormProps {
  onClose: () => void;
  isOpen: boolean;
  totalSavings: number;
  itemCount: number;
}

export function EmailForm({ onClose, isOpen, totalSavings, itemCount }: EmailFormProps) {
  const [email, setEmail] = useState("nerijus@masikonis.lt");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setEmail("");
    setIsSuccess(false);
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