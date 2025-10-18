import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "Customer Dashboard - Embula",
  description: "Customer portal for Embula restaurant",
};

export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
