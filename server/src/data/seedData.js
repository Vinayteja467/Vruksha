export const categories = [
  {
    id: 'fruit-powders',
    name: 'Fruit Products',
    slug: 'fruit-powders',
    description: 'Naturally sweet and tangy whole-fruit products dried at peak ripeness.',
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
    itemCount: 3
  },
  {
    id: 'vegetable-powders',
    name: 'Vegetable Products',
    slug: 'vegetable-powders',
    description: 'Farm-fresh root and culinary vegetable products for wholesome everyday meals.',
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80',
    itemCount: 4
  },
  {
    id: 'leafy-powders',
    name: 'Leafy Products',
    slug: 'leafy-powders',
    description: 'Sun-kissed and shade-dried greens loaded with plant chlorophyll and gentle earthy taste.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    itemCount: 3
  },
  {
    id: 'wellness-powders',
    name: 'Wellness Products',
    slug: 'wellness-powders',
    description: 'Time-honored Indian botanical products crafted for balanced daily vitality.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    itemCount: 2
  },
  {
    id: 'popular-combos',
    name: 'Popular Combos',
    slug: 'popular-combos',
    description: 'Specially paired sets curated for breakfast smoothies, daily cooking, and gifting.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    itemCount: 2
  }
];

export const products = [
  {
    id: 'prod-001',
    name: 'Pure Beetroot Powder',
    slug: 'beetroot-powder',
    category: 'Vegetable Powders',
    categorySlug: 'vegetable-powders',
    shortDescription: 'Cold-milled vibrant Indian beetroot rich in natural dietary nitrates.',
    description: 'Our Pure Beetroot Powder is crafted from farm-fresh, deeply pigmented Indian beets. Gently dehydrated at low temperatures to preserve its deep ruby color, earthy sweetness, and natural phytonutrients. A versatile plant staple ideal for morning pre-workout juices, yogurt bowls, artisanal pasta, and pink velvet baking without synthetic colors.',
    images: [
      'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 249, originalPrice: 299, inStock: true },
      { size: '150g', price: 349, originalPrice: 429, inStock: true },
      { size: '250g', price: 499, originalPrice: 649, inStock: true },
      { size: '500g', price: 899, originalPrice: 1199, inStock: true },
      { size: '1kg', price: 1599, originalPrice: 2199, inStock: true }
    ],
    price: 249,
    originalPrice: 299,
    discount: 17,
    rating: 4.9,
    reviewCount: 248,
    featured: true,
    bestSeller: true,
    stock: 150,
    sku: 'PH-BEET-001',
    ingredients: '100% Dehydrated Indian Beetroot (Beta vulgaris). Zero preservatives, artificial coloring, or anti-caking agents.',
    nutrition: {
      energy: '335 kcal',
      protein: '11.8 g',
      carbohydrates: '67.5 g',
      dietaryFiber: '18.2 g',
      naturalSugar: '45.0 g',
      fat: '1.2 g',
      iron: '6.8 mg',
      potassium: '1850 mg'
    },
    usage: 'Mix 1 teaspoon (5g) with water, fresh citrus juice, yogurt, overnight oats, or blend into cake and pancake batters.',
    storage: 'Store in an airtight container in a cool, dry place. Keep spoon dry when scooping. Seal immediately after use.',
    benefits: [
      'Natural source of dietary nitrates for active lifestyles',
      'Vivid all-natural pink-to-crimson food coloring agent',
      'High in plant dietary fiber for digestive wellness',
      'Gentle cold-milled process preserves plant enzymes'
    ],
    faq: [
      { q: 'Does this powder clump?', a: 'Because we use zero artificial silica or chemical anti-caking agents, slight natural clumping may occur. Simply tap with a dry spoon to break it up.' },
      { q: 'Can I bake with this powder?', a: 'Yes! It lends a beautiful dusty rose to magenta hue to cakes, frostings, homemade rotis, and pasta dough.' }
    ]
  },
  {
    id: 'prod-002',
    name: 'Organic Moringa Leaf Powder',
    slug: 'moringa-leaf-powder',
    category: 'Leafy Powders',
    categorySlug: 'leafy-powders',
    shortDescription: 'Shade-dried drumstick leaves loaded with plant chlorophyll and gentle greens.',
    description: 'PureHarvest Moringa Powder is prepared exclusively from freshly hand-harvested leaves of Moringa Oleifera cultivated in pesticide-free South Indian soil. Shade-dried to retain high levels of plant chlorophyll, iron, calcium, and amino acids. It has a delicate, spinach-like grassy flavor that blends effortlessly into dal, soups, herbal tea, or warm lemon water.',
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 229, originalPrice: 279, inStock: true },
      { size: '150g', price: 319, originalPrice: 389, inStock: true },
      { size: '250g', price: 469, originalPrice: 599, inStock: true },
      { size: '500g', price: 829, originalPrice: 1099, inStock: true },
      { size: '1kg', price: 1449, originalPrice: 1999, inStock: true }
    ],
    price: 229,
    originalPrice: 279,
    discount: 18,
    rating: 4.8,
    reviewCount: 182,
    featured: true,
    bestSeller: true,
    stock: 120,
    sku: 'PH-MOR-002',
    ingredients: '100% Organically Grown Moringa Leaves (Moringa oleifera). Pure whole leaf powder.',
    nutrition: {
      energy: '315 kcal',
      protein: '27.1 g',
      carbohydrates: '38.2 g',
      dietaryFiber: '19.4 g',
      naturalSugar: '2.5 g',
      fat: '2.3 g',
      iron: '28.2 mg',
      calcium: '2000 mg'
    },
    usage: 'Add half to one teaspoon (3-5g) to warm water with lemon, stir into morning green smoothies, or knead into chapati dough.',
    storage: 'Keep container sealed in a dark pantry. Avoid direct sunlight to protect delicate green chlorophyll.',
    benefits: [
      'Exceptional plant-based protein and bioavailable iron',
      'Rich in antioxidants including quercetin and chlorogenic acid',
      'Traditional Ayurvedic green superfood used for generations',
      'Zero additives, non-GMO, vegan and gluten-free'
    ],
    faq: [
      { q: 'What does Moringa powder taste like?', a: 'It has a pleasant earthy, grassy taste similar to Japanese matcha or powdered spinach.' }
    ]
  },
  {
    id: 'prod-003',
    name: 'Wild Amla Powder',
    slug: 'amla-powder',
    category: 'Wellness Powders',
    categorySlug: 'wellness-powders',
    shortDescription: 'Tangy, Vitamin C-rich Indian gooseberry for daily morning wellness tonics.',
    description: 'Carefully deseeded and low-temperature dried wild Indian gooseberry (Emblica officinalis). Amla has been celebrated across traditional Indian wellness for its natural tartness and concentrated ascorbic acid (Vitamin C). A clean pantry essential for morning warm drinks, digestive tonics, or natural hair and skin self-care rituals.',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 199, originalPrice: 249, inStock: true },
      { size: '150g', price: 279, originalPrice: 349, inStock: true },
      { size: '250g', price: 399, originalPrice: 519, inStock: true },
      { size: '500g', price: 699, originalPrice: 899, inStock: true },
      { size: '1kg', price: 1249, originalPrice: 1699, inStock: true }
    ],
    price: 199,
    originalPrice: 249,
    discount: 20,
    rating: 4.9,
    reviewCount: 310,
    featured: true,
    bestSeller: true,
    stock: 200,
    sku: 'PH-AMLA-003',
    ingredients: '100% Pure Indian Gooseberry / Amla (Emblica officinalis) fruit pulp.',
    nutrition: {
      energy: '287 kcal',
      protein: '3.9 g',
      carbohydrates: '65.2 g',
      dietaryFiber: '24.1 g',
      naturalSugar: '8.4 g',
      fat: '0.8 g',
      vitaminC: '600 mg',
      calcium: '180 mg'
    },
    usage: 'Whisk 1 teaspoon in lukewarm water with raw honey every morning, or blend into fresh vegetable juices.',
    storage: 'Store away from humidity in a dry, cool cabinet. Reseal tightly after each use.',
    benefits: [
      'One of nature’s most concentrated sources of natural Vitamin C',
      'Supports natural collagen synthesis and digestive regularity',
      'Authentic sour-astringent flavor profile indicative of authentic wild amla',
      'No added sugars, maltodextrin, or synthetic preservatives'
    ],
    faq: [
      { q: 'Is this amla powder sweetened?', a: 'No, our amla powder contains 100% whole wild amla fruit with absolutely zero added sweeteners.' }
    ]
  },
  {
    id: 'prod-004',
    name: 'Sun-Dried Ginger Powder',
    slug: 'ginger-powder',
    category: 'Vegetable Powders',
    categorySlug: 'vegetable-powders',
    shortDescription: 'Aromatic Sonth with intense warm spice notes for culinary gravies and masala chai.',
    description: 'Harvested from aged ginger rhizomes in Kerala, washed, peeled, sun-dried, and finely pulverized. Known as "Sonth" in traditional Indian cooking, this powder delivers an invigorating heat and warm gingerol aroma that elevates everyday chai, curries, seasonal gingerbread, stir-fries, and warming herbal teas.',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 189, originalPrice: 229, inStock: true },
      { size: '150g', price: 259, originalPrice: 319, inStock: true },
      { size: '250g', price: 379, originalPrice: 489, inStock: true },
      { size: '500g', price: 649, originalPrice: 849, inStock: true },
      { size: '1kg', price: 1149, originalPrice: 1549, inStock: true }
    ],
    price: 189,
    originalPrice: 229,
    discount: 17,
    rating: 4.8,
    reviewCount: 165,
    featured: false,
    bestSeller: true,
    stock: 140,
    sku: 'PH-GING-004',
    ingredients: '100% Dehydrated Indian Ginger Rhizome (Zingiber officinale).',
    nutrition: {
      energy: '335 kcal',
      protein: '9.0 g',
      carbohydrates: '71.6 g',
      dietaryFiber: '14.1 g',
      naturalSugar: '3.4 g',
      fat: '4.2 g',
      potassium: '1320 mg'
    },
    usage: 'Add a pinch (1/4 tsp) to boiling tea water, marinades, curries, ginger cookies, or warm golden milk.',
    storage: 'Keep container securely closed to preserve volatile aromatic gingerols.',
    benefits: [
      'Potent warming culinary spice with high natural gingerol content',
      'Aids comfortable digestion after hearty meals',
      'Saves preparation time in the kitchen without peeling or grating fresh ginger',
      '100% unbleached, additive-free root powder'
    ],
    faq: [
      { q: 'Is this bleached like common market dry ginger?', a: 'Never. Our ginger is 100% naturally processed without sulfur or lime bleaching agents.' }
    ]
  },
  {
    id: 'prod-005',
    name: 'Raw Green Banana Powder',
    slug: 'banana-powder',
    category: 'Fruit Powders',
    categorySlug: 'fruit-powders',
    shortDescription: 'Prebiotic resistant starch flour made from unripe South Indian green bananas.',
    description: 'Ground from mature, unripe green Robusta bananas grown along the fertile riverbanks of Tamil Nadu. High in prebiotic resistant starch Type-2 (RS2), this neutral-tasting flour feeds friendly gut bacteria without spiking glucose levels. Exceptional as a gluten-free thickener for curries, smoothie bowls, pancakes, and grain-free baking.',
    images: [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 179, originalPrice: 219, inStock: true },
      { size: '150g', price: 249, originalPrice: 309, inStock: true },
      { size: '250g', price: 369, originalPrice: 479, inStock: true },
      { size: '500g', price: 629, originalPrice: 819, inStock: true },
      { size: '1kg', price: 1099, originalPrice: 1499, inStock: true }
    ],
    price: 179,
    originalPrice: 219,
    discount: 18,
    rating: 4.7,
    reviewCount: 142,
    featured: false,
    bestSeller: true,
    stock: 110,
    sku: 'PH-BAN-005',
    ingredients: '100% Raw Unripe Green Bananas (Musa acuminata). Single ingredient.',
    nutrition: {
      energy: '346 kcal',
      protein: '3.9 g',
      carbohydrates: '82.0 g',
      dietaryFiber: '16.5 g',
      naturalSugar: '1.2 g',
      fat: '0.6 g',
      potassium: '1490 mg'
    },
    usage: 'Whisk 1 tablespoon into cold or room-temperature smoothies, oats, or replace 20-30% of standard baking flour.',
    storage: 'Store in an airtight pouch in a cool, dry pantry away from steam.',
    benefits: [
      'Exceptional plant prebiotic resistant starch to nourish gut microbiome',
      'Very low glycemic impact with minimal natural sugar',
      'Naturally gluten-free, paleo, and allergen-friendly flour alternative',
      'Subtle, neutral flavor that won’t overpower other ingredients'
    ],
    faq: [
      { q: 'Does it taste sweet like yellow bananas?', a: 'No, green banana flour has a mild, earthy, neutral flour flavor with almost no banana sweetness.' }
    ]
  },
  {
    id: 'prod-006',
    name: 'Sweet Carrot Powder',
    slug: 'carrot-powder',
    category: 'Vegetable Powders',
    categorySlug: 'vegetable-powders',
    shortDescription: 'Golden beta-carotene rich carrot powder for natural sweet baking and nutrition.',
    description: 'Crafted from crisp, field-fresh Indian red and orange carrots. Gently dehydrated to preserve natural carotenoids, beta-carotene, and natural vegetable sugars. Adds a sunny orange tint, delicate sweetness, and vegetable nourishment to homemade halwa, quick breads, baby purees, soups, and wellness morning shakes.',
    images: [
      'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 219, originalPrice: 269, inStock: true },
      { size: '150g', price: 299, originalPrice: 369, inStock: true },
      { size: '250g', price: 449, originalPrice: 579, inStock: true },
      { size: '500g', price: 799, originalPrice: 1049, inStock: true },
      { size: '1kg', price: 1399, originalPrice: 1899, inStock: true }
    ],
    price: 219,
    originalPrice: 269,
    discount: 19,
    rating: 4.8,
    reviewCount: 96,
    featured: false,
    bestSeller: true,
    stock: 95,
    sku: 'PH-CARR-006',
    ingredients: '100% Farm-Grown Indian Carrots (Daucus carota). Pure dehydrated powder.',
    nutrition: {
      energy: '341 kcal',
      protein: '7.8 g',
      carbohydrates: '73.2 g',
      dietaryFiber: '23.6 g',
      naturalSugar: '38.0 g',
      fat: '1.4 g',
      vitaminA: '820 mcg'
    },
    usage: 'Stir 1-2 tablespoons into cake batter, creamy carrot ginger soups, idli batter, or warm milk.',
    storage: 'Store sealed in a dark container to safeguard light-sensitive beta-carotene pigments.',
    benefits: [
      'Vibrant golden-orange natural food coloring without artificial Tartrazine',
      'Abundant plant provitamin A (Beta-carotene) for eye and skin health',
      'Gentle sweet root flavor loved by kids and adults alike',
      '100% dehydrated whole vegetable nutrition'
    ],
    faq: [
      { q: 'Can I use this for homemade baby food?', a: 'Yes! It is 100% whole carrot with zero salt, preservatives, or chemical fillers, making it great for purees.' }
    ]
  },
  {
    id: 'prod-007',
    name: 'Tender Spinach Powder',
    slug: 'spinach-powder',
    category: 'Leafy Powders',
    categorySlug: 'leafy-powders',
    shortDescription: 'Vibrant green palak powder rich in iron, folate, and gentle plant chlorophyll.',
    description: 'Fresh farm-cut spinach leaves (Palak) thoroughly cleansed in micro-filtered water, gently dehydrated, and finely pulverized. Provides all the nourishing green virtues of fresh spinach in a shelf-stable, convenient spoonful. Ideal for making emerald green rotis, palak paneer gravy bases, green pastas, or green fitness smoothies.',
    images: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 219, originalPrice: 269, inStock: true },
      { size: '150g', price: 299, originalPrice: 369, inStock: true },
      { size: '250g', price: 449, originalPrice: 579, inStock: true },
      { size: '500g', price: 799, originalPrice: 1049, inStock: true },
      { size: '1kg', price: 1399, originalPrice: 1899, inStock: true }
    ],
    price: 219,
    originalPrice: 269,
    discount: 19,
    rating: 4.8,
    reviewCount: 114,
    featured: false,
    bestSeller: false,
    stock: 85,
    sku: 'PH-SPIN-007',
    ingredients: '100% Whole Tender Spinach Leaves (Spinacia oleracea).',
    nutrition: {
      energy: '298 kcal',
      protein: '28.4 g',
      carbohydrates: '37.6 g',
      dietaryFiber: '21.0 g',
      naturalSugar: '2.1 g',
      fat: '3.1 g',
      iron: '27.4 mg'
    },
    usage: 'Add 1 tablespoon to paratha and dosa dough, blend into pesto sauces, or whisk into warm lentil dal.',
    storage: 'Store sealed in a cool, dark cupboard away from moisture.',
    benefits: [
      'Concentrated plant iron, folate, and dietary fiber',
      'Provides a stunning deep emerald color to doughs and baked goods',
      'Zero prep, washing, or chopping required',
      'Non-irradiated and preservative-free'
    ],
    faq: [
      { q: 'How much fresh spinach is in 100g of powder?', a: 'Approximately 1.5 to 1.8 kilograms of fresh spinach leaves are carefully dehydrated to produce 100g of pure powder.' }
    ]
  },
  {
    id: 'prod-008',
    name: 'Zesty Lemon Powder',
    slug: 'lemon-powder',
    category: 'Fruit Powders',
    categorySlug: 'fruit-powders',
    shortDescription: 'Cold spray-dried citrus punch with vibrant natural acidity for dressings and rubs.',
    description: 'Made from whole sun-ripened Indian lemons including fragrant essential oil-rich peel and tangy juice. Provides instant citrus brightness without messy squeezing or refrigeration requirements. Excellent for dry spice rubs, salad dressings, lemon teas, cocktail glass rimming, hummus, and lemon pastries.',
    images: [
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 239, originalPrice: 289, inStock: true },
      { size: '150g', price: 329, originalPrice: 399, inStock: true },
      { size: '250g', price: 489, originalPrice: 629, inStock: true },
      { size: '500g', price: 869, originalPrice: 1149, inStock: true },
      { size: '1kg', price: 1499, originalPrice: 1999, inStock: true }
    ],
    price: 239,
    originalPrice: 289,
    discount: 17,
    rating: 4.7,
    reviewCount: 88,
    featured: false,
    bestSeller: false,
    stock: 75,
    sku: 'PH-LEM-008',
    ingredients: '100% Dehydrated Whole Lemons (Citrus limon).',
    nutrition: {
      energy: '290 kcal',
      protein: '5.2 g',
      carbohydrates: '68.0 g',
      dietaryFiber: '16.0 g',
      naturalSugar: '14.5 g',
      fat: '1.1 g',
      vitaminC: '240 mg'
    },
    usage: 'Sprinkle over roasted vegetables, mix with olive oil for dressings, or dissolve 1/2 tsp into iced iced tea.',
    storage: 'Seal pouch immediately to avoid moisture absorption due to natural citrus fruit sugars.',
    benefits: [
      'Invigorating natural citrus tang with citrus flavonoids',
      'Convenient shelf-stable lemon juice & zest alternative',
      'Great for spice blends and barbecue seasoning where liquid citrus causes sogginess',
      'Pure fruit, zero artificial citric acid or additives'
    ],
    faq: [
      { q: 'Does it contain synthetic citric acid?', a: 'No, 100% of the tang comes from authentic dehydrated Indian lemons.' }
    ]
  },
  {
    id: 'prod-009',
    name: 'Curry Leaf Powder',
    slug: 'curry-leaf-powder',
    category: 'Leafy Powders',
    categorySlug: 'leafy-powders',
    shortDescription: 'South Indian heirloom Kadi Patta roasted and pulverized for authentic aroma.',
    description: 'Heirloom South Indian Murraya koenigii (Kadi Patta) leaves, harvested fresh from family orchards and dried at low heat to lock in its characteristic herbal fragrance. Essential for instant rasam, podi blends, dal tadka, buttermilk seasonings, and DIY Ayurvedic hair masks.',
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 179, originalPrice: 219, inStock: true },
      { size: '150g', price: 249, originalPrice: 309, inStock: true },
      { size: '250g', price: 369, originalPrice: 479, inStock: true },
      { size: '500g', price: 629, originalPrice: 819, inStock: true },
      { size: '1kg', price: 1099, originalPrice: 1499, inStock: true }
    ],
    price: 179,
    originalPrice: 219,
    discount: 18,
    rating: 4.9,
    reviewCount: 205,
    featured: false,
    bestSeller: false,
    stock: 130,
    sku: 'PH-CURR-009',
    ingredients: '100% Heirloom Curry Leaves (Murraya koenigii).',
    nutrition: {
      energy: '310 kcal',
      protein: '17.2 g',
      carbohydrates: '48.5 g',
      dietaryFiber: '22.8 g',
      naturalSugar: '1.8 g',
      fat: '3.6 g',
      iron: '19.8 mg'
    },
    usage: 'Sprinkle over hot ghee rice with salt, mix into spiced chaas (buttermilk), or stir into sambar and chutneys.',
    storage: 'Store in an airtight jar in a cool, shaded pantry to keep aromatics potent.',
    benefits: [
      'Rich in plant iron and carbazole alkaloids',
      'Delivers authentic South Indian aroma to any dish instantly',
      'No picking out leaves at the dinner table — 100% edible whole leaf nutrition',
      'Zero fillers, chemicals, or salt added'
    ],
    faq: [
      { q: 'Can I use this for hair packs?', a: 'Yes! Curry leaf powder is traditionally blended with yogurt, amla, and aloe vera for scalp conditioning.' }
    ]
  },
  {
    id: 'prod-010',
    name: 'Creamy Coconut Powder',
    slug: 'coconut-powder',
    category: 'Fruit Powders',
    categorySlug: 'fruit-powders',
    shortDescription: 'Pure cold-pressed coconut kernel powder for rich coconut milk and curries.',
    description: 'Prepared from freshly cracked mature coconuts from the tropical groves of Kerala. Pure, spray-dried coconut milk powder that reconstitutes instantly into velvety fresh coconut milk or thick cream when stirred with warm water. Ideal for Thai curries, Kerala stews, golden curries, puddings, and dairy-free lattes.',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 199, originalPrice: 249, inStock: true },
      { size: '150g', price: 279, originalPrice: 349, inStock: true },
      { size: '250g', price: 399, originalPrice: 519, inStock: true },
      { size: '500g', price: 699, originalPrice: 899, inStock: true },
      { size: '1kg', price: 1249, originalPrice: 1699, inStock: true }
    ],
    price: 199,
    originalPrice: 249,
    discount: 20,
    rating: 4.8,
    reviewCount: 153,
    featured: false,
    bestSeller: false,
    stock: 90,
    sku: 'PH-COC-010',
    ingredients: '100% Coconut Milk Solids (Cocos nucifera). Dairy-free, lactose-free.',
    nutrition: {
      energy: '668 kcal',
      protein: '8.4 g',
      carbohydrates: '24.2 g',
      dietaryFiber: '7.1 g',
      naturalSugar: '6.5 g',
      fat: '61.5 g'
    },
    usage: 'Dissolve 2-3 tablespoons in 150ml of warm water for rich, velvety homemade coconut milk.',
    storage: 'Store in a cool pantry. Avoid humid environments to prevent natural coconut oil clumping.',
    benefits: [
      'Clean source of healthy plant MCTs (Medium Chain Triglycerides)',
      'Rich, dairy-free vegan alternative to heavy cream and milk',
      'No canned tin aftertaste or chemical emulsifiers',
      'Instant reconstitution in warm liquids'
    ],
    faq: [
      { q: 'Does this contain dairy sodium caseinate?', a: 'No, our coconut powder is 100% vegan, dairy-free, and suitable for strict plant-based diets.' }
    ]
  },
  {
    id: 'prod-011',
    name: 'Sun-Ripened Tomato Powder',
    slug: 'tomato-powder',
    category: 'Vegetable Powders',
    categorySlug: 'vegetable-powders',
    shortDescription: 'Deep umami seasoning ground from vine-ripened tomatoes for gravies and soups.',
    description: 'Farm-ripened tomatoes gently dehydrated into a potent, ruby-red seasoning powder. Packed with natural tomato umami, lycopene, and rich acidity. Eliminates the need for canned paste while delivering instantaneous depth to pizza sauces, tomato soups, marinara bases, chili seasoning, and snack dustings.',
    images: [
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 189, originalPrice: 229, inStock: true },
      { size: '150g', price: 259, originalPrice: 319, inStock: true },
      { size: '250g', price: 379, originalPrice: 489, inStock: true },
      { size: '500g', price: 649, originalPrice: 849, inStock: true },
      { size: '1kg', price: 1149, originalPrice: 1549, inStock: true }
    ],
    price: 189,
    originalPrice: 229,
    discount: 17,
    rating: 4.8,
    reviewCount: 97,
    featured: false,
    bestSeller: false,
    stock: 105,
    sku: 'PH-TOM-011',
    ingredients: '100% Vine-Ripened Indian Tomatoes (Solanum lycopersicum).',
    nutrition: {
      energy: '302 kcal',
      protein: '14.2 g',
      carbohydrates: '56.8 g',
      dietaryFiber: '18.4 g',
      naturalSugar: '38.2 g',
      fat: '1.8 g',
      potassium: '2480 mg'
    },
    usage: 'Add 1-2 tablespoons directly into simmering gravies, stews, dry rubs, or whisk with warm water for instant puree.',
    storage: 'Natural tomato powder easily absorbs atmospheric moisture. Keep tightly zipped in an airtight container.',
    benefits: [
      'High natural lycopene antioxidant concentration',
      'Concentrated savory umami that enriches sauces without high sodium',
      'Long-lasting pantry staple that never spoils like fresh tomatoes',
      '100% real tomatoes with zero salt or artificial colors'
    ],
    faq: [
      { q: 'How do I make tomato paste from this?', a: 'Combine 2 parts tomato powder with 1 part warm water for a thick, rich tomato paste.' }
    ]
  },
  {
    id: 'prod-012',
    name: 'Sweet Potato Powder',
    slug: 'sweet-potato-powder',
    category: 'Vegetable Powders',
    categorySlug: 'vegetable-powders',
    shortDescription: 'Slow-release complex carbohydrates and fiber for clean stamina and baking.',
    description: 'Finely ground whole orange and purple sweet potatoes, steam-cooked and gently dehydrated to retain high prebiotic fiber, potassium, and slow-burning complex carbs. A favored clean nutritional staple for fitness enthusiasts, clean bakers, and everyday morning porridge.',
    images: [
      'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '100g', price: 199, originalPrice: 249, inStock: true },
      { size: '150g', price: 279, originalPrice: 349, inStock: true },
      { size: '250g', price: 399, originalPrice: 519, inStock: true },
      { size: '500g', price: 699, originalPrice: 899, inStock: true },
      { size: '1kg', price: 1249, originalPrice: 1699, inStock: true }
    ],
    price: 199,
    originalPrice: 249,
    discount: 20,
    rating: 4.8,
    reviewCount: 82,
    featured: false,
    bestSeller: false,
    stock: 90,
    sku: 'PH-SWT-012',
    ingredients: '100% Dehydrated Cooked Sweet Potatoes (Ipomoea batatas).',
    nutrition: {
      energy: '360 kcal',
      protein: '4.8 g',
      carbohydrates: '84.0 g',
      dietaryFiber: '10.5 g',
      naturalSugar: '22.0 g',
      fat: '0.7 g',
      potassium: '1150 mg'
    },
    usage: 'Add 2 tablespoons to protein shakes, mix into pancake or muffin batter, or prepare as warm breakfast porridge.',
    storage: 'Keep sealed in a cool, dry place.',
    benefits: [
      'Sustained slow-burning clean carbohydrate fuel',
      'Naturally sweet without any added sugar',
      'Gluten-free, grain-free alternative for digestive wellness',
      'Rich in dietary fiber and essential minerals'
    ],
    faq: [
      { q: 'Is the sweet potato cooked before powdering?', a: 'Yes, our sweet potatoes are gently steamed prior to dehydration to gelatinize starches for smooth digestibility.' }
    ]
  }
];

