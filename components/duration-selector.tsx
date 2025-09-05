"use client"
import * as React from "react";
import { selectedDurationAtom, useAtom } from '@/app/store';

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
  "1": "1 minute",
  "3": "3 minutes",
  "5": "5 minutes",
  "10": "10 minutes",
  "15": "15 minutes",
  "30": "30 minutes",
};

export function DurationSelector() {
  const [selectedDuration, setSelectedDuration] = useAtom(selectedDurationAtom);
  console.log('selected duration', selectedDuration)
  return (
    <Select value={selectedDuration} onValueChange={setSelectedDuration}>
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
