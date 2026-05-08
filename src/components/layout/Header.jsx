"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChatContext";
import { useState } from "react";
import ChatModal from "../modals/chatModal";

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { token, activePlan, logout, userId, allUsers } = useChat();

  console.log("allUsers", allUsers);

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* LEFT: App Name */}
        <Typography variant="h6" fontWeight={600}>
          Chat App
        </Typography>

        {/* RIGHT: Plan + Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          
          {/* Plan Badge */}
          {activePlan && (
            <Chip
              label={activePlan?.planName || "Free"}
              color="success"
              variant="outlined"
            />
          )}

          {/* Plans Page */}
          <Button color="inherit" onClick={() => router.push("/plans")}>
            Plans
          </Button>

          {/* Start New Chat */}
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
          >
            New Chat
          </Button>

          <ChatModal
            open={open}
            onClose={() => setOpen(false)}
            users={allUsers}
            loggedInUserId={userId}
            onChatCreated={(chat) => {
              console.log("Created Chat:", chat);
            }}
          />

          {/* Logout */}
          {token && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}