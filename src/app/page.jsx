'use client';
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import HeroSection from "./Components/HeroSection";
import DiscountSection from "./Components/DiscountSection";
import SpecialDishesSection from "./Components/SpecialDishesSection";
import AboutSection from "./Components/AboutSection";
import CTASection from "./Components/CTASection";
import Login from "./login/page";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize state immediately from search params to prevent flicker
  const loginParam = searchParams.get('login');
  const returnParam = searchParams.get('return') || searchParams.get('redirect');
  const [showLogin, setShowLogin] = useState(loginParam === 'true');
  const [returnUrl, setReturnUrl] = useState(returnParam);

  useEffect(() => {
    // Sync state with URL changes
    const newLoginParam = searchParams.get('login');
    const newReturnParam = searchParams.get('return') || searchParams.get('redirect');
    
    setShowLogin(newLoginParam === 'true');
    setReturnUrl(newReturnParam);
  }, [searchParams]);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    // Redirect to return URL if provided
    if (returnUrl) {
      router.push(returnUrl);
    }
  };

  if (showLogin) {
    return (
      <div className="bg-black min-h-screen">
        <Login onLoginSuccess={handleLoginSuccess} returnUrl={returnUrl} />
      </div>
    );
  }

  return (
    <div className="bg-black">
      <HeroSection />
      <DiscountSection />
      <SpecialDishesSection />
      <AboutSection />
      <CTASection />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
