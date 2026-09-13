export type Product = {
  slug: string
  name: string
  tagline: string
  category: string
  image: string
  /** Optional media gallery — when present, cards render an image carousel. */
  gallery?: { src: string; caption: string }[]
  description: string
  benefits: string[]
  /** Affiliate URL — swap these placeholders for your real links. */
  affiliateUrl: string
}

export const products: Product[] = [
  {
    slug: 'cacao',
    name: 'Ceremonial Cacao',
    tagline: 'Handcrafted Mayan Ceremonial Cacao from Guatemala',
    category: 'Superfoods & Botanicals',
    image: '/images/product-cacao.png',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1000&q=80',
        caption: 'Theobroma Cacao — Living canopy pods',
      },
      {
        src: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1000&q=80',
        caption: 'Raw pod cracked open with fresh seed pulp',
      },
      {
        src: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=1000&q=80',
        caption: 'Traditional fire-roasting and sun-curing',
      },
      {
        src: 'https://www.mayamooncacao.com/cdn/shop/files/Mayan_organic_ceremonial_Cacao_1_Lb_Fresh_Ground_-_Maya_Moon_Cacao-2576930.png?v=1785969117&width=800',
        caption:
          'Maya Moon Mayan Organic Ceremonial Cacao (1 Lb Fresh Ground)',
      },
      {
        src: 'https://www.mayamooncacao.com/cdn/shop/files/Mayan_organic_ceremonial_Cacao_Powder_0.5_Lb_Fresh_Ground_-_Maya_Moon_Cacao-2576943.png?v=1785969169&width=800',
        caption: 'Maya Moon Ceremonial Cacao (0.5 Lb Gold Pouch)',
      },
      {
        src: 'https://www.mayamooncacao.com/cdn/shop/files/mood-enhancing-cacao-nibs-snack-ritual-use-guatemala.png?v=1785970485&width=800',
        caption: 'Fire-Roasted, Stone-Ground Cacao Nibs from Guatemala',
      },
    ],
    description:
      'From the Theobroma Cacao tree and its raw, unrefined bean. Long documented for health benefits far beyond its reputation as an indulgent confection.',
    benefits: [
      '100% pure stone-ground Theobroma cacao',
      'Rich in theobromine, magnesium and mood-elevating anandamide',
      'Single-origin, ethically sourced from family-run agroforestry in Guatemala',
    ],
    affiliateUrl: 'https://www.mayamooncacao.com/collections/fresh-ground-cacao',
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
