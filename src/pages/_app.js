import { ThemeProvider } from 'styled-components';
import getConfig from 'next/config';
import '../styles/globals.css';
import '../styles/markdown.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { publicRuntimeConfig } = getConfig();

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = publicRuntimeConfig.PAYPAL_CLIENT_ID;

import theme from '../themes/default';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const paypalOptions = {
    "client-id": PAYPAL_CLIENT_ID,
    "enable-funding": "card",
    "disable-funding": "paylater,venmo",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <PayPalScriptProvider options={paypalOptions}>
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default MyApp;
