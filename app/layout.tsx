import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLoader from "@/components/ui/app-loader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AES Admin",
  description: "AES Administration Panel",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} style={{ colorScheme: "light" }}>
      <body className="min-h-full flex flex-col font-sans">
        <AppLoader />
        {children}
      </body>
    </html>
  );
}
