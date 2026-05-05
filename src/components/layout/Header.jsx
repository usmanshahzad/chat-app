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

export default function Header() {
  const router = useRouter();
  const { token, activePlan, logout } = useChat();

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