"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CustomerLogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <Button variant="ghost" size="sm" className={className} onClick={handleLogout}>
      <LogOut className="w-4 h-4 mr-2 shrink-0" />
      Log out
    </Button>
  );
}
