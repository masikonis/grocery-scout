"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailSuccessProps {
  email: string;
  itemCount: number;
  totalSavings: number;
  onClose: () => void;
}

export function EmailSuccess({ email, itemCount, totalSavings, onClose }: EmailSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6">
      <div className="rounded-full bg-green-100 p-3 mb-4">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Shopping List Sent!</h3>
      <p className="text-muted-foreground mb-4">
        We've sent your shopping list with {itemCount} items and €{totalSavings.toFixed(2)} in savings to:
      </p>
      <p className="text-lg font-medium mb-6">{email}</p>
      <Button onClick={onClose} className="w-full">
        Done
      </Button>
    </div>
  );
}