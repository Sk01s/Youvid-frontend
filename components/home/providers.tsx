"use client";

import type React from "react";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistor, store } from "@/lib/store";
import { useState } from "react";
import { PersistGate } from "redux-persist/lib/integration/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
