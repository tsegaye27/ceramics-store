import { AuthProvider } from "../_context/AuthContext";
import { LanguageProvider } from "../_context/LanguageContext";
import ReduxProvider from "../ReduxProvider";
import ReactQueryProvider from "../_providers/ReactQueryProvider";

export default function RLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthProvider>
            <ReduxProvider>
            <ReactQueryProvider>
            {children}
            </ReactQueryProvider>
            </ReduxProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
