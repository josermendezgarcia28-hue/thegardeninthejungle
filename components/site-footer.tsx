import Link from 'next/link'
import { Leaf } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/15 bg-secondary/25 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 font-serif text-lg">
            <span className="flex size-8 items-center justify-center rounded-full bg-secondary/30 text-primary">
              <Leaf className="size-4" aria-hidden="true" />
            </span>
            The Garden in the Jungle
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A place where plants and people come together. Experience
            nature&hellip; experience vitality.
          </p>
        </div>

        <nav className="flex flex-col gap-3 text-sm" aria-label="Footer">
          <span className="font-medium text-foreground">Explore</span>
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            The Collection
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
        </nav>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} The Garden in the Jungle. All rights
            reserved.
          </p>
          <p className="max-w-md md:text-right">
            Some links are affiliate links. We may earn a small commission at no
            extra cost to you. This site is for informational purposes and is
            not medical advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
