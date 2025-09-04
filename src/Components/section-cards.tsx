import { IconTrendingUp } from "@tabler/icons-react"
import { Button } from "@/Components/ui/button"
import { useAccount, useConnect, useDisconnect } from "wagmi"

import { Badge } from "@/Components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"

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

interface SectionCardsProps {
  pools: PoolData[];
  loading: boolean;
  selectedCategory: 'lending' | 'liquid' | 'yield';
  onCategoryChange: (category: 'lending' | 'liquid' | 'yield') => void;
}

export function SectionCards({ pools, loading, selectedCategory, onCategoryChange }: SectionCardsProps) {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const totalTVL = pools.reduce((sum, pool) => sum + parseFloat(pool.tvlUsd || '0'), 0);
  const avgAPY = pools.length > 0 ? pools.reduce((sum, pool) => sum + parseFloat(pool.apy || '0'), 0) / pools.length : 0;
  const avgAPY30d = pools.length > 0 ? pools.reduce((sum, pool) => sum + parseFloat(pool.apyMean30d || '0'), 0) / pools.length : 0;
  const totalPools = pools.length;

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'lending':
        return 'Lending Pools';
      case 'liquid':
        return 'Liquid Staking';
      case 'yield':
        return 'Yield Aggregators';
      default:
        return 'DeFi Pools';
    }
  };

  const formatTVL = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant={selectedCategory === 'lending' ? 'default' : 'outline'}
            onClick={() => onCategoryChange('lending')}
            size="sm"
          >
            Lending Pools
          </Button>
          <Button 
            variant={selectedCategory === 'liquid' ? 'default' : 'outline'}
            onClick={() => onCategoryChange('liquid')}
            size="sm"
          >
            Liquid Staking
          </Button>
          <Button 
            variant={selectedCategory === 'yield' ? 'default' : 'outline'}
            onClick={() => isConnected ? onCategoryChange('yield') : undefined}
            size="sm"
            disabled={!isConnected}
            className={!isConnected ? "opacity-50 cursor-not-allowed" : ""}
            title={!isConnected ? "Connect wallet to access Yield Aggregators" : ""}
          >
            Yield Aggregators
            {!isConnected && <span className="ml-1 text-xs">🔒</span>}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => connect({ connector: connectors[0] })}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total TVL</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : formatTVL(totalTVL)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                {getCategoryTitle()}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Total Value Locked <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Across all {selectedCategory} pools
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Average APY</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : `${avgAPY.toFixed(2)}%`}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                Current
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Current yield rate <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Average across all pools
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>30-Day Avg APY</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : `${avgAPY30d.toFixed(2)}%`}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                30D Avg
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Historical performance <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">30-day average yield</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Pools</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : totalPools}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                Active
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Total pool count <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Currently tracked pools</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
