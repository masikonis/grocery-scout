"use client";

import { GroceryDeal } from "@/types";
import { DealCard } from "./deal-card";

interface DealsGridProps {
  deals: GroceryDeal[];
  selectedDeals: Set<string>;
  onDealSelect: (dealId: string) => void;
  lastDealRef?: (node: HTMLDivElement | null) => void;
}

export function DealsGrid({ deals, selectedDeals, onDealSelect, lastDealRef }: DealsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {deals.map((deal, index) => (
        <div
          key={deal.id}
          ref={index === deals.length - 1 ? lastDealRef : undefined}
        >
          <DealCard
            deal={deal}
            isSelected={selectedDeals.has(deal.id)}
            onSelect={onDealSelect}
          />
        </div>
      ))}
    </div>
  );
}