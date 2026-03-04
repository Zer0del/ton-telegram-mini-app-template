import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const manifestUrl = 'https://tonpanda.com/wp-content/uploads/2024/10/tonconnect-manifest.json';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const Root = () => {
  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp;
    if (webApp) {
      webApp.ready();
      webApp.expand();                    // растягивает на весь экран
      webApp.setHeaderColor('bg_color');  // под цвет Telegram
    }
  }, []);

  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <QueryClientProvider client={queryClient}>
        <Root />
      </QueryClientProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
