import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface FilterTabsProps {
  counts: {
    all: number;
    draft: number;
    published: number;
    active: number;
    completed: number;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function FilterTabs({ counts, activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="pb-4 border-b border-zinc-800">
      <Tabs 
        value={activeTab} 
        onValueChange={onTabChange} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full bg-zinc-900">
          <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800">
            <span className="mr-2">All</span>
            <Badge variant="outline" className="bg-zinc-700/20 text-zinc-400 border-zinc-700">
              {counts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-zinc-800">
            <span className="mr-2">Draft</span>
            <Badge variant="outline" className="bg-zinc-700/20 text-zinc-400 border-zinc-700">
              {counts.draft}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="published" className="data-[state=active]:bg-zinc-800">
            <span className="mr-2">Published</span>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-700/50">
              {counts.published}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-zinc-800">
            <span className="mr-2">Active</span>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-700/50">
              {counts.active}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-zinc-800">
            <span className="mr-2">Completed</span>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-700/50">
              {counts.completed}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}