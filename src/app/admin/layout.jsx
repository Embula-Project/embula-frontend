import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "../providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Dashboard - Embula Restaurant",
  description: "Admin panel for managing Embula Restaurant operations",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen`}>
        <Providers>
          {/* No Navbar, Footer, or Chatbot for admin */}
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
