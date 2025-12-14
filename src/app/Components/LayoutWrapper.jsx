'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatbotWidget from './ChatbotWidget';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Check if current path is admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  // Don't render Navbar, Footer, or Chatbot for admin routes
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Render normal layout for non-admin routes
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ChatbotWidget />
    </>
  );
}
