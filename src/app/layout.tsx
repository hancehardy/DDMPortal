import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OrderProvider } from "@/context/OrderContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DDM Cabinet Door Portal",
  description: "Order custom cabinet doors online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OrderProvider>
          {children}
        </OrderProvider>
      </body>
    </html>
  );
} 