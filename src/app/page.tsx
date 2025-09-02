"use client"
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import HeaderBar from "@/Components/HeaderBar";
import CategorySelector from "@/Components/CategorySelector";
import TopCardsGrid from "@/Components/TopCardsGrid";
import AssetsTable from "@/Components/AssetsTable";

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
  "8edfdf02-cdbb-43f7-bca6-954e5fe56813"
];

const requiredLiquidStaking = [
  "747c1d2a-c668-4682-b9f9-296708a3dd90",
  "80b8bf92-b953-4c20-98ea-c9653ef2bb98",
  "90bfb3c2-5d35-4959-a275-ba5085b08aa3"
];

const requiredYieldAggregator = [
  "107fb915-ab29-475b-b526-d0ed0d3e6110",
  "05a3d186-2d42-4e21-b1f0-68c079d22677",
  "1977885c-d5ae-4c9e-b4df-863b7e1578e6"
];

export default function Dashboard() {
  const [pools, setPools] = useState<PoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'lending' | 'liquid' | 'yield'>('lending');

  const getPoolIds = useCallback(() => {
    switch (selectedCategory) {
      case 'lending':
        return requiredLendingPools;
      case 'liquid':
        return requiredLiquidStaking;
      case 'yield':
        return requiredYieldAggregator;
      default:
        return requiredLendingPools;
    }
  }, [selectedCategory]);

  const getCategoryTitle = useCallback(() => {
    switch (selectedCategory) {
      case 'lending':
        return 'Lending Pools';
      case 'liquid':
        return 'Liquid Staking';
      case 'yield':
        return 'Yield Aggregators';
      default:
        return 'Lending Pools';
    }
  }, [selectedCategory]);

  useEffect(() => {
    const jsonFetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://yields.llama.fi/pools");
        
        if (response.data.status === "success") {
          const currentPoolIds = getPoolIds();
          const filteredPools = response.data.data.filter((item: PoolData) =>
            currentPoolIds.includes(item.pool)
          );
          setPools(filteredPools);
        }
      } catch (error) {
        console.log("The error is fetching response is : ", error);
      } finally {
        setLoading(false);
      }
    };
    
    jsonFetch();
  }, [selectedCategory, getPoolIds]);

  const getCardColor = (apy: number) => {
    if (apy > 20) return 'green';
    if (apy > 10) return 'blue';
    if (apy > 5) return 'purple';
    return 'red';
  };

  const getTrendData = (apy: number) => {
    const isPositive = apy > 0;
    const percentage = Math.abs(apy).toFixed(2);
    return {
      direction: isPositive ? '↗' : '↘',
      percentage: `${percentage}%`,
      color: isPositive ? 'text-green-400' : 'text-red-400'
    };
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Poppins'] font-poppins">
      <HeaderBar assetsCount={pools.length} />
      <CategorySelector selected={selectedCategory} onChange={setSelectedCategory} />
      <div className="p-3 md:p-6 grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <TopCardsGrid loading={loading} pools={pools} getCardColor={getCardColor} getTrendData={getTrendData} />
          <AssetsTable loading={loading} pools={pools} getCategoryTitle={getCategoryTitle} />
        </div>
      </div>
    </div>
  );
}