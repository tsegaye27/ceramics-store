import { AuthProvider } from "../_context/AuthContext";
import { LanguageProvider } from "../_context/LanguageContext";
import ReduxProvider from "../ReduxProvider";

export default function RLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
