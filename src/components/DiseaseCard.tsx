"use client";

import { useState, useRef, useEffect } from "react";
import { Disease } from "@/data/diseases";
import { Check, Shield, AlertTriangle, Activity, Play, Pause } from "lucide-react";

interface DiseaseCardProps {
  disease: Disease;
}

type LangCode = "en" | "am" | "om" | "ar";

export default function DiseaseCard({ disease }: DiseaseCardProps) {
  const [lang, setLang] = useState<LangCode>("en");
  const [guideTab, setGuideTab] = useState<"organic" | "chemical">("organic");

  // Audio simulation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const languages: { code: LangCode; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "am", label: "አማ" },
    { code: "om", label: "ORM" },
    { code: "ar", label: "عرب" }
  ];

  // Stop audio if tab or language changes
  useEffect(() => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
    }
    setIsPlaying(false);
    setAudioProgress(0);
  }, [lang, guideTab]);

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            if (audioIntervalRef.current) {
              clearInterval(audioIntervalRef.current);
            }
            setIsPlaying(false);
            return 0;
          }
          return prev + 4;
        });
      }, 100);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-green/10 bg-charcoal p-6 transition-all duration-300 hover:border-emerald-green/20 hover:shadow-lg hover:shadow-emerald-green/5 relative overflow-hidden flex flex-col justify-between">
      {/* Background Gradient Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-green/10 to-transparent rounded-bl-full pointer-events-none" />

      <div>
        {/* Header with language switcher */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-green/10 text-emerald-green border border-emerald-green/20 mb-2">
              {disease.crop} Disease
            </span>
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-green transition-colors">
              {disease.name[lang]}
            </h3>
            <p className="text-xs text-zinc-500 italic mt-0.5">
              {disease.scientificName}
            </p>
          </div>

          <div className="flex bg-obsidian border border-zinc-800 p-0.5 rounded-lg shrink-0">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  lang === l.code
                    ? "bg-emerald-green text-obsidian"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms list */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-emerald-green" />
            <span>Symptoms</span>
          </h4>
          <ul className="space-y-1.5">
            {disease.symptoms[lang].map((symptom, idx) => (
              <li key={idx} className="flex items-start text-xs text-zinc-300 gap-2">
                <Check className="h-4 w-4 text-emerald-green shrink-0 mt-0.5" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Decision Guides Tabs */}
      <div className="mt-auto border-t border-zinc-800 pt-4">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setGuideTab("organic")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              guideTab === "organic"
                ? "bg-emerald-green/10 text-emerald-green border border-emerald-green/30"
                : "bg-obsidian text-zinc-400 border border-transparent hover:text-zinc-300"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Green (Organic)</span>
          </button>
          <button
            onClick={() => setGuideTab("chemical")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              guideTab === "chemical"
                ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30"
                : "bg-obsidian text-zinc-400 border border-transparent hover:text-zinc-300"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Yellow (Chemical)</span>
          </button>
        </div>

        {/* Action Guide Content */}
        <div className="bg-obsidian border border-zinc-800/80 rounded-xl p-3.5 space-y-3">
          {guideTab === "organic" ? (
            <div>
              <span className="text-[10px] font-bold text-emerald-green uppercase tracking-wider block mb-1">
                Biological & Cultural Management
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {disease.organicRemedies[lang]}
              </p>
            </div>
          ) : (
            <div>
              <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider block mb-1">
                Restricted Chemical Treatment
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {disease.chemicalTreatments[lang]}
              </p>
            </div>
          )}

          {/* Voice Player */}
          {disease.audioDuration && (
            <div className="bg-charcoal/50 border border-zinc-800/60 rounded-lg p-2.5 flex items-center gap-2.5 mt-2">
              <button
                onClick={togglePlay}
                className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  guideTab === "organic"
                    ? "bg-emerald-green text-obsidian hover:bg-emerald-green/90"
                    : "bg-yellow-500 text-obsidian hover:bg-yellow-500/90"
                }`}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-obsidian ml-0.5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-zinc-500 block leading-none mb-1">
                  Remedy Voice Note ({languages.find((l) => l.code === lang)?.label})
                </span>
                {/* Waveform */}
                <div className="h-3 flex items-center gap-0.5">
                  {Array.from({ length: 18 }).map((_, idx) => {
                    const waveHeight = 2 + Math.abs(Math.sin(idx + audioProgress)) * 8;
                    const isPast = (idx / 18) * 100 <= audioProgress;
                    return (
                      <div
                        key={idx}
                        style={{ height: `${waveHeight}px` }}
                        className={`w-[1.5px] rounded-full transition-all duration-100 ${
                          isPast
                            ? guideTab === "organic"
                              ? "bg-emerald-green"
                              : "bg-yellow-500"
                            : "bg-zinc-850"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
              <span className="text-[9px] text-zinc-500 shrink-0 font-mono">
                {disease.audioDuration}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
