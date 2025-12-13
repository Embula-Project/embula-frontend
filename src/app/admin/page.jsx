'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import AdminHeader from '../Components/AdminHeader';
import OrdersSection from '../components/admin/OrdersSection';
import FoodItemsSection from '../components/admin/FoodItemsSection';
import PaymentsSection from '../components/admin/PaymentsSection';
import EarningsSection from '../components/admin/EarningsSection';
import UserManagementSection from '../components/admin/UserManagementSection';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('orders');
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      console.log('[AdminPage] Unauthorized access, redirecting to home...');
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated or not admin (will redirect)
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'orders':
        return <OrdersSection />;
      case 'food-items':
        return <FoodItemsSection />;
      case 'payments':
        return <PaymentsSection />;
      case 'earnings':
        return <EarningsSection />;
      case 'user-management':
        return <UserManagementSection />;
      default:
        return <OrdersSection />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>
    </div>
  );
}
