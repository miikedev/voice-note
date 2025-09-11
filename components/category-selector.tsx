"use client"
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
  Database,
  Shapes,
} from "lucide-react";
import { useAtom } from 'jotai';
import { selectedCategoryAtom } from '@/app/store';
import { usePathname } from "next/navigation";

export const categories = {
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
  const pathname = usePathname();
  const renderedCategories = pathname == '/voice/list' ? {all:{label: "All",icon: Shapes}, ...categories} : categories;
  console.log('pathname', pathname)
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);

  const handleSelectChange = (value: string) => {
    setSelectedCategory(value);
  };

  console.log('selected category', selectedCategory)

  return (
    <Select value={selectedCategory!} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-[200px] shadow-xs">
        <SelectValue placeholder="please select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {Object.entries(renderedCategories).map(([value, { label, icon: Icon }]) => (
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
