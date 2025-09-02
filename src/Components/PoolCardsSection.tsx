"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import TopCardsGrid from "@/Components/TopCardsGrid";

interface PoolData {
  pool: string;
  project: string;
  category: string;
  symbol: string;
  tvlUsd: string;
  apy: string;
  apyMean30d: string;
  sigma: string;
  chain: string;
}

const requiredLendingPools = [
  "db678df9-3281-4bc2-a8bb-01160ffd6d48",
  "c1ca08e4-d618-415e-ad63-fcec58705469",
  "8edfdf02-cdbb-43f7-bca6-954e5fe56813",
];

export default function PoolCardsSection() {
  const [pools, setPools] = useState<PoolData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPools = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://yields.llama.fi/pools");
      if (response.data.status === "success") {
        const filtered = response.data.data.filter((item: PoolData) =>
          requiredLendingPools.includes(item.pool)
        );
        setPools(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch pools", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  const getCardColor = (apy: number) => {
    if (apy > 20) return "green" as const;
    if (apy > 10) return "blue" as const;
    if (apy > 5) return "purple" as const;
    return "red" as const;
  };

  const getTrendData = (apy: number) => {
    const isPositive = apy > 0;
    const percentage = Math.abs(apy).toFixed(2);
    return {
      direction: isPositive ? "↗" : "↘",
      percentage: `${percentage}%`,
      color: isPositive ? "text-green-400" : "text-red-400",
    };
  };

  return (
    <TopCardsGrid
      loading={loading}
      pools={pools}
      getCardColor={getCardColor}
      getTrendData={getTrendData}
    />
  );
}
