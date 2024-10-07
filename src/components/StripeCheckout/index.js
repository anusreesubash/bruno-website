import { loadStripe } from '@stripe/stripe-js';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const stripePromise = loadStripe(publicRuntimeConfig.STRIPE_PUBLISHABLE_KEY);

export const handleCheckout = async (checkoutItem) => {
  const stripe = await stripePromise;

  const response = await fetch(publicRuntimeConfig.STRIPE_ORDERS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkoutItem),
  });

  const { sessionId } = await response.json();

  const { error } = await stripe.redirectToCheckout({ sessionId });

  if (error) {
    console.error('Error:', error);
  }
};
