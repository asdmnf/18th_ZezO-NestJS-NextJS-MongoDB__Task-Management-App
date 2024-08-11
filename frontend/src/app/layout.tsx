import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header/Header";
import Providers from "@/lib/redux/provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Task Management App",
  description: "Developed by ZezO",
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
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Providers>
          <Header />
          <main>
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
