/**
 * AFZ PRESTIGE Corporate Services - Zones & Scenario Data (GBP £)
 * Currency: British Pound Sterling (£ / GBP)
 * Includes additional £2,500 professional service calculation logic.
 */

window.AFZ_CONFIG = {
  currencySymbol: '£',
  currencyCode: 'GBP',
  additionalFeeGBP: 2500, // Mandatory Additional £2,500 as requested
  additionalFeeLabel: 'Professional Setup & Legal Compliance Management Fee',
  supportWhatsApp: '447400123456', // UK / international contact format
  supportWhatsAppDisplay: '+44 7400 123456',
  supportEmail: 'contact@afzprestige.com',
  companyName: 'AFZ PRESTIGE Corporate Services'
};

window.AFZ_ZONES = [
  {
    code: 'ANCFZ',
    name: 'Ajman NuVentures Centre (ANC)',
    shortName: 'Ajman NuVentures',
    emirate: 'Ajman',
    location: 'Ajman Free Zone & NuVentures Park',
    baseGBP: 1099,
    priceByVisaGBP: {
      0: 1099,
      1: 2350,
      2: 3500,
      3: 4450,
      4: 5400,
      5: 6350,
      6: 7300
    },
    tiers: [0, 1, 2, 3, 4, 5, 6],
    tag: 'Lowest Entry Cost',
    popular: true,
    description: 'Cost-effective package ideal for solopreneurs, digital nomads, and consulting startups.',
    processingTime: '2–4 working days',
    badge: 'Fast Track'
  },
  {
    code: 'FCC',
    name: 'Fujairah Creative City (FCC)',
    shortName: 'Creative City Fujairah',
    emirate: 'Fujairah',
    location: 'Creative Tower, Fujairah',
    baseGBP: 1120,
    priceByVisaGBP: {
      0: 1120,
      1: 2700,
      2: 3800,
      3: 4950,
      4: 6100,
      5: 7250,
      6: 8400
    },
    tiers: [0, 1, 2, 3, 4, 5, 6],
    tag: 'Media & Design Best',
    popular: false,
    description: 'Renowned for media, creative agencies, broadcasting, publishing, and digital marketing.',
    processingTime: '3–5 working days',
    badge: 'Creative Hub'
  },
  {
    code: 'SRTIP',
    name: 'Sharjah RTI Park (SRTIP)',
    shortName: 'SRTI Park Sharjah',
    emirate: 'Sharjah',
    location: 'Research, Technology & Innovation Park, Sharjah',
    baseGBP: 1250,
    priceByVisaGBP: {
      0: 1250,
      1: 2750,
      2: 3890,
      3: 5650,
      4: 7290,
      5: 8400,
      6: 9500
    },
    tiers: [0, 1, 2, 3, 4, 5, 6],
    tag: 'Innovation & Tech',
    popular: false,
    description: 'Top-tier scientific and university-backed technology cluster with high credibility.',
    processingTime: '3–5 working days',
    badge: 'Tech Eco-System'
  },
  {
    code: 'SPC',
    name: 'Sharjah Publishing City (SPC)',
    shortName: 'SPC Free Zone',
    emirate: 'Sharjah',
    location: 'Sheikh Mohammed Bin Zayed Rd, Sharjah',
    baseGBP: 1290,
    priceByVisaGBP: {
      0: 1290,
      1: 2890,
      2: 3850,
      3: 4820,
      4: 5790,
      5: 6760,
      6: 7730
    },
    tiers: [0, 1, 2, 3, 4, 5, 6],
    tag: 'Instant 2-Hour Issuance',
    popular: true,
    description: 'Up to 5 business activities included, dual-license opportunities, and ultra-fast turnaround.',
    processingTime: '2 hours – 2 days',
    badge: 'Express Setup'
  },
  {
    code: 'RAKEZ',
    name: 'Ras Al Khaimah Economic Zone (RAKEZ)',
    shortName: 'RAKEZ',
    emirate: 'Ras Al Khaimah',
    location: 'Al Hamra & Nakheel, Ras Al Khaimah',
    baseGBP: 1350,
    priceByVisaGBP: {
      0: 1350,
      1: 3050,
      2: 3950,
      3: 4850,
      4: 5750
    },
    tiers: [0, 1, 2, 3, 4],
    tag: 'Manufacturing & Trading',
    popular: false,
    description: 'Customizable facilities from flexi-desks to large-scale industrial warehouses and logistics hubs.',
    processingTime: '3–5 working days',
    badge: 'Industrial & Trade'
  },
  {
    code: 'MASDAR',
    name: 'Masdar City Free Zone',
    shortName: 'Masdar Abu Dhabi',
    emirate: 'Abu Dhabi',
    location: 'Masdar City, Abu Dhabi',
    baseGBP: 1580,
    priceByVisaGBP: {
      0: 1580,
      1: 3850,
      2: 5250,
      3: 9350
    },
    tiers: [0, 1, 2, 3],
    tag: 'Abu Dhabi Prestige',
    popular: false,
    description: 'Sustainability-focused zone in Abu Dhabi with prominent global recognition and government access.',
    processingTime: '4–7 working days',
    badge: 'Capital Free Zone'
  },
  {
    code: 'MEYDAN',
    name: 'Meydan Free Zone Dubai',
    shortName: 'Meydan Dubai',
    emirate: 'Dubai',
    location: 'Meydan Grandstand, Nad Al Sheba, Dubai',
    baseGBP: 2750,
    priceByVisaGBP: {
      0: 2750,
      1: 5350,
      2: 7550,
      3: 9750
    },
    tiers: [0, 1, 2, 3],
    tag: 'Prime Dubai Address',
    popular: true,
    description: 'Prestigious Downtown-adjacent Dubai location with guaranteed digital banking support.',
    processingTime: '2–4 working days',
    badge: 'Dubai Elite'
  },
  {
    code: 'IFZA',
    name: 'IFZA Dubai (Silicon Oasis)',
    shortName: 'IFZA Dubai',
    emirate: 'Dubai',
    location: 'Dubai Digital Park, Dubai Silicon Oasis',
    baseGBP: 2850,
    priceByVisaGBP: {
      0: 2850,
      1: 3880,
      2: 5300,
      3: 6720,
      4: 8140
    },
    tiers: [0, 1, 2, 3, 4],
    tag: 'Modern Dubai Park',
    popular: true,
    description: 'Flexible company structures, multiple shareholder capacity, and premier community perks in DSO.',
    processingTime: '3–5 working days',
    badge: 'Global Dubai Brand'
  },
  {
    code: 'DMCC',
    name: 'DMCC Dubai (JLT)',
    shortName: 'DMCC Dubai',
    emirate: 'Dubai',
    location: 'Almas Tower, Jumeirah Lakes Towers, Dubai',
    baseGBP: 7750,
    priceByVisaGBP: {
      0: 7750,
      1: 10250,
      2: 12500,
      3: 14750
    },
    tiers: [0, 1, 2, 3],
    tag: 'World #1 Free Zone',
    popular: false,
    description: 'Award-winning global trade and commodities hub in JLT Dubai with unrivaled international stature.',
    processingTime: '5–10 working days',
    badge: 'Global Flagship'
  }
];

