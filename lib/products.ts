export type Product = {
  slug: string
  name: string
  tagline: string
  category: string
  image: string
  /** Optional media gallery — when present, cards render an image carousel. */
  gallery?: {
    src: string
    /** Simple caption (used when title/subtext are absent). */
    caption?: string
    /** Rich overlay title, e.g. "Lion's Mane — Brain & Cognitive Vitality". */
    title?: string
    /** Supporting overlay copy beneath the title. */
    subtext?: string
    /** Short label for the corner species pill, e.g. "Lion's Mane". */
    badge?: string
    /** Per-slide destination — the card action opens the active slide's link. */
    href?: string
  }[]
  /** Step-badge label for the gallery carousel, e.g. "Tree to Cup". */
  galleryBadge?: string
  description: string
  benefits: string[]
  /** Affiliate URL — swap these placeholders for your real links. */
  affiliateUrl: string
  /** Optional promo/discount code surfaced on the card. */
  promoCode?: string
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
        src: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Cocoa_Pods.JPG',
        caption: 'Theobroma Cacao — Ripe pods growing on the tree trunk',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Cacao_Beans_Drying.JPG',
        caption: 'Traditional sun-drying and fermentation of harvested beans',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Cocoa_bean_roasted2.jpg',
        caption: 'Fire-roasted whole cacao beans ready for stone grinding',
      },
      {
        src: 'https://www.mayamooncacao.com/cdn/shop/files/Mayan_organic_ceremonial_Cacao_1_Lb_Fresh_Ground_-_Maya_Moon_Cacao-2576930.png?v=1785969117&width=800',
        caption: 'Mayan Organic Ceremonial Cacao (1 Lb Fresh Ground)',
      },
      {
        src: 'https://www.mayamooncacao.com/cdn/shop/files/Mayan_organic_ceremonial_Cacao_Powder_0.5_Lb_Fresh_Ground_-_Maya_Moon_Cacao-2576943.png?v=1785969169&width=800',
        caption: 'Mayan Organic Ceremonial Cacao (0.5 Lb Fresh Ground)',
      },
      {
        src: 'https://www.mayamooncacao.com/cdn/shop/files/mood-enhancing-cacao-nibs-snack-ritual-use-guatemala.png?v=1785970485&width=800',
        caption: 'Fire-Roasted, Stone-Ground Cacao Nibs from Guatemala',
      },
    ],
    galleryBadge: 'Tree to Cup',
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
    tagline: '100% Pure Organic Fruiting Body Mushroom Extracts',
    category: 'Medicinal Mushrooms',
    image: '/images/product-mushrooms.png',
    gallery: [
      {
        src: 'https://realmushrooms.com/cdn/shop/files/Lions-Mane-120_hide-ca.png?v=1768368372',
        badge: "Lion's Mane",
        title: "Lion's Mane — Brain & Cognitive Vitality",
        subtext:
          'Hot-water extracted organic fruiting body rich in hericenones for memory, focus, and nerve growth factor support.',
        href: 'https://realmushrooms.com/products/organic-lions-mane-extract-capsules',
      },
      {
        src: 'https://realmushrooms.com/cdn/shop/files/Reishi-90_hide-ca.png?v=1772562784',
        badge: 'Red Reishi',
        title: 'Red Reishi — The Mushroom of Immortality',
        subtext:
          'Ancient adaptogen containing triterpenes and beta-glucans to regulate stress, calm the spirit, and support restorative sleep.',
        href: 'https://realmushrooms.com/products/reishi-mushroom-capsules',
      },
      {
        src: 'https://realmushrooms.com/cdn/shop/files/Cordyceps-120_hide-ca.png?v=1772220014',
        badge: 'Cordyceps-M',
        title: 'Cordyceps-M — Physical Energy & Stamina',
        subtext:
          'Cultivated fruiting bodies rich in cordycepin to optimize oxygen consumption, endurance, and cellular ATP production.',
        href: 'https://realmushrooms.com/products/organic-cordyceps-extract-capsules',
      },
      {
        src: 'https://realmushrooms.com/cdn/shop/files/Turkey-Tail-90_hide-ca.png?v=1772558592',
        badge: 'Turkey Tail',
        title: 'Turkey Tail — Gut & Immune Defense',
        subtext:
          'Potent source of polysaccharopeptides (PSK and PSP) and prebiotic beta-glucans for a resilient microbiome.',
        href: 'https://realmushrooms.com/products/organic-turkey-tail-extract-capsules',
      },
      {
        src: 'https://realmushrooms.com/cdn/shop/files/chaga-120_hide-ca.png?v=1772218885',
        badge: 'Chaga',
        title: 'Chaga — King of Forest Antioxidants',
        subtext:
          'Wild-harvested birch conk extract loaded with betulinic acid and polyphenols for cellular health and gastrointestinal resilience.',
        href: 'https://realmushrooms.com/products/organic-chaga-mushroom-extract-capsules',
      },
      {
        src: 'https://realmushrooms.com/cdn/shop/files/Tremella-120_hide-ca.png?v=1772561064',
        badge: 'Tremella',
        title: 'Tremella — Hydration & Cellular Beauty',
        subtext:
          'Snow fungus polysaccharide extract holding 500x its weight in water, promoting youthfulness and skin moisture.',
        href: 'https://realmushrooms.com/products/organic-tremella-extract-capsules',
      },
      {
        src: 'https://realmushrooms.com/cdn/shop/files/5-Defenders-90_hide-ca.png?v=1772562898',
        badge: '5 Defenders',
        title: '5 Defenders — Synergy Immune Shield',
        subtext:
          'Concentrated blend of Reishi, Shiitake, Maitake, Turkey Tail, and Chaga fruiting bodies for comprehensive defense.',
        href: 'https://realmushrooms.com/products/organic-mushroom-blend-capsules',
      },
    ],
    galleryBadge: 'Species',
    description:
      'Used by traditional healers and royalty for centuries. Reishi, Lion\u2019s Mane, Cordyceps, Tremella, Chaga and Turkey Tail — among the most sought-after fungi in the world.',
    benefits: [
      'Hot water extracted from certified organic whole mushroom fruiting bodies',
      'Guaranteed active beta-glucans with zero grain mycelium or added starch',
      'Award-winning purity for cognitive vitality, nerve support, and immune resilience',
    ],
    affiliateUrl: 'https://realmushrooms.com/collections/best-sellers',
  },
  {
    slug: 'shilajit',
    name: 'Shilajit',
    tagline: 'Conqueror of Mountains, Destroyer of Weakness',
    category: 'Mineral Tonics',
    image: '/images/product-shilajit.png',
    gallery: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Shilajit%2C_Mohave_Lava_Tube%2C_2018.04.01_%2835%29.jpg',
        caption:
          'High-Altitude Mineral Pitch — Raw biomass seeping from pristine rock strata',
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0603/7294/3008/files/IMG_8345.jpg',
        caption: 'VibeMedX Shilajit Resin 100g',
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0603/7294/3008/files/IMG_8347.jpg?v=1704235371',
        caption:
          'Vibe MedX Authentic Shilajit Resin (50 Grams in Biophotonic Glass)',
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0603/7294/3008/files/55.png?v=1723672928',
        caption: 'Vibe MedX Cold-Pressed Pure Shilajit Tablets',
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0603/7294/3008/files/IMG_8345.jpg?v=1704235322',
        caption:
          'Vibe MedX Shilajit Resin (100 Grams High-Potency Reserve)',
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0603/7294/3008/files/5AC2E861-78FE-4E38-BBB5-B6D7073281B4.png?v=1709073316',
        caption: 'Vibe MedX Pure Shilajit Extract Powder (1 Kilo)',
      },
    ],
    galleryBadge: 'Earth to Mineral',
    description:
      'A sticky, tar-like resin formed over millions of years in high mountain elevations. Records of its use stretch back more than five thousand years.',
    benefits: [
      'Over 84 ionic trace minerals and high-percentage fulvic acid',
      'Supports cellular mitochondrial energy, ATP synthesis, and nutrient absorption',
      'Ethically wild-harvested and purified at low temperatures without chemical solvents',
    ],
    affiliateUrl: 'https://www.vibemedx.com/jose',
    promoCode: 'JOSE',
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
