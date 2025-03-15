import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  IconTruck,
  IconShip,
  IconPlane,
  IconPackage,
  IconCalendar,
  IconMapPin,
  IconCoin
} from "@tabler/icons-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export function BidCard({ bid, onClick, showActions = true }) {
  // Get category icon
  const getCategoryIcon = () => {
    switch (bid?.category) {
      case "ground":
        return <IconTruck className="h-5 w-5" />;
      case "sea":
        return <IconShip className="h-5 w-5" />;
      case "air":
        return <IconPlane className="h-5 w-5" />;
      default:
        return <IconPackage className="h-5 w-5" />;
    }
  };
  
  // Get status badge color
  const getStatusBadge = () => {
    switch (bid?.status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-zinc-700/20 text-zinc-400 border-zinc-600/50">
            Draft
          </Badge>
        );
      case "published":
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
            Published
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/50">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-zinc-700/20 text-zinc-400 border-zinc-600/50">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-all border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700"
      onClick={onClick ? () => onClick(bid) : undefined}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1">
              {getCategoryIcon()}
              <span className="capitalize">{bid?.category || "Unknown"}</span>
            </Badge>
            {getStatusBadge()}
          </div>
          
          <h3 className="font-medium text-lg text-zinc-100 mb-2 line-clamp-1">{bid?.title}</h3>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <IconCalendar className="h-4 w-4" />
              <span className="text-sm">Posted {formatDate(bid?.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <IconCoin className="h-4 w-4" />
              <span className="font-medium">{formatCurrency(bid?.budget)}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <IconMapPin className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <p className="text-zinc-300 text-sm line-clamp-1">{bid?.pickup || "No pickup location"}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <IconMapPin className="h-3.5 w-3.5 text-green-400" />
              </div>
              <p className="text-zinc-300 text-sm line-clamp-1">{bid?.destination || "No destination"}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <div className="w-full flex justify-end">
            <Button 
              size="sm"
              variant="outline" 
              className="border-blue-600/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
              onClick={(e) => {
                e.stopPropagation();
                onClick && onClick(bid);
              }}
            >
              View Details
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}