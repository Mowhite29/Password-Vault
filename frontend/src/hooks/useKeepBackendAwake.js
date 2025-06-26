import { useEffect } from 'react';

const useKeepBackendAwake = (intervalMinutes = 4) => {
  useEffect(() => {
    const pingUrl = import.meta.env.VITE_BACKEND_URL + '/ping/'
    if (!pingUrl) return;

    // Initial wake-up ping
    fetch(pingUrl).catch((err) =>
      console.log('Initial backend wake-up failed:', err)
    );

    // Set interval to keep backend awake
    const interval = setInterval(() => {
      fetch(pingUrl).catch((err) =>
        console.log('Keep-alive ping failed:', err)
      );
    }, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [intervalMinutes]);
};

export default useKeepBackendAwake;
