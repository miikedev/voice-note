"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/login" })}
      variant="ghost"
    >
      <LogOutIcon className="h-4 w-4" />
    </Button>
  );
}
