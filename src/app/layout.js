import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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


import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ChatbotWidget from "./Components/ChatbotWidget";
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
