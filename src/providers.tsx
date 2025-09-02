"use client";


import { wagmiConfig } from "@/lib/wagmiConfig";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { WagmiProvider } from "wagmi";


function App({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    
      <WagmiProvider config={wagmiConfig} reconnectOnMount={false} >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
   
  );
}

export default App;