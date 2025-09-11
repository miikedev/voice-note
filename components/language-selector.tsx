"use client"
import * as React from "react";
import { useAtom } from "jotai";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { selectedLanguageAtom } from "@/app/store";

// Define the languages with their corresponding values
const languages = {
  burmese: "burmese",
  english: "english",
  japanese: "japanese",
  korea: "korea",
  chinese: "chinese",
  malaysia: "malaysia",
  thai: "thai",
  german: "german",
};

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);

  return (
    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
