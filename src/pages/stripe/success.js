import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { paymentSuccess } from '../../api/stripe';
import { productMap } from 'src/utils/productMap';

const StripeCheckoutSuccess = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); 

  const paymentSuccessMutation = useMutation({
    mutationFn: ({ sessionId, orderNumber }) => paymentSuccess({ sessionId, orderNumber }),
    onSuccess: (res) => {
      if (!res?.error && res?.data?.subscription) {
        setOrderDetails(res.data.subscription);
      } else {
        setErrorMessage('Failed to fetch order details.');
      }
    },
    onError: (error) => {
      setErrorMessage('Failed to fetch order details.');
    },
  });

  useEffect(() => {
    const { sessionId, orderNumber } = router.query;
    if (sessionId && orderNumber) {
      paymentSuccessMutation.mutate({ sessionId, orderNumber });
    }
  }, [router.query]);

  const handleGoBack = () => {
    router.push('/'); 
  };

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Head>
        <title>Payment Success</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful</h1>

        {errorMessage ? (
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">{errorMessage}</p>
            <button
              onClick={handleGoBack}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-md px-4 py-2 transition"
            >
              Back to Website
            </button>
          </div>
        ) : orderDetails ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-2">Thank you for your purchase!</p>
            <p className="text-gray-600 mb-4">Your order has been processed successfully.</p>

            <h2 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Order Details</h2>

            <div className="mb-4">
              <p className="text-gray-600 my-2">
                <span className="font-semibold text-gray-900">{productMap[orderDetails.plan]}</span>
              </p>
              <p className="text-gray-600 my-2">
                Order Number: <span className="font-semibold">{orderDetails.orderNumber}</span>
              </p>
            </div>

            <p className="text-gray-600 mb-4">
              Your order details have been successfully emailed to <span className="font-semibold">{orderDetails.billingEmail}</span>.
            </p>

            {orderDetails.licenses > 1 && (
              <p className="text-gray-600 mb-4">
                You can manage your licenses <a href="/license-manager" className="text-yellow-600 hover:underline">here</a>.
              </p>
            )}

            <button
              onClick={handleGoBack}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-md px-4 py-2 transition"
            >
              Back to Website
            </button>
          </div>
        ) : (
          <p className="text-lg text-gray-700">Fetching order details...</p>
        )}
      </div>
    </div>
  );
};

export default StripeCheckoutSuccess;
