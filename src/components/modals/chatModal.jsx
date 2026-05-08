"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function ChatModal({
  open,
  onClose,
  users = [],
  loggedInUserId,
  onChatCreated,
}) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter users
  const filteredUsers = users.filter((user) => {
    // prevent showing logged-in user
    if (user._id === loggedInUserId) return false;

    return user.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleStartChat = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: [loggedInUserId, selectedUser._id],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onChatCreated?.(data?.data);

        // reset modal
        setSelectedUser(null);
        setSearch("");

        onClose();
      } else {
        alert(data?.error || "Failed to create chat");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedUser(null);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Typography fontWeight={600}>
          Start New Chat
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Search Input */}
        <TextField
          fullWidth
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />

        {/* Users List */}
        <List
          sx={{
            maxHeight: 350,
            overflowY: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
          }}
        >
          {filteredUsers.length === 0 && (
            <Box p={3} textAlign="center">
              <Typography color="text.secondary">
                No users found
              </Typography>
            </Box>
          )}

          {filteredUsers.map((user) => {
            const isSelected = selectedUser?._id === user._id;

            return (
              <ListItemButton
                key={user._id}
                selected={isSelected}
                onClick={() => setSelectedUser(user)}
                sx={{
                  py: 1.5,
                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                <Avatar sx={{ mr: 2 }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>

                <ListItemText
                  primary={user.name}
                  secondary={user.phone}
                />
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!selectedUser || loading}
          onClick={handleStartChat}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Start Chat"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}