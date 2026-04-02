import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { FloatingChatbot } from "@/components/FloatingChatbot";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "HeartPredict | Clinical Decision Support",
  description: "Advanced cardiovascular risk prediction for clinical environments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased selection:bg-accent/20 selection:text-accent",
          dmSans.variable,
          dmSerif.variable,
          spaceMono.variable
        )}
      >
        <AuthProvider>
          {children}
          <FloatingChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
