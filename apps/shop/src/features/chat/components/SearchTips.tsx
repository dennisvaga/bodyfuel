import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SearchTipsProps {
  className?: string;
}

const SearchTips = ({ className }: SearchTipsProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn("border rounded-lg p-3", className)}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="font-medium text-2xl">Search Tips</h2>
        {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </div>

      {!isCollapsed && (
        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4 mt-2">
          <li>Find vitamins under $30 💊</li>
          <li>Show me protein powders between $20 and $50 💪</li>
          <li>Do you have creatine supplements over $25? 🏋️‍♀️</li>
          <li>Ask me about pre-workouts for energy 🔋</li>
        </ul>
      )}
    </div>
  );
};

export default SearchTips;
