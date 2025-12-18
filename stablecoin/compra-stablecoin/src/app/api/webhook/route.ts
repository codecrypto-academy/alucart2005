import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ethers } from 'ethers';

export const dynamic = 'force-dynamic';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27-acacia' as any,
    })
  : null;

const EUROTOKEN_ABI = [
  "function mint(address to, uint256 amount) external",
  "function decimals() view returns (uint8)"
];

export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const walletAddress = paymentIntent.metadata.walletAddress;
    const amountInCents = paymentIntent.amount;

    console.log(`Payment succeeded for ${walletAddress}: ${amountInCents} cents`);

    try {
      // Mint tokens
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_EUROTOKEN_ADDRESS!,
        EUROTOKEN_ABI,
        wallet
      );

      const decimals = await contract.decimals();
      // Amount in cents (2 decimals) to EURT (6 decimals)
      // 100 cents = 1 EUR = 1,000,000 units (6 decimals)
      // So we multiply cents by 10^(decimals - 2)
      const mintAmount = BigInt(amountInCents) * BigInt(10 ** (Number(decimals) - 2));

      console.log(`Minting ${mintAmount} units to ${walletAddress}`);
      const tx = await contract.mint(walletAddress, mintAmount);
      await tx.wait();
      console.log(`Minting successful: ${tx.hash}`);

    } catch (mintError) {
      console.error('Error minting tokens:', mintError);
      // In a real app, you'd want to retry or log this for manual intervention
    }
  }

  return NextResponse.json({ received: true });
}
