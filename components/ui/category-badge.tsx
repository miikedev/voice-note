import {
  StickyNote,
  Brain,
  CheckSquare,
  ShoppingCart,
  User,
  Briefcase,
  HelpCircle,
  LucideIcon, // A good fallback icon
} from "lucide-react"; // Assuming you use lucide-react or similar
import { Badge } from "./badge";
import { categories } from "../category-selector";

interface CategoryDetail {
  label: string | null;
  icon: LucideIcon;
}

/**
 * Defines the structure for the entire categories object.
 * It uses an index signature `[key: string]` to indicate that the object
 * can have any number of string keys, and each value must conform
to the
 * `CategoryDetail` interface.
 */
interface Categories {
  [key: string]: CategoryDetail;
}
// The new reusable component
export function CategoryBadge({ category }: {category: string | null}) {
  // 1. Look up the category details, provide a safe fallback
  const categoryDetails = (category && categories[category]) || {
    label: category || "Unknown", // Show the raw category name or "Unknown"
    icon: HelpCircle, // Show a default icon
  };

  // 2. Destructure and rename the icon to start with a capital letter (required by JSX)
  const { label, icon: IconComponent } = categoryDetails;

  return (
    <Badge
      className="p-[.4rem] flex items-center gap-x-2"
        variant={"outline"}
    >
      {/* 3. Render the icon component */}
      <IconComponent className="h-4 w-4" />
      
      {/* 4. Render the label */}
      <span className="text-xs">{label}</span>
    </Badge>
  );
}