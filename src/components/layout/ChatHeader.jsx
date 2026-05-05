import { useChat } from "@/hooks/useChatContext";
import { Box, Typography, Divider } from "@mui/material";

export default function ChatHeader() {
  const { selectedChat } = useChat();

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
          {selectedChat?.name || "John Doe"}
        </Typography>
      </Box>
      <Divider />
    </>
  );
}