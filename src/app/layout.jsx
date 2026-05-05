import { ChatProvider } from "@/hooks/useChatContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}