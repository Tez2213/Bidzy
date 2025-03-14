import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      selectedAddress: string | null;
    }
  }
}

export const connectWallet = async () => {
  try {
    const provider = await detectEthereumProvider();
    
    if (!provider) {
      throw new Error('Please install MetaMask!');
    }

    const accounts = await window.ethereum!.request({
      method: 'eth_requestAccounts'
    });

    return accounts[0];
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};