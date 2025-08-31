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

// Define the durations with their corresponding display values
const durations = {
  "1": "1 Minute",
  "3": "3 Minutes",
  "5": "5 Minutes",
  "10": "10 Minutes",
  "15": "15 Minutes",
  "30": "30 Minutes",
};

export function DurationSelector() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select duration" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Recording Duration</SelectLabel>
          {Object.entries(durations).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
