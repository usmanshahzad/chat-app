"use client";

import { useChat } from "@/hooks/useChatContext";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const { login, isLoading } = useChat();

  const handleLogin = () => {
    login(name, phone);
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 350,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={2}>
          Login
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Enter your name to continue
        </Typography>

        <TextField
          fullWidth
          label="Name"
          placeholder="e.g. John"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          Enter your phone number to continue
        </Typography>

        <TextField
          fullWidth
          label="Phone Number"
          placeholder="e.g. 03001234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Continue"}
        </Button>
      </Paper>
    </Box>
  );
}