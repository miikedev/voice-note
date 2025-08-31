import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  StickyNote,
  Brain,
  CheckSquare,
  ShoppingCart,
  User,
  Briefcase,
} from "lucide-react";

// Define the categories with labels & icons
const categories = {
  note: {
    label: "Note",
    icon: StickyNote,
  },
  memory: {
    label: "Memory",
    icon: Brain,
  },
  todo: {
    label: "To-Do",
    icon: CheckSquare,
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingCart,
  },
  personal: {
    label: "Personal",
    icon: User,
  },
  work: {
    label: "Work",
    icon: Briefcase,
  },
};

export function CategorySelector() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {Object.entries(categories).map(([value, { label, icon: Icon }]) => (
            <SelectItem key={value} value={value}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
