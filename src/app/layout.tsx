import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elecciones Honduras 2025 - Transparencia Electoral",
  description: "Sistema de votación blockchain transparente y seguro para las elecciones de Honduras 2025. Lucha contra el fraude electoral con tecnología de vanguardia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 relative">
            {/* Honduras Flag Background */}
            <div 
              className="fixed inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "url('/images/bandera-honduras.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            
            {/* Blue overlay for better readability */}
            <div className="fixed inset-0 bg-blue-600/20 pointer-events-none" />
            
            {/* Content */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
