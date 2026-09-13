export type Product = {
  slug: string
  name: string
  tagline: string
  category: string
  image: string
  description: string
  benefits: string[]
  /** Affiliate URL — swap these placeholders for your real links. */
  affiliateUrl: string
}

export const products: Product[] = [
  {
    slug: 'cacao',
    name: 'Ceremonial Cacao',
    tagline: 'The original "chocolate"',
    category: 'Superfoods & Botanicals',
    image: '/images/product-cacao.png',
    description:
      'From the Theobroma Cacao tree and its raw, unrefined bean. Long documented for health benefits far beyond its reputation as an indulgent confection.',
    benefits: [
      'A natural source of healthy fats and essential minerals',
      'Rich in antioxidants and mood-supporting compounds',
      'Gently uplifting without the crash of refined sugar',
    ],
    affiliateUrl: 'https://example.com/affiliate/cacao',
  },
  {
    slug: 'mushrooms',
    name: 'Medicinal Mushrooms',
    tagline: 'The magic of real fungi',
    category: 'Medicinal Mushrooms',
    image: '/images/product-mushrooms.png',
    description:
      'Used by traditional healers and royalty for centuries. Reishi, Lion\u2019s Mane, Cordyceps, Tremella, Chaga and Turkey Tail — among the most sought-after fungi in the world.',
    benefits: [
      'Naturally loaded with antioxidants and polysaccharides',
      'May support mood, cognition and immune strength',
      'Traditionally used for stress relief and anti-aging',
    ],
    affiliateUrl: 'https://example.com/affiliate/mushrooms',
  },
  {
    slug: 'shilajit',
    name: 'Scalar-Infused Shilajit',
    tagline: 'For exceptional wellbeing',
    category: 'Mineral Tonics',
    image: '/images/product-shilajit.png',
    description:
      'A sticky, tar-like resin formed over millions of years in high mountain elevations. Records of its use stretch back more than five thousand years.',
    benefits: [
      'Supports all-day energy via mitochondrial ATP production',
      'Encourages healthy collagen for skin, bones and joints',
      'Supports nitric oxide synthesis and circulatory health',
    ],
    affiliateUrl: 'https://example.com/affiliate/shilajit',
  },
  {
    slug: 'crystal-lenses',
    name: 'MyCrystallenses Eyewear',
    tagline: 'A clear perception of things',
    category: 'Conscious Tools',
    image: '/images/product-crystallens.png',
    description:
      'Eyewear that is more than mere glass. Crafted with Earth crystals such as amethyst, citrine and emerald to change the way you perceive the world and yourself.',
    benefits: [
      'Harnesses the known properties of natural Earth crystals',
      'A functional tool designed to shift perception',
      'A conscious reimagining of everyday eyewear',
    ],
    affiliateUrl: 'https://example.com/affiliate/crystal-lenses',
  },
]

export const categories = [
  'Superfoods & Botanicals',
  'Medicinal Mushrooms',
  'Mineral Tonics',
  'Conscious Tools',
] as const
