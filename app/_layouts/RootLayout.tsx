import ClientProviders from "@/app/_layouts/ClientProvider";
import { AuthProvider } from "../_context/AuthContext";

export default function RLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
