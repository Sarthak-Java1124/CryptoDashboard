"use client";

interface PoolData {
  pool: string;
  project: string;
  category: string;
  symbol: string;
  tvlUsd: string;
  apy: string;
  apyMean30d: string;
  sigma: string;
}

type Props = {
  loading: boolean;
  pools: PoolData[];
  getCategoryTitle: () => string;
};

export default function AssetsTable({ loading, pools, getCategoryTitle }: Props) {
  return (
    <div className="bg-black rounded-lg border border-gray-700">
      <div className="p-3 md:p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <h2 className="text-base md:text-lg font-semibold font-poppins">{getCategoryTitle()}</h2>
            <span className="bg-gray-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">{pools.length} Assets</span>
          </div>
       
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-3 md:p-4 text-gray-400 font-medium font-poppins text-sm md:text-base">Protocol</th>
              <th className="text-left p-3 md:p-4 text-gray-400 font-medium cursor-pointer font-poppins text-sm md:text-base hidden md:table-cell">
                <div className="flex items-center gap-1">Category<span>↕</span></div>
              </th>
              <th className="text-left p-3 md:p-4 text-gray-400 font-medium cursor-pointer font-poppins text-sm md:text-base">Symbol</th>
              <th className="text-left p-3 md:p-4 text-gray-400 font-medium cursor-pointer font-poppins text-sm md:text-base hidden sm:table-cell">
                <div className="flex items-center gap-1">TVL USD<span>↕</span></div>
              </th>
              <th className="text-left p-3 md:p-4 text-gray-400 font-medium cursor-pointer font-poppins text-sm md:text-base">APY</th>
              <th className="text-left p-3 md:p-4 text-gray-400 font-medium cursor-pointer font-poppins text-sm md:text-base hidden lg:table-cell">
                <div className="flex items-center gap-1">30D Avg APY<span>↕</span></div>
              </th>
              <th className="text-left p-3 md:p-4 text-gray-400 font-medium cursor-pointer font-poppins text-sm md:text-base hidden sm:table-cell">
                <div className="flex items-center gap-1">Risk Score<span>↕</span></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-700 animate-pulse">
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-6 md:w-8 h-6 md:h-8 bg-gray-600 rounded-full"></div>
                      <div className="h-3 md:h-4 bg-gray-600 rounded w-20 md:w-24"></div>
                    </div>
                  </td>
                  <td className="p-3 md:p-4 hidden md:table-cell"><div className="h-3 md:h-4 bg-gray-600 rounded w-16 md:w-20"></div></td>
                  <td className="p-3 md:p-4"><div className="h-3 md:h-4 bg-gray-600 rounded w-12 md:w-16"></div></td>
                  <td className="p-3 md:p-4 hidden sm:table-cell"><div className="h-3 md:h-4 bg-gray-600 rounded w-16 md:w-20"></div></td>
                  <td className="p-3 md:p-4"><div className="h-3 md:h-4 bg-gray-600 rounded w-12 md:w-16"></div></td>
                  <td className="p-3 md:p-4 hidden lg:table-cell"><div className="h-3 md:h-4 bg-gray-600 rounded w-16 md:w-20"></div></td>
                  <td className="p-3 md:p-4 hidden sm:table-cell"><div className="h-3 md:h-4 bg-gray-600 rounded w-12 md:w-16"></div></td>
                </tr>
              ))
            ) : pools.length > 0 ? (
              pools.map((pool) => (
                <tr key={pool.pool} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer group" onClick={() => window.location.href = `/pool/${pool.pool}`}>
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-6 md:w-8 h-6 md:h-8 bg-gray-600 rounded-full"></div>
                      <span className="font-medium text-sm md:text-base">{pool.project || 'DeFi Protocol'}</span>
                      <span className="text-green-400 text-xs ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                  </td>
                  <td className="p-3 md:p-4 text-gray-300 text-xs md:text-sm hidden md:table-cell">{pool.category || getCategoryTitle()}</td>
                  <td className="p-3 md:p-4 text-green-400 font-medium text-xs md:text-sm">{pool.symbol || 'N/A'}</td>
                  <td className="p-3 md:p-4 text-gray-300 text-xs md:text-sm hidden sm:table-cell">{pool.tvlUsd}</td>
                  <td className="p-3 md:p-4 text-gray-300 text-xs md:text-sm">{pool.apy}</td>
                  <td className="p-3 md:p-4 text-gray-300 text-xs md:text-sm hidden lg:table-cell">{pool.apyMean30d}</td>
                  <td className="p-3 md:p-4 text-xs md:text-sm hidden sm:table-cell">{pool.sigma || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-6 md:p-8 text-center text-gray-400 text-sm md:text-base">No pools data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



