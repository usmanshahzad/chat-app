import { useChat } from "@/hooks/useChatContext";
import { Box, Typography, Divider } from "@mui/material";

export default function ChatHeader() {
  const { selectedChat, userId } = useChat();
  const otherUser = (selectedChat.participants || []).find((p) => p?._id !== userId);
  const chatName = selectedChat?.isGroupChat ? selectedChat.groupName : otherUser?.name || "John Doe";

  return (
    <>
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          px: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {chatName}
        </Typography>
      </Box>
      <Divider />
    </>
  );
}