import { useChat } from "@/hooks/useChatContext";
import pusherClient from "@/libs/pusher";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { selectedChat, userId } = useChat();

  useEffect(() => {
    const channel = pusherClient.subscribe(`chat-${selectedChat?._id}`);
    const handleNewMessage = (data) => {
      setMessages((prev) => [...prev, data])
    }
    
    channel.bind("new-message", handleNewMessage);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe(`chat-${selectedChat?._id}`);
    }
  }, []);

  useEffect(() => {
    fetch(`/api/messages/${selectedChat?._id}`)
      .then(res => res.json())
      .then(data => setMessages(data?.data || []));
  }, [selectedChat?._id]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Sent message */}
      {(messages || []).map((message, i) => {
        const myMsg = message?.sender?._id == userId || false;
        console.log("message", message, myMsg);
        return (
          <Box key={i} sx={{ display: "flex", ...(myMsg ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }) }}>
            <Paper sx={{ px: 2, py: 1, ...(myMsg ? { bgcolor: "primary.main", color: "#fff" } : { bgcolor: "#eee" }) }}>
              {message?.text || ""}
            </Paper>
          </Box>
        )
      })}

      {isTyping && (
        <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'gray' }}>
          {typingUser} is typing...
        </Typography>
      )}
    </Box>
  );
}