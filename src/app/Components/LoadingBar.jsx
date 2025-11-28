'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <div 
        className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 animate-loading-bar"
        style={{
          animation: 'loadingBar 0.5s ease-in-out'
        }}
      />
    </div>
  );
}
