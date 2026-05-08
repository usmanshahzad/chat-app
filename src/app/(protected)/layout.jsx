"use client";

import { useChat } from "@/hooks/useChatContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }) {
  const { token, activePlan, isLoading } = useChat();
  console.log("activePlan", activePlan);
  const route = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!token) {
      route.replace("/login");
      return    
    }

    if (!activePlan || Object.keys(activePlan || {}).length === 0) {
      route.replace("/plans");
      return;
    }
  }, [token, activePlan, isLoading]);

  if (isLoading) return <div>Loading...</div>

  return children
}