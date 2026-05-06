"use client";

import { useChat } from "@/hooks/useChatContext";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const [loginData, setLoginData] = useState({
    name: "",
    phone: "",
    password: ""
  });
  const router = useRouter();
  const { register, isLoading } = useChat();

  const handleRegister = () => {
    register(loginData);
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
          value={loginData.name}
          onChange={(e) => setLoginData((prev) => ({ ...prev, name: e.target.value }))}
          sx={{ mb: 2 }}
        />
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          Enter your phone number to continue
        </Typography>

        <TextField
          fullWidth
          label="Phone Number"
          placeholder="e.g. 03001234567"
          value={loginData.phone}
          onChange={(e) => setLoginData((prev) => ({ ...prev, phone: e.target.value }))}
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" color="text.secondary" mb={2}>
          Enter your new Password to continue
        </Typography>

        <TextField
          fullWidth
          label="Password"
          placeholder="e.g. *****"
          type="password"
          value={loginData.password}
          onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? "Register..." : "Register"}
        </Button>

        <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Already have an Account
          </Typography>

          <Typography
            variant="button"
            mb={2}
            sx={{ color: "rgb(9, 118, 190)", cursor: "pointer" }}
            onClick={() => router.replace("/login")}>
            Login
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}