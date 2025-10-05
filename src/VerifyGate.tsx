import { MiniKit } from '@worldcoin/minikit-js';
import { useEffect, useState } from 'react';

export default function VerifyGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already authenticated
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('wallet_auth');
      if (savedAuth) {
        try {
          JSON.parse(savedAuth);
          setOk(true);
        } catch (e) {
          console.error('Failed to parse saved auth:', e);
          localStorage.removeItem('wallet_auth');
        }
      }
    }

    // Check if MiniKit is installed after component mount
    const checkInstalled = () => {
      const installed = MiniKit.isInstalled();
      setIsInstalled(installed);
      setIsChecking(false);
    };

    // Give MiniKit a moment to fully initialize
    const timer = setTimeout(checkInstalled, 200);
    return () => clearTimeout(timer);
  }, []);

  async function handleAuth() {
    setError(null);

    try {
      // Generate a random nonce for security
      const nonce = Math.random().toString(36).substring(2, 15);

      console.log('Starting wallet authentication with nonce:', nonce);

      // Use commandsAsync instead of commands for async/await
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce,
        statement: 'Sign in to Simple Roulette',
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      console.log('WalletAuth full result:', JSON.stringify(result, null, 2));

      // Check finalPayload response from World App
      const payload = result.finalPayload as any;

      if (!payload) {
        setError('No response from World App. Please try again.');
        console.error('finalPayload is null or undefined');
        return;
      }

      if (payload.status === 'success') {
        // Success: wallet authenticated
        console.log('Authentication successful!', {
          address: payload.address,
          message: payload.message,
          signature: payload.signature,
        });

        // Store authentication state
        const authData = {
          address: payload.address,
          message: payload.message,
          signature: payload.signature,
          timestamp: Date.now(),
        };
        localStorage.setItem('wallet_auth', JSON.stringify(authData));
        setOk(true);
      } else if (payload.status === 'error') {
        // Error response from WalletAuth
        const errorCode = payload.error_code || 'unknown_error';
        const errorDetails = payload.details || '';
        setError(`Authentication error: ${errorCode}${errorDetails ? ` - ${errorDetails}` : ''}`);
        console.error('WalletAuth error:', payload);
      } else {
        // Unexpected response format
        setError(`Unexpected response format: ${JSON.stringify(payload)}`);
        console.error('Unexpected payload structure:', payload);
      }
    } catch (e) {
      console.error('Authentication exception:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Authentication failed: ${errorMessage}`);
    }
  }

  // Loading state
  if (isChecking) {
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

  // Not in World App
  if (!ok && !isInstalled) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: 20,
          fontFamily: 'system-ui',
          textAlign: 'center',
          backgroundColor: '#1e293b',
          color: 'white',
        }}
      >
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Open in World App</h3>
        <p style={{ color: '#94a3b8' }}>
          Please open this page inside World App to verify with World ID.
        </p>
      </div>
    );
  }

  // Not authenticated - show sign-in UI
  if (!ok) {
    return (
      <div className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4">
        <div className="relative z-10 bg-slate-700/80 backdrop-blur-xl rounded-3xl p-10 border border-slate-600 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Welcome to Simple Roulette
          </h2>
          <p className="text-slate-300 mb-6 text-center">
            Please sign in with your World ID to continue
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          <button
            onClick={handleAuth}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xl py-5 px-10 rounded-xl transition-colors"
          >
            Sign In with World ID
          </button>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}
