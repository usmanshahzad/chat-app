"use client";

import { useChat } from "@/hooks/useChatContext";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [chats, setChats] = useState([]);
  const { selectedChat, setSelectedChat, userId } = useChat();

  useEffect(() => {
    fetch(`/api/chats/${userId}`)
      .then(res => res.json())
      .then(data => setChats(data));
  }, []);

  // const filterMyChats = (chats || []).filter((chat) => chat?.participants.some((p) => p?.id === userId));

  return (
    <Box
      sx={{
        width: 300,
        borderRight: "1px solid #ddd",
        height: "100vh",
        p: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Chats
      </Typography>

      <List>
        {(chats || []).map((chat, i) => {
          const otherUser = (chat.participants || []).find((p) => p?.id !== userId);

          return (
          <ListItem
            button="true"
            key={i}
            sx={{
              borderRadius: 1,
              "&:hover": { backgroundColor: "#f5f5f5" },
              ...(selectedChat?.id === chat?.id ? { backgroundColor: "#f5f5f5" } : {}),
            }}
            onClick={(() => setSelectedChat(chat))}
          >
            <ListItemText
              primary={`User ${otherUser?.name || ""}`}
              secondary={`${chat?.lastMessage || ""}`}
            />
          </ListItem>
          )
        })}
      </List>
    </Box>
  );
}