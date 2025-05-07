import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    return resolvedTheme;
  }

  // Default to light theme during SSR
  return 'light';
}
