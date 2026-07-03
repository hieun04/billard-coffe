import { useEffect, useRef } from 'react';

export function useRealtime(fetchFn, interval = 5000, enabled = true) {
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    mountedRef.current = true;

    const poll = async () => {
      try {
        await fetchFn();
      } catch {
        // silent fail
      }
    };

    poll();
    const id = setInterval(poll, interval);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [fetchFn, interval, enabled]);
}