// Activity categories & comprehensive list
window.AFZ_ACTIVITIES = [
  {
    key: 'tech',
    name: 'Technology & Software',
    icon: '💻',
    activities: [
      'Software Design & Development',
      'Web Design & Cloud Applications',
      'Mobile App Engineering',
      'Artificial Intelligence & Data Science',
      'Cybersecurity & Network Auditing',
      'Fintech Solutions & Blockchain',
      'IT Infrastructure & DevOps Services',
      'SaaS Platform Operations',
      'IT Consultancy & Systems Analysis',
      'E-Gaming & Game Development',
      'Database Administration',
      'Internet of Things (IoT) Integration'
    ]
  },
  {
    key: 'consultancy',
    name: 'Consulting & Professional',
    icon: '💼',
    activities: [
      'Management Consultancy',
      'Strategic Business Planning',
      'Marketing & Growth Advisory',
      'Corporate Financial Consultancy',
      'Human Resources & Talent Acquisition',
      'Tax & Corporate Governance Advisory',
      'Project Management & Operations',
      'Legal & Compliance Advisory',
      'Feasibility Study & Market Research',
      'Supply Chain Strategy Advisory',
      'Environmental & Sustainability Audits'
    ]
  },
  {
    key: 'ecommerce',
    name: 'E-Commerce & Online Business',
    icon: '📦',
    activities: [
      'Online Retail & Consumer Goods Store',
      'Drop Shipping & Global Fulfillment',
      'B2B E-Commerce Marketplace',
      'Digital Products & Software Downloads',
      'Subscription Commerce Platforms',
      'Online Fashion & Lifestyle Apparel',
      'Electronics & Gadgets Online Trading',
      'Affiliate Marketing Networks',
      'Online Health & Wellness Products'
    ]
  },
  {
    key: 'commercial',
    name: 'Commercial & Global Trading',
    icon: '🛒',
    activities: [
      'General Trading (Multi-Commodity)',
      'Electronics & Electrical Equipment',
      'Building Materials & Hardware Trading',
      'Automotive Parts & Accessories',
      'Cosmetics, Perfumes & Beauty Supplies',
      'Textiles & Ready-Made Garments',
      'Foodstuff & Packaged Goods Trading',
      'Medical Supplies & Equipment',
      'Watches, Jewelry & Luxury Goods',
      'Office Furniture & Fixtures Trading'
    ]
  },
  {
    key: 'media',
    name: 'Media, Creative & Marketing',
    icon: '🎬',
    activities: [
      'Digital Marketing & Performance Media',
      'Public Relations & Corporate Comms',
      'Social Media Management & Strategy',
      'Graphic Design & Brand Identity',
      'Video Production & Film Post-Editing',
      'Commercial Photography & Studio Work',
      'Content Writing & Editorial Copy',
      'Event Management & Exhibitions',
      'Influencer Agency & Creator Talent',
      'Audio & Podcast Production'
    ]
  },
  {
    key: 'finance',
    name: 'Accounting & Wealth Services',
    icon: '📈',
    activities: [
      'Accounting & Bookkeeping Services',
      'Financial Auditing Preparation',
      'Corporate Tax Filing Support',
      'Payroll Management Services',
      'Investment Advisory Services',
      'Risk Management Consultancy',
      'Credit Advisory & Capital Raising',
      'Family Office Advisory & Assets'
    ]
  },
  {
    key: 'realestate',
    name: 'Real Estate & Property',
    icon: '🏢',
    activities: [
      'Real Estate Consultancy',
      'Property Management & Leasing Services',
      'Holiday Homes Management',
      'Real Estate Marketing & Portals',
      'Facilities & Building Management',
      'Property Valuation & Inspection Advisory'
    ]
  },
  {
    key: 'logistics',
    name: 'Logistics & Cargo',
    icon: '🚚',
    activities: [
      'Freight Forwarding Coordination',
      'Customs Clearance & Documentation',
      'Warehousing & Storage Management',
      'Cold Chain Logistics Consultancy',
      'Supply Chain & Fleet Optimization',
      'Courier & Last-Mile Delivery Support'
    ]
  },
  {
    key: 'education',
    name: 'Education & Training',
    icon: '🎓',
    activities: [
      'Corporate Leadership Training',
      'Online Educational Course Platform',
      'Language Instruction Services',
      'Executive Coaching & Mentoring',
      'Technical Certification Prep',
      'E-Learning Curriculum Development'
    ]
  }
];

// Addons priced in GBP
window.AFZ_ADDONS = [
  {
    key: 'bank',
    title: 'VIP Corporate Bank Account Assistance',
    desc: 'Guaranteed introduction to tier-1 UK/UAE international banks, dossier preparation, compliance review.',
    priceGBP: 450,
    recommended: true
  },
  {
    key: 'tax',
    title: 'Corporate Tax Registration & Advisory',
    desc: 'Complete tax group registration with FTA, corporate tax number issuance, first-year compliance briefing.',
    priceGBP: 290,
    recommended: true
  },
  {
    key: 'vat',
    title: 'Value Added Tax (VAT) Registration',
    desc: 'TRN generation with the authorities, filing setup, invoice audit guidelines.',
    priceGBP: 340,
    recommended: false
  },
  {
    key: 'stamp',
    title: 'Official Company Rubber Seal & Digital Kit',
    desc: 'Physical bespoke company seal stamp delivered to your desk + high-res vector company signature kit.',
    priceGBP: 85,
    recommended: false
  },
  {
    key: 'mail',
    title: 'Prime Prestigious Mailing Address & Scan',
    desc: '12 months dedicated business mailing address with immediate mail scanning & email forwarding.',
    priceGBP: 320,
    recommended: false
  }
];
