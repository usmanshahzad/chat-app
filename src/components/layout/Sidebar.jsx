"use client";

import { useChat } from "@/hooks/useChatContext";
import pusherClient from "@/libs/pusher";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [chats, setChats] = useState([]);
  const { selectedChat, setSelectedChat, userId } = useChat();

  useEffect(() => {
    const channel = pusherClient.subscribe(`user-${userId}`);
    const handleNewChat = (data) => {
      console.log("new chat received", data);
      setChats((prev) => [...prev, data])
    }

    channel.bind("new-chat", handleNewChat)

    return () => {
      channel.unbind("new-chat", handleNewChat);
      pusherClient.unsubscribe(`user-${userId}`);
    }
  }, []);

  useEffect(() => {
    fetch(`/api/chat/${userId}`)
      .then(res => res.json())
      .then(data => setChats(data?.data));
  }, []);

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
          const otherUser = (chat.participants || []).find((p) => p?._id !== userId);

          return (
          <ListItem
            button="true"
            key={i}
            sx={{
              borderRadius: 1,
              "&:hover": { backgroundColor: "#f5f5f5" },
              ...(selectedChat?._id === chat?._id ? { backgroundColor: "#f5f5f5" } : {}),
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