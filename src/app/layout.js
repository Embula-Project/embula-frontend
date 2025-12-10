import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ChatbotWidget from "./components/ChatbotWidget";
import Providers from "./providers";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer";
import CartMigrationHandler from "./Components/CartMigrationHandler";
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
          <Navbar />
          <PageTransition>
            <main className="flex-1">{children}</main>
          </PageTransition>
          <Footer />
          <ChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
