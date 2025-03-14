import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { connectWallet } from '@/lib/blockchain/wallet';
import { updateUserWallet } from '@/lib/api/user';

export function Profile() {
  const { data: session } = useSession();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        setWalletAddress(window.ethereum.selectedAddress);
      }
    };
    checkWallet();
  }, []);

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const address = await connectWallet();
      setWalletAddress(address);
      
      const result = await updateUserWallet(address);
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mt-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {walletAddress ? (
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Connected Wallet</p>
            <p className="font-mono break-all">{walletAddress}</p>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-500/50 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;