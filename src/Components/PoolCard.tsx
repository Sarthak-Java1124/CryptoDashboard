"use client";

interface PoolData {
  pool: string;
  project: string;
  category: string;
  symbol: string;
  chain: string;
}

type TrendData = { direction: string; percentage: string; color: string };

type Props = {
  pool: PoolData;
  apy: number;
  apyMean30d: number;
  tvlUsd: number;
  prediction: number;
  sigma: number;
  trendData: TrendData;
  colorClass: string;
};

export default function PoolCard({ pool, apy, apyMean30d, tvlUsd, prediction, sigma, trendData, colorClass }: Props) {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 p-4 md:p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className={`relative w-10 h-10 md:w-14 md:h-14 ${colorClass} rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className="absolute inset-0 bg-white/20 rounded-2xl" />
          {pool.symbol ? pool.symbol.charAt(0).toUpperCase() : (pool.chain ? pool.chain.charAt(0).toUpperCase() : 'P')}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg md:text-xl text-white mb-1 group-hover:text-green-300 transition-colors">
            {pool.project || 'Unknown Project'}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="px-2 md:px-3 py-1 bg-gray-800/60 rounded-full text-xs text-gray-300 border border-gray-600/50 w-fit">
              {pool.category || 'DeFi Protocol'}
            </span>
            <span className="px-2 py-1 bg-green-500/20 rounded-md text-xs text-green-400 font-medium border border-green-500/30 w-fit">
              {pool.symbol || 'N/A'}
            </span>
          </div>
        </div>
      </div>

       <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
         <div className="bg-gray-800/40 rounded-xl p-3 md:p-4 border border-gray-700/50 hover:border-gray-600/70 transition-colors">
           <div className="mb-2">
             <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">TVL USD</span>
           </div>
           <span className="text-base md:text-lg font-bold text-white">
             ${tvlUsd > 1000000 ? (tvlUsd / 1000000).toFixed(2) + 'M' : 
               tvlUsd > 1000 ? (tvlUsd / 1000).toFixed(2) + 'K' : 
               tvlUsd.toFixed(2)}
           </span>
         </div>

         <div className="bg-gray-800/40 rounded-xl p-3 md:p-4 border border-gray-700/50 hover:border-gray-600/70 transition-colors">
           <div className="mb-2">
             <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">30D Avg</span>
           </div>
           <span className="text-base md:text-lg font-bold text-gray-300">{apyMean30d.toFixed(2)}%</span>
         </div>

         {prediction > 0 && (
           <div className="bg-gray-800/40 rounded-xl p-3 md:p-4 border border-gray-700/50 hover:border-gray-600/70 transition-colors">
             <div className="mb-2">
               <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Prediction</span>
             </div>
             <span className="text-base md:text-lg font-bold text-blue-400">{prediction.toFixed(2)}%</span>
           </div>
         )}

         {sigma > 0 && (
           <div className="bg-gray-800/40 rounded-xl p-3 md:p-4 border border-gray-700/50 hover:border-gray-600/70 transition-colors">
             <div className="mb-2">
               <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Risk Score</span>
             </div>
             <span className={`text-base md:text-lg font-bold ${sigma > 0.7 ? 'text-red-400' : sigma > 0.4 ? 'text-yellow-400' : 'text-green-400'}`}>
               {sigma.toFixed(2)}
             </span>
           </div>
         )}
       </div>

         <div className="relative z-10 bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-xl p-3 md:p-4 border border-gray-600/50 mb-4">
           <div className="flex items-center justify-between">
             <div>
               <span className="text-xs md:text-sm text-gray-300 font-medium">Current APY</span>
             </div>
             <span className={`text-2xl md:text-3xl font-black ${trendData.color} drop-shadow-lg`}>
               {apy.toFixed(2)}%
             </span>
           </div>
         </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm md:text-base font-medium ${trendData.color}`}>
            {trendData.direction} {trendData.percentage}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm text-gray-400">Risk Level:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            sigma > 0.7 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
            sigma > 0.4 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            {sigma > 0.7 ? 'High' : sigma > 0.4 ? 'Medium' : 'Low'}
          </span>
        </div>
      </div>
    </div>
  );
}



