"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

/**
 * Assumes you have shadcn/ui components wired up at:
 *  - "@/components/ui/button"
 *  - "@/components/ui/tooltip"
 *
 * If your project uses different paths, adjust imports accordingly.
 */
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Props = {
  text: string;
  label?: string; // visually-visible button text (optional)
  className?: string;
  keepLabelOnMobile?: boolean; // show/hide label with icon
};

export default function CopyTextButton({
  text,
  label = "Copy",
  className,
  keepLabelOnMobile = false,
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000); // revert after 2s
    return () => clearTimeout(t);
  }, [copied]);

  async function fallbackCopy(textToCopy: string) {
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }

  async function handleCopy() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ok = await fallbackCopy(text);
        if (!ok) throw new Error("copy-failed");
      }
      setCopied(true);
    } catch {
      // optional: show an error toast instead
      setCopied(false);
      // for debug: console.warn("copy failed");
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={copied ? "ghost" : "outline"}
          size={"sm"}
          onClick={handleCopy}
          aria-pressed={copied}
          aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
          className={`inline-flex items-center ${className ?? ""}`}
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}

          {/* Show label optionally — hide on small screens unless keepLabelOnMobile */}
          <span
            className={`text-sm ${
              keepLabelOnMobile ? "" : "hidden sm:inline-block"
            }`}
          >
            {copied ? "Copied!" : label}
          </span>
        </Button>
      </TooltipTrigger>

      <TooltipContent side="top">
        <p>{copied ? "Copied to clipboard" : "Copy text to clipboard"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
