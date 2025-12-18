'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, LogOut } from 'lucide-react';

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
  };

  useEffect(() => {
    if (account) {
      // Fetch balance or other info if needed
    }
  }, [account]);

  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg">
          <span className="text-sm font-medium text-white">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            title="Disconnect"
          >
            <LogOut size={16} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          <Wallet size={20} />
          Connect Wallet
        </button>
      )}
    </div>
  );
}
