export interface MarketplaceListing {
  id: string;
  commodityName: string;
  variety: string;
  cooperativeName: string;
  location: {
    region: string;
    zone: string;
    woreda: string;
  };
  volume: {
    amount: number;
    unit: "Metric Tons" | "Quintals";
  };
  moistureLevel: number;
  askingPrice: {
    amount: number;
    currency: "ETB" | "USD";
    unit: "kg";
  };
  certifications: string[];
  isVerified: boolean;
  harvestYear: number;
  contactPerson: string;
  imagePlaceholder: string;
  description: string;
}

export const marketplaceListings: MarketplaceListing[] = [
  {
    id: "lst-yirgacheffe-coffee",
    commodityName: "Specialty Coffee",
    variety: "Yirgacheffe Grade 1 (Washed)",
    cooperativeName: "Yirgacheffe Farmers Cooperative Union",
    location: {
      region: "SNNPR / Sidama",
      zone: "Gedeo",
      woreda: "Yirgacheffe"
    },
    volume: {
      amount: 18,
      unit: "Metric Tons"
    },
    moistureLevel: 11.5,
    askingPrice: {
      amount: 6.2,
      currency: "USD",
      unit: "kg"
    },
    certifications: ["Fairtrade Certified", "Organic USDA", "Rainforest Alliance"],
    isVerified: true,
    harvestYear: 2026,
    contactPerson: "Demeke Wolde",
    imagePlaceholder: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80",
    description: "Premium washed coffee with bright floral acidity, hints of jasmine and citrus, and a clean tea-like finish. Fully traceable to smallholder members."
  },
  {
    id: "lst-durum-wheat",
    commodityName: "Wheat",
    variety: "Grade 1 Durum Wheat",
    cooperativeName: "Bale Goba Grain Cooperative",
    location: {
      region: "Oromia",
      zone: "Bale",
      woreda: "Goba"
    },
    volume: {
      amount: 450,
      unit: "Quintals"
    },
    moistureLevel: 12.0,
    askingPrice: {
      amount: 85,
      currency: "ETB",
      unit: "kg"
    },
    certifications: ["CABI High Yield Certified", "Non-GMO"],
    isVerified: true,
    harvestYear: 2026,
    contactPerson: "Taye Bekele",
    imagePlaceholder: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    description: "High-protein durum wheat ideal for local millers and pasta manufacturers. Cleaned, graded, and stored in dry, modern silos."
  },
  {
    id: "lst-white-teff",
    commodityName: "White Teff",
    variety: "Magna (Super White) Teff",
    cooperativeName: "Ada'a Agricultural Cooperative",
    location: {
      region: "Oromia",
      zone: "East Shewa",
      woreda: "Bishoftu"
    },
    volume: {
      amount: 320,
      unit: "Quintals"
    },
    moistureLevel: 10.8,
    askingPrice: {
      amount: 110,
      currency: "ETB",
      unit: "kg"
    },
    certifications: ["Verified Gluten-Free", "Fair-Trade Cooperatives"],
    isVerified: true,
    harvestYear: 2026,
    contactPerson: "Almaz Gizaw",
    imagePlaceholder: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    description: "First-grade Magna white teff from the fertile volcanic soils of Ada'a. Fine grain structure with high iron and fiber content."
  },
  {
    id: "lst-sidama-coffee",
    commodityName: "Specialty Coffee",
    variety: "Sidama A Grade 2 (Natural)",
    cooperativeName: "Sidama Coffee Farmers Cooperative Union",
    location: {
      region: "Sidama",
      zone: "Hawassa",
      woreda: "Aleta Wondo"
    },
    volume: {
      amount: 24,
      unit: "Metric Tons"
    },
    moistureLevel: 11.8,
    askingPrice: {
      amount: 5.8,
      currency: "USD",
      unit: "kg"
    },
    certifications: ["Fairtrade Certified", "Organic USDA"],
    isVerified: true,
    harvestYear: 2026,
    contactPerson: "Kassahun Lema",
    imagePlaceholder: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    description: "Sun-dried natural coffee from Sidama. Highly complex berry flavors, full body, and a sweet, chocolaty finish."
  },
  {
    id: "lst-red-sorghum",
    commodityName: "Sorghum",
    variety: "Red Sorghum (Local Red)",
    cooperativeName: "Hararghe Smallholders Cooperative Union",
    location: {
      region: "Oromia",
      zone: "East Hararghe",
      woreda: "Chiro"
    },
    volume: {
      amount: 150,
      unit: "Quintals"
    },
    moistureLevel: 12.5,
    askingPrice: {
      amount: 60,
      currency: "ETB",
      unit: "kg"
    },
    certifications: ["Organic Transition"],
    isVerified: false,
    harvestYear: 2026,
    contactPerson: "Ahmed Mustafa",
    imagePlaceholder: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
    description: "Drought-resistant red sorghum harvested by dryland farmers in East Hararghe. Excellent for local flour and beverage production."
  }
];
