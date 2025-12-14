'use client';
import { useEffect } from 'react';
import { validateAndMigrateCart } from '../utils/cartMigration';

/**
 * Cart Migration Component
 * Runs cart validation on app startup (client-side only)
 */
export default function CartMigrationHandler() {
  useEffect(() => {
    // Run cart migration once on mount
    validateAndMigrateCart();
  }, []);

  // This component doesn't render anything
  return null;
}
