import { AuthProvider } from "../_context/AuthContext";
import { LanguageProvider } from "../_context/LanguageContext";
import ReduxProvider from "../ReduxProvider";
import { Toaster } from "react-hot-toast";

export default function RLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <LanguageProvider>
            <AuthProvider>
              <Toaster position="top-center" />
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
