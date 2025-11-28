'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    setTransitionStage('fadeOut');
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage('fadeIn');
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div 
      className={`page-transition-wrapper ${transitionStage}`}
      style={{
        animation: transitionStage === 'fadeIn' 
          ? 'fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards' 
          : 'fadeOutDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
      }}
    >
      {displayChildren}
    </div>
  );
}
