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

// Define the languages with their corresponding values
const languages = {
  burmese: "Burmese",
  english: "English",
  japanese: "Japanese",
  chinese: "Chinese",
  thai: "Thai",
  indonesian: "Indonesian",
  korean: "Korean",
  hindi: "Hindi",
  german: "German",
};

export function LanguageSelector() {
  return (
    <Select>
      <SelectTrigger className="w-[170px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          {Object.entries(languages).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
