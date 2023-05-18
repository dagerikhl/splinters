import { Header } from "@/common/components/layout/Header";
import { AppProviders } from "@/features/app/components/AppProviders";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "normalize.css/normalize.css";
import "@/common/style/globals.scss";

const inter = Inter({ subsets: ["latin-ext"] });

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
        <AppProviders>
          <Header />

          <main>{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
