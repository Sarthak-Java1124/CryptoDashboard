import { SidebarInset, SidebarProvider } from "@/Components/ui/sidebar"
import { AppSidebar } from "@/Components/app-sidebar"
import { SiteHeader } from "@/Components/site-header"

import { ChartAreaInteractive } from "@/Components/chart-area-interactive"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"

async function getPoolData(poolId: string) {
  const res = await fetch(`https://yields.llama.fi/chart/${poolId}`, {
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  return json.data || [];
}

async function getPoolInfo(poolId: string) {
  const res = await fetch(`https://yields.llama.fi/pools`, {
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  if (json.status === "success") {
    return json.data.find((pool: { pool: string }) => pool.pool === poolId) || null;
  }
  return null;
}

function getMonthlyAPY(data: Array<{ timestamp: string | number; apy: number }>) {
  const monthlyData: { date: string; apy: number }[] = [];

  data.forEach((d) => {
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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rawData = await getPoolData(id);
  const poolInfo = await getPoolInfo(id);
  const monthlyData = getMonthlyAPY(rawData);

  const pools = poolInfo ? [poolInfo] : [];

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
        <SiteHeader 
          title={poolInfo ? `${poolInfo.project} Pool` : 'Pool Details'} 
          showBackButton={true} 
          backHref="/" 
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {poolInfo ? `${poolInfo.project} - ${poolInfo.symbol}` : 'Pool Details'}
                    </CardTitle>
                    <CardDescription>
                      {poolInfo ? `${poolInfo.category} • ${poolInfo.chain}` : 'Loading pool information...'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {poolInfo && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current APY</p>
                          <p className="text-2xl font-bold">{parseFloat(poolInfo.apy).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">30D Avg APY</p>
                          <p className="text-2xl font-bold">{parseFloat(poolInfo.apyMean30d).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">TVL</p>
                          <p className="text-2xl font-bold">
                            ${parseFloat(poolInfo.tvlUsd).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Volatility</p>
                          <p className="text-2xl font-bold">{parseFloat(poolInfo.sigma).toFixed(2)}%</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>APY Performance History</CardTitle>
                    <CardDescription>
                      Historical APY data for this pool
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {monthlyData.length > 0 ? (
                      <div className="h-[400px] w-full">
                        <ChartAreaInteractive pools={pools} selectedCategory={poolInfo?.category || 'lending'} />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No historical data available for this pool.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="px-4 lg:px-6">
                
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
