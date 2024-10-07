module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: {
      pure: true,
    }
  },
  publicRuntimeConfig: {
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_ORDERS_API: process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api/paypal/orders' : 'https://bruno-payments-ad6f4acc582a.herokuapp.com/api/paypal/orders',
    STRIPE_CLIENT_ID: process.env.STRIPE_CLIENT_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_ORDERS_API: process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api/stripe/orders' : ''
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BRUNO_PAYMENT_SERVICE_URL}/api/:path*`
      },
    ];
  },
}

