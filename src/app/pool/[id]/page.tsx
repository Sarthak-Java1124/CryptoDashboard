import LineGraph from "@/Components/Linechart";
import GreenCard from "@/Components/GreenCard";
import PoolCardsSection from "@/Components/PoolCardsSection";

interface ChartDataPoint {
  timestamp: string | number;
  apy: number;
}

async function getPoolData(poolId: string) {
  const res = await fetch(`https://yields.llama.fi/chart/${poolId}`, {
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  return json.data || [];
}

function getMonthlyAPY(data: ChartDataPoint[]) {
  
  const monthlyData: { date: string; apy: number }[] = [];

  data.forEach((d: ChartDataPoint) => {
  
    let date: Date;
    if (typeof d.timestamp === "string") {
      date = new Date(d.timestamp); 
    } else {
      date = new Date(d.timestamp * 1000); 
    }

    
    if (isNaN(date.getTime())) return;


    if (date.getDate() !== 1) return;

   
    const formattedDate = date.toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });

    
    const alreadyExists = monthlyData.some((entry) => entry.date === formattedDate);
    if (alreadyExists) return;

    
    monthlyData.push({
      date: formattedDate,
      apy: d.apy,
    });
  });

  return monthlyData.slice(-12);
}


export default async function PoolPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const rawData = await getPoolData(id);
  const monthlyData = getMonthlyAPY(rawData);

  return (
    <main className="min-h-screen p-3 md:p-6 space-y-4 md:space-y-6 bg-black text-green-100">
       <GreenCard>
         <h1 className="text-2xl md:text-3xl font-bold text-green-400">Explore the Graphs</h1>
         <p className="text-base md:text-lg text-green-200/80">Other pool details go here…</p>
       </GreenCard>

      <PoolCardsSection />

       <GreenCard title="Dive into the Stats" className="min-h-[450px] md:min-h-[650px]">
         {monthlyData.length > 0 ? (
           <div className="h-[350px] md:h-[600px] w-full">
             <LineGraph data={monthlyData} />
           </div>
         ) : (
           <p className="text-green-300/80 text-sm md:text-base">
             No monthly chart data available for this pool.
           </p>
         )}
       </GreenCard>
    </main>
  );
}
