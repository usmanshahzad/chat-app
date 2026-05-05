import { useChat } from "@/hooks/useChatContext";
import { Box, Paper, Typography } from "@mui/material";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { selectedChat, userId } = useChat();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "ap2"
    })

    const channel = pusher.subscribe("chat-room");
    
    channel.bind("new-message", (data) => {
      setMessages((prev) => [...prev, data])
    })

    // const channel2 = pusher.subscribe("private-chat-room");

    // channel2.bind("client-typing", (data) => {
    //   setTypingUser(data.username);
    //   setIsTyping(true);

    //   setTimeout(() => setIsTyping(false), 2000);
    // });

    return () => {
      pusher.unsubscribe("chat-room");
      // pusher.unsubscribe("private-chat-room");
    }
  }, []);

  useEffect(() => {
    fetch(`/api/messages/${selectedChat?.id}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [selectedChat?.id]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Sent message */}
      {(messages || []).map((message, i) => {
        const myMsg = message?.senderId == userId || false;
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