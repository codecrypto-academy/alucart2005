'use client';

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CreditCard, Loader2 } from 'lucide-react';

interface PurchaseFormProps {
  account: string | null;
}

export default function PurchaseForm({ account }: PurchaseFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !account) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Create Payment Intent on the server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), account }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        setMessage(`Error: ${backendError}`);
        setLoading(false);
        return;
      }

      // 2. Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        setMessage(`Payment failed: ${stripeError.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        setMessage('Payment successful! Your tokens are being minted...');
        // The webhook will handle the minting
      }
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Amount (EUR)</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            min="1"
          />
          <span className="absolute right-4 top-3 text-gray-400 font-medium">EUR</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Card Details</label>
        <div className="bg-black/20 border border-white/10 rounded-xl px-4 py-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#fff',
                  '::placeholder': { color: '#6b7280' },
                },
                invalid: { color: '#ef4444' },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || !account}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <CreditCard size={20} />
        )}
        {loading ? 'Processing...' : `Buy ${amount || '0'} EURT`}
      </button>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.includes('successful') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {message}
        </div>
      )}

      {!account && (
        <p className="text-center text-sm text-gray-400">Please connect your wallet to purchase tokens.</p>
      )}
    </form>
  );
}
