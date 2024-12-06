"use client";

import { useState } from "react";
import { GroceryDeal } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Mail, 
  Trash2, 
  Store, 
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { EmailForm } from "./email-form";
import { StoreIcon } from '../ui/store-icon'

interface SelectedItemsProps {
  selectedDeals: GroceryDeal[];
  onRemoveItem: (dealId: string) => void;
}

export function SelectedItems({ selectedDeals, onRemoveItem }: SelectedItemsProps) {
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const total = selectedDeals.reduce((sum, deal) => sum + deal.price, 0);
  const totalSavings = selectedDeals.reduce(
    (sum, deal) => sum + (deal.originalPrice - deal.price),
    0
  );

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 shadow-lg bg-[#ff844e] hover:bg-[#e67645] text-white"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span>{selectedDeals.length} Items</span>
            {selectedDeals.length > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 bg-white text-[#ff844e] font-medium"
              >
                Save €{totalSavings.toFixed(2)}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-2xl">Shopping List</SheetTitle>
            <SheetDescription>
              {selectedDeals.length > 0
                ? `You've selected ${selectedDeals.length} items from ${new Set(selectedDeals.map(d => d.store)).size} stores`
                : "Add items to your shopping list to get started"}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-8 flex flex-col h-[calc(100vh-12rem)]">
            <ScrollArea className="flex-1">
              {selectedDeals.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Your shopping list is empty. Browse deals and click "Add to List" to get started.
                  </p>
                </div>
              ) : (
                selectedDeals.map((deal) => (
                  <div key={deal.id} className="group">
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-gray-100">
                          <Image
                            src={deal.imageUrl}
                            alt={deal.name}
                            width={48}
                            height={48}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{deal.name}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <StoreIcon storeName={deal.store} className="h-3 w-3 mr-1" />
                            {deal.store}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">€{deal.price}</div>
                          <div className="text-sm text-green-600">
                            Save €{(deal.originalPrice - deal.price).toFixed(2)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveItem(deal.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))
              )}
            </ScrollArea>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Savings</span>
                  <span className="text-green-600 font-medium">
                    €{totalSavings.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">€{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => setIsEmailFormOpen(true)}
                disabled={selectedDeals.length === 0}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email List
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <EmailForm
        isOpen={isEmailFormOpen}
        onClose={() => setIsEmailFormOpen(false)}
        totalSavings={totalSavings}
        itemCount={selectedDeals.length}
        selectedDeals={selectedDeals}
      />
    </>
  );
}