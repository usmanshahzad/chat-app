import { useChat } from "@/hooks/useChatContext";
import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function MessageInput() {
  const [newMessage, setNewMessage] = useState("");
  const { selectedChat, user, userId } = useChat();
  const userName = user?.name || "";
  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: "ap2",
    authEndpoint: "/api/pusher/auth",
  })

  const addNewMessage = () => {
    if (Object.keys(selectedChat || {}).length === 0) return;

    const messagePayload = {
      chatId: selectedChat?.id,
      sender: userName,
      userId,
      text: newMessage
    }

    fetch("/api/addMessages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload)
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setNewMessage("");
        }
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewMessage();
      return;
    }

    // if (!window.lastTypingEvent || Date.now() - window.lastTypingEvent > 2000) {
    //   const channel = pusher.channel("private-chat-room");
    //   if (channel) {
    //     channel.trigger("client-typing", { username: userName });
    //     window.lastTypingEvent = Date.now();
    //   }
    // }
  };
    
  return (
    <Box
      sx={{
        height: 64,
        borderTop: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        px: 2,
        gap: 1,
      }}
    >
      <TextField
        value={newMessage}
        fullWidth
        size="small"
        placeholder="Type a message..."
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Button onClick={addNewMessage} variant="contained">Send</Button>
    </Box>
  );
}