"use client";

import { GroceryDeal } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { StoreIcon } from "@/components/ui/store-icon"

interface DealCardProps {
  deal: GroceryDeal;
  isSelected: boolean;
  onSelect: (dealId: string) => void;
}

export function DealCard({ deal, isSelected, onSelect }: DealCardProps) {
  const savings = ((deal.originalPrice - deal.price) / deal.originalPrice * 100).toFixed(0);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48">
        <Image
          src={deal.imageUrl}
          alt={deal.name}
          fill
          className="object-cover"
          unoptimized
        />
        <Badge className="absolute top-2 right-2 bg-red-500">
          {savings}% OFF
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <StoreIcon storeName={deal.store} className="w-4 h-4 object-contain" />
          <span className="text-sm">{deal.store}</span>
        </div>
        <h3 className="font-semibold text-lg mb-1">{deal.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{deal.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold">€{deal.price}</span>
          <span className="text-sm text-muted-foreground line-through">
            €{deal.originalPrice}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant={isSelected ? "secondary" : "default"}
          className="w-full"
          onClick={() => onSelect(deal.id)}
        >
          {isSelected ? "Remove from List" : "Add to List"}
        </Button>
      </CardFooter>
    </Card>
  );
}