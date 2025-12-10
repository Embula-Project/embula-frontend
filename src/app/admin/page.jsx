'use client';
import { useState } from 'react';
import AdminHeader from '../Components/AdminHeader';
import OrdersSection from '../components/admin/OrdersSection';
import FoodItemsSection from '../components/admin/FoodItemsSection';
import PaymentsSection from '../components/admin/PaymentsSection';
import EarningsSection from '../components/admin/EarningsSection';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('orders');

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
