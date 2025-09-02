"use client";

import PoolCard from "@/Components/PoolCard";
import GreenCard from "@/Components/GreenCard";

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
  prediction?: string;
}

type Props = {
  loading: boolean;
  pools: PoolData[];
  getCardColor: (apy: number) => 'green' | 'blue' | 'purple' | 'red';
  getTrendData: (apy: number) => { direction: string; percentage: string; color: string };
};

export default function TopCardsGrid({ loading, pools, getCardColor, getTrendData }: Props) {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500'
  } as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <GreenCard key={i} withHover className="bg-black">
            <div className="h-48 bg-gray-700 rounded"></div>
          </GreenCard>
        ))
      ) : pools.length > 0 ? (
        pools.slice(0, 3).map((pool) => {
          const apy = parseFloat(pool.apy || '0');
          const apyMean30d = parseFloat(pool.apyMean30d || '0');
          const tvlUsd = parseFloat(pool.tvlUsd || '0');
          const prediction = parseFloat(pool.prediction || '0');
          const sigma = parseFloat(pool.sigma || '0');
          const trendData = getTrendData(apy);
          const cardColor = getCardColor(apy);
          return (
            <PoolCard
              key={pool.pool}
              pool={pool}
              apy={apy}
              apyMean30d={apyMean30d}
              tvlUsd={tvlUsd}
              prediction={prediction}
              sigma={sigma}
              trendData={trendData}
              colorClass={colorClasses[cardColor]}
            />
          );
        })
      ) : (
        Array.from({ length: 3 }).map((_, i) => (
          <GreenCard key={i} withHover className="bg-black">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">-</div>
              <div>
                <h3 className="font-semibold text-gray-400">No Data</h3>
                <p className="text-sm text-gray-400">Loading...</p>
              </div>
            </div>
            <div className="h-48 bg-gray-700 rounded"></div>
          </GreenCard>
        ))
      )}
    </div>
  );
}



