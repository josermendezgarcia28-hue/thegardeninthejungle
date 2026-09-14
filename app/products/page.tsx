import type { Metadata } from 'next'
import { ProductCard } from '@/components/product-card'
import { products, categories } from '@/lib/products'

export const metadata: Metadata = {
  title: 'The Collection — The Garden in the Jungle',
  description:
    'Browse the full collection of nature-backed wellness finds, grouped by category, with the health benefits behind each one.',
}

export default function ProductsPage() {
  return (
    <main>
      <section className="border-b border-primary/15 bg-secondary/20 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <p className="eyebrow">The most exotic substances on the planet</p>
          <h1 className="mt-3 font-serif text-5xl font-light md:text-6xl">
            The Collection
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground/85 text-pretty">
            The world of plants is as vast as can be. Explore this array of
            exotic and commonly known remedies, read what each offers your
            health, then reveal its link whenever you&apos;re ready.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16">
        {categories.map((category) => {
          const items = products.filter((p) => p.category === category)
          if (items.length === 0) return null

          return (
            <section key={category} className="mb-16 last:mb-0">
              <div className="mb-8 flex items-center gap-4">
                <h2 className="section-heading">{category}</h2>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
