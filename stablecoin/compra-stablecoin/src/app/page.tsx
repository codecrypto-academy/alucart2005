'use client';

import { useState, useEffect } from 'react';
import WalletConnect from '@/components/WalletConnect';
import PurchaseForm from '@/components/PurchaseForm';
import { Coins, ShieldCheck, Zap } from 'lucide-react';
import { ethers } from 'ethers';

const EUROTOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account && typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_EUROTOKEN_ADDRESS!,
            EUROTOKEN_ABI,
            provider
          );
          const bal = await contract.balanceOf(account);
          const decimals = await contract.decimals();
          setBalance(ethers.formatUnits(bal, decimals));
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [account]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
            <Coins className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            EuroToken <span className="text-blue-500">EURT</span>
          </h1>
        </div>
        <WalletConnect />
      </header>

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-extrabold leading-tight">
              The Future of <br />
              <span className="text-blue-500">Digital Payments</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Buy EURT stablecoins instantly with your credit card. 1 EURT is always equal to 1 EUR, backed by blockchain security.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <ShieldCheck className="text-blue-500 mb-4" size={24} />
              <h3 className="font-bold mb-2">Secure</h3>
              <p className="text-sm text-gray-400">Fully audited smart contracts and Stripe-powered payments.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <Zap className="text-blue-500 mb-4" size={24} />
              <h3 className="font-bold mb-2">Instant</h3>
              <p className="text-sm text-gray-400">Tokens are minted directly to your wallet upon successful payment.</p>
            </div>
          </div>

          {account && (
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-8 rounded-3xl backdrop-blur-md">
              <p className="text-blue-400 font-medium mb-1">Your Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{balance}</span>
                <span className="text-xl font-medium text-gray-400">EURT</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Purchase Form */}
        <div>
          <PurchaseForm account={account} />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
        &copy; 2025 EuroToken Project. All rights reserved.
      </footer>
    </main>
  );
}
