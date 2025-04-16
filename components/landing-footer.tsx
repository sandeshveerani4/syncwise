import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 SyncWise AI. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
