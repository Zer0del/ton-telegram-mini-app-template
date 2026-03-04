import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider } from './hooks/useTelegram';

const manifestUrl = new URL('./tonconnect-manifest.json', import.meta.url).toString();

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <QueryClientProvider client={queryClient}>
        <TelegramProvider>
          <App />
        </TelegramProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
