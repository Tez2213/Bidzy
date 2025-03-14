import { useState, useEffect } from 'react';
import { connectWallet } from '../../lib/blockchain/wallet';
import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';

interface UpdateWalletResponse {
  success: boolean;
  user?: User;
  error?: string;
}

interface ProfileProps {
  // Add any props if needed
}

const Profile: React.FC<ProfileProps> = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
        setWalletAddress(window.ethereum.selectedAddress);
      }
    };
    checkWallet();
  }, []);

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      
      // Update user profile in database
      await updateUserWallet(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mt-4">
        {walletAddress ? (
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Connected Wallet</p>
            <p className="font-mono">{walletAddress}</p>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;

export const updateUserWallet = async (walletAddress: string): Promise<UpdateWalletResponse> => {
  try {
    const response = await fetch('/api/user/update-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update wallet address');
    }

    const data = await response.json();
    return {
      success: true,
      user: data
    };
  } catch (error) {
    console.error('Error updating wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};