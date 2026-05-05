"use client";

import { Box, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChat } from "@/hooks/useChatContext";
import Header from "./Header";

export default function MainLayout() {
  const { selectedChat } = useChat();

  return (
    <Box sx={{ height: "100vh" }}>
      {/* Main Header */}
      <Header />
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Chat Area */}
        {Object.keys(selectedChat || {}).length > 0 ?
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <ChatHeader />

          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            <MessageList />
          </Box>

          <MessageInput />
        </Box>
        :
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          Select Chat to Message...
        </Typography>
        }
      </Box>
    </Box>
  );
}