export const coupons = [
  {
    code: 'VRUKSHA10',
    discountPercent: 10,
    minOrderAmount: 399,
    description: '10% off on orders above ₹399',
    isActive: true
  },
  {
    code: 'PURE10',
    discountPercent: 10,
    minOrderAmount: 399,
    description: '10% off on orders above ₹399',
    isActive: true
  },
  {
    code: 'WELCOME20',
    discountPercent: 20,
    minOrderAmount: 699,
    description: '20% off for first-time orders above ₹699',
    isActive: true
  },
  {
    code: 'FREESHIP',
    freeShipping: true,
    minOrderAmount: 299,
    description: 'Free Shipping on orders above ₹299',
    isActive: true
  }
];

export const sampleReviews = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    productName: 'Pure Beetroot Powder',
    name: 'Ananya Sharma',
    avatar: 'AS',
    rating: 5,
    title: 'Vibrant color and amazing quality!',
    comment: 'I use this beetroot powder every morning in my pre-workout smoothie. The color is so rich and natural, and it dissolves without any gritty sand texture. Beautiful packaging too!',
    verifiedPurchase: true,
    date: '2026-09-15'
  },
  {
    id: 'rev-002',
    productId: 'prod-002',
    productName: 'Organic Moringa Leaf Powder',
    name: 'Vikram Menon',
    avatar: 'VM',
    rating: 5,
    title: 'Genuine earthy aroma',
    comment: 'Having grown up in Kerala where moringa trees are everywhere, I can tell this is top notch shade-dried quality. No artificial additives. Highly recommend.',
    verifiedPurchase: true,
    date: '2026-09-18'
  },
  {
    id: 'rev-003',
    productId: 'prod-003',
    productName: 'Wild Amla Powder',
    name: 'Pooja Deshmukh',
    avatar: 'PD',
    rating: 5,
    title: 'A morning game changer',
    comment: 'Warm water, half a spoon of amla powder, and a dash of raw honey. The tartness is authentic and fresh. Love the clean ingredients philosophy.',
    verifiedPurchase: true,
    date: '2026-09-22'
  },
  {
    id: 'rev-004',
    productId: 'prod-001',
    productName: 'Pure Beetroot Powder',
    name: 'Rohan Mehra',
    avatar: 'RM',
    rating: 5,
    title: 'Great for red velvet pancakes!',
    comment: 'Used it to naturally tint Sunday brunch pancakes for my kids without synthetic red 40 food color. Absolutely loved it.',
    verifiedPurchase: true,
    date: '2026-09-25'
  }
];
