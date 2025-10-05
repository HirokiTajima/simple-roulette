import { MiniKit } from '@worldcoin/minikit-js';
import React, { useEffect, useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Install MiniKit with App ID from environment variable
    const appId = process.env.REACT_APP_NEXT_PUBLIC_APP_ID || process.env.NEXT_PUBLIC_APP_ID;

    if (!appId) {
      console.error('NEXT_PUBLIC_APP_ID is not set in .env.local');
      setIsReady(true); // Allow app to run anyway for development
      return;
    }

    MiniKit.install(appId);

    // Wait a moment for MiniKit to initialize
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'system-ui',
          backgroundColor: '#1e293b',
          color: 'white',
        }}
      >
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
