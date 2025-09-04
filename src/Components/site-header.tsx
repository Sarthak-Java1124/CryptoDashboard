import { Button } from "@/Components/ui/button"
import { Separator } from "@/Components/ui/separator"
import { SidebarTrigger } from "@/Components/ui/sidebar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SiteHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backHref?: string;
}

export function SiteHeader({ title = "Documents", showBackButton = false, backHref = "/" }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {showBackButton && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href={backHref} className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </>
        )}
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/Sarthak-Java1124"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
