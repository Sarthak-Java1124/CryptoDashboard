
"use client"
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { SidebarInset, SidebarProvider } from "@/Components/ui/sidebar"
import { AppSidebar } from "@/Components/app-sidebar"
import { SiteHeader } from "@/Components/site-header"
import { SectionCards } from "@/Components/section-cards"
import { ChartAreaInteractive } from "@/Components/chart-area-interactive"
import { DataTable } from "@/Components/data-table"

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

export default function Page() {
  const { isConnected } = useAccount();
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

  const handleCategoryChange = useCallback((category: 'lending' | 'liquid' | 'yield') => {
    if (category === 'yield' && !isConnected) {
      return;
    }
    setSelectedCategory(category);
  }, [isConnected]);
  useEffect(() => {
    if (selectedCategory === 'yield' && !isConnected) {
      setSelectedCategory('lending');
    }
  }, [isConnected, selectedCategory]);

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

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="DeFi Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards pools={pools} loading={loading} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive pools={pools} selectedCategory={selectedCategory} />
              </div>
              <DataTable pools={pools} loading={loading} selectedCategory={selectedCategory} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
