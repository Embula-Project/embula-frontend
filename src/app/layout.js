import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import PageTransition from "./components/PageTransition";
import CartMigrationHandler from "./Components/CartMigrationHandler";
import LayoutWrapper from "./Components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Embula Restaurant - Fine Dining Experience",
  description: "Experience culinary excellence at Embula Restaurant. Reserve your table today for an unforgettable dining experience.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen`}>
        <Providers>
          <CartMigrationHandler />
          <LayoutWrapper>
            <PageTransition>
              <main className="flex-1">{children}</main>
            </PageTransition>
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
