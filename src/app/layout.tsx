import { Header } from "@/common/components/layout/Header";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Splinters",
  description: "Explore the Splintering of the Cosmere",
};

export interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />

        <main>{children}</main>
      </body>
    </html>
  );
}
