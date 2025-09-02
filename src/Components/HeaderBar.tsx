"use client";

import { motion } from "framer-motion";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { useState } from "react";

type HeaderBarProps = {
  assetsCount: number;
};

export default function HeaderBar({ assetsCount }: HeaderBarProps) {
  const { connectAsync, connectors, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const walletToBeConnected = connectors.find((c) => c.id == "injected");
      if (walletToBeConnected != null) {
        await connectAsync({ connector: walletToBeConnected });
      } else {
        alert("You don't have any wallet present");
      }
    } catch (error) {
      console.log("The error in connecting wallet is : ", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };
  return (
    <div className="bg-black border-b border-gray-700 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
          <h1 className="text-2xl md:text-3xl font-semibold font-poppins text-green-400">Dashboard</h1>
          <span className="text-gray-300 text-base md:text-lg">Track, manage and forecast your assets</span>
          <span className="bg-gray-700 px-3 md:px-4 py-2 rounded-full text-sm md:text-base w-fit">{assetsCount} Assets</span>
        </div>
        <div className="flex items-center gap-3">
          {isConnected && (
            <span className="text-sm text-gray-300">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(34,197,94,0.25)" }}
            whileTap={{ scale: 0.98 }}
            onClick={isConnected ? handleDisconnect : handleConnect}
            disabled={isConnecting || isPending}
            className={`px-3 md:px-4 py-2 rounded-md font-medium transition-colors text-sm md:text-base ${
              isConnected
                ? "bg-red-600 text-white hover:bg-red-500"
                : isConnecting || isPending
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-500"
            }`}
          >
            {isConnecting || isPending ? "Connecting..." : isConnected ? "Disconnect" : "Connect"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}


