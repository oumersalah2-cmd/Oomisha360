"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MarketplaceListing, marketplaceListings as initialListings } from "@/data/marketplace";
import { 
  getListingsAction, 
  createListingAction, 
  getDiagnosesAction, 
  createDiagnosisAction 
} from "@/app/actions";

import { Language } from "@/lib/i18n";

export interface DiagnosticHistoryItem {
  id: string;
  crop: string;
  diseaseName: string;
  scientificName: string;
  confidence: number;
  region: string;
  woreda: string;
  timestamp: string;
  language: string;
  severity: "low" | "medium" | "high";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "diagnosis" | "marketplace" | "farm" | "system";
  read: boolean;
  link?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  listings: MarketplaceListing[];
  addListing: (listing: Omit<MarketplaceListing, "id">) => void;
  diagnoses: DiagnosticHistoryItem[];
  addDiagnosis: (diagnosis: Omit<DiagnosticHistoryItem, "id" | "timestamp">) => void;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  addNotification: (notification: Omit<NotificationItem, "id" | "timestamp" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial mock diagnostic history to seed the dashboard graphs
const initialDiagnoses: DiagnosticHistoryItem[] = [
  {
    id: "diag-1",
    crop: "Coffee",
    diseaseName: "Coffee Leaf Rust",
    scientificName: "Hemileia vastatrix",
    confidence: 96,
    region: "Sidama",
    woreda: "Aleta Wondo",
    timestamp: "2026-08-09T10:30:00Z",
    language: "Afaan Oromo",
    severity: "high"
  },
  {
    id: "diag-2",
    crop: "Wheat",
    diseaseName: "Stem Rust",
    scientificName: "Puccinia graminis",
    confidence: 89,
    region: "Oromia",
    woreda: "Goba",
    timestamp: "2026-08-09T09:15:00Z",
    language: "Amharic",
    severity: "medium"
  },
  {
    id: "diag-3",
    crop: "Maize",
    diseaseName: "Maize Lethal Necrosis",
    scientificName: "MCMV + SCMV",
    confidence: 92,
    region: "Oromia",
    woreda: "Chiro",
    timestamp: "2026-08-09T08:45:00Z",
    language: "Amharic",
    severity: "high"
  },
  {
    id: "diag-4",
    crop: "Coffee",
    diseaseName: "Coffee Berry Disease",
    scientificName: "Colletotrichum kahawae",
    confidence: 95,
    region: "SNNPR / Sidama",
    woreda: "Yirgacheffe",
    timestamp: "2026-08-08T16:20:00Z",
    language: "English",
    severity: "medium"
  },
  {
    id: "diag-5",
    crop: "Teff",
    diseaseName: "Teff Rust",
    scientificName: "Uromyces eragrostidis",
    confidence: 84,
    region: "Oromia",
    woreda: "Bishoftu",
    timestamp: "2026-08-08T14:10:00Z",
    language: "Amharic",
    severity: "low"
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedLang = localStorage.getItem("gebere_lang") as Language;
        if (storedLang && (storedLang === "en" || storedLang === "om" || storedLang === "am")) {
          return storedLang;
        }
      } catch {}
    }
    return "om";
  });
  const [listings, setListings] = useState<MarketplaceListing[]>(initialListings);
  const [diagnoses, setDiagnoses] = useState<DiagnosticHistoryItem[]>(initialDiagnoses);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gebere_notifications");
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {}
    }
    return [
      {
        id: "notif-welcome",
        title: "Welcome to Oomisha360",
        message: "Supabase Authentication & Gebere Vision AI services are active.",
        timestamp: new Date().toISOString(),
        type: "system",
        read: false,
        link: "/gebere-vision-ai"
      }
    ];
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("gebere_lang", lang);
    } catch {}
  };

  // Load listings and diagnoses
  useEffect(() => {
    async function loadData() {
      const dbListings = await getListingsAction();
      const dbDiagnoses = await getDiagnosesAction();
      
      if (dbListings.length > 0) {
        setListings(dbListings);
      }
      if (dbDiagnoses.length > 0) {
        setDiagnoses(dbDiagnoses);
      }
    }
    loadData();
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notif: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      try {
        localStorage.setItem("gebere_notifications", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem("gebere_notifications", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem("gebere_notifications", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem("gebere_notifications", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addListing = async (newListingData: Omit<MarketplaceListing, "id">) => {
    // Optimistic UI update
    const tempId = `lst-${Date.now()}`;
    const newListing: MarketplaceListing = {
      ...newListingData,
      id: tempId
    };
    setListings((prev) => [newListing, ...prev]);

    // Save to Neon DB
    await createListingAction(newListingData);
  };

  const addDiagnosis = async (newDiagData: Omit<DiagnosticHistoryItem, "id" | "timestamp">) => {
    // Optimistic UI update
    const tempId = `diag-${Date.now()}`;
    const newDiag: DiagnosticHistoryItem = {
      ...newDiagData,
      id: tempId,
      timestamp: new Date().toISOString()
    };
    setDiagnoses((prev) => [newDiag, ...prev]);

    // Save to Neon DB
    await createDiagnosisAction(newDiagData);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        listings,
        addListing,
        diagnoses,
        addDiagnosis,
        notifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
