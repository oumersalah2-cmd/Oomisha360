"use client";

import { useState, useRef, useEffect } from "react";
import { diseases, Disease } from "@/data/diseases";
import { Upload, Play, Pause, RefreshCw, Smartphone, Send, Mic, Languages } from "lucide-react";
import { useApp } from "@/context/AppContext";

type LangCode = "en" | "am" | "om" | "ar";

const langNames = {
  en: "English",
  am: "አማርኛ (Amharic)",
  om: "Afaan Oromo",
  ar: "العربية (Arabic)"
};

export default function BotSimulator() {
  const { addDiagnosis } = useApp();
  const [selectedDisease, setSelectedDisease] = useState<Disease>(diseases[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<LangCode>("en");
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<Disease | null>(diseases[0]);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger diagnostic simulation
  const runDiagnosis = (disease: Disease) => {
    setIsDiagnosing(true);
    setDiagnosisResult(null);
    setIsPlaying(false);
    setAudioProgress(0);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setTimeout(() => {
      setSelectedDisease(disease);
      setDiagnosisResult(disease);
      setIsDiagnosing(false);
      
      // Log the diagnosis in the shared state
      const severityMap: Record<string, "low" | "medium" | "high"> = {
        "coffee-berry-disease": "high",
        "coffee-leaf-rust": "high",
        "wheat-stem-rust": "high",
        "maize-lethal-necrosis": "high",
        "teff-rust": "medium"
      };
      
      addDiagnosis({
        crop: disease.crop,
        diseaseName: disease.name.en,
        scientificName: disease.scientificName,
        confidence: disease.confidenceMock || 95,
        region: disease.crop === "Coffee" ? "Sidama" : "Oromia",
        woreda: disease.crop === "Coffee" ? "Yirgacheffe" : "Bishoftu",
        language: langNames[selectedLanguage],
        severity: severityMap[disease.id] || "medium"
      });
    }, 1500);
  };

  // Stop audio if language changes
  useEffect(() => {
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    setIsPlaying(false);
    setAudioProgress(0);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [selectedLanguage]);

  // Simulated audio player with real speech synthesis
  const togglePlay = () => {
    if (isPlaying) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setIsPlaying(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
      
      if (typeof window !== "undefined" && window.speechSynthesis && diagnosisResult) {
        window.speechSynthesis.cancel();
        
        const textToSpeak = diagnosisResult.organicRemedies[selectedLanguage];
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Find best voice match for selected language
        const voices = window.speechSynthesis.getVoices();
        let voice = null;
        if (selectedLanguage === "en") {
          voice = voices.find(v => v.lang.startsWith("en")) || null;
        } else if (selectedLanguage === "ar") {
          voice = voices.find(v => v.lang.startsWith("ar")) || null;
        } else if (selectedLanguage === "am") {
          voice = voices.find(v => v.lang.startsWith("am") || v.lang.startsWith("eth")) || null;
        } else if (selectedLanguage === "om") {
          voice = voices.find(v => v.lang.startsWith("om")) || null;
        }
        
        if (voice) {
          utterance.voice = voice;
        }
        utterance.lang = selectedLanguage === "am" ? "am-ET" : selectedLanguage === "ar" ? "ar-SA" : selectedLanguage === "om" ? "om-ET" : "en-US";
        
        utterance.onend = () => {
          setIsPlaying(false);
          setAudioProgress(0);
          if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        };
        
        utterance.onerror = () => {
          setIsPlaying(false);
          setAudioProgress(0);
          if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        };
        
        window.speechSynthesis.speak(utterance);
      }
      
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            return 0; // Loop progress animation visually until audio finishes
          }
          return prev + 2.5;
        });
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Simulation Controls (Left/Top) */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-charcoal p-6 rounded-2xl border border-emerald-green/10">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Configure AI Diagnostics</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Choose a mock crop leaf sample representing common pests or upload a photo to simulate the Mobile Telegram Bot processing.
          </p>

          {/* Sample crop picker */}
          <div className="space-y-3 mb-6">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Select Sample Leaf Photo
            </span>
            <div className="grid grid-cols-2 gap-3">
              {diseases.map((d) => (
                <button
                  key={d.id}
                  onClick={() => runDiagnosis(d)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border transition-all ${
                    selectedDisease.id === d.id && (diagnosisResult || isDiagnosing)
                      ? "border-emerald-green ring-2 ring-emerald-green/20"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <img
                    src={d.imagePlaceholder}
                    alt={d.name.en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-bold text-white truncate">
                      {d.name.en}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Language selector */}
          <div className="space-y-3">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Languages className="h-3.5 w-3.5 text-emerald-green" />
              <span>Select Speech & Text Language</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(langNames) as LangCode[]).map((langKey) => (
                <button
                  key={langKey}
                  onClick={() => setSelectedLanguage(langKey)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold text-left border transition-all ${
                    selectedLanguage === langKey
                      ? "bg-emerald-green/10 border-emerald-green text-emerald-green"
                      : "bg-obsidian border-zinc-800 text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  {langNames[langKey]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload simulated image */}
        <div className="border-2 border-dashed border-zinc-800 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-green/40 transition-colors">
          <Upload className="h-6 w-6 text-zinc-500 mx-auto mb-2" />
          <span className="text-xs text-zinc-400 font-medium block">
            Upload custom leaf photo
          </span>
          <span className="text-[10px] text-zinc-600 block mt-0.5">
            Supports PNG, JPG up to 10MB
          </span>
        </div>
      </div>

      {/* Simulated Device Screen (Right/Bottom) */}
      <div className="lg:col-span-7 flex justify-center items-center">
        {/* Telegram Bot Phone mockup */}
        <div className="w-full max-w-[340px] aspect-[9/18] rounded-[40px] bg-black border-[6px] border-zinc-800 p-3 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {/* Speaker, camera notch */}
          <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
            <div className="bg-zinc-800 w-32 h-4 rounded-b-xl" />
          </div>

          {/* Telegram Header */}
          <div className="bg-zinc-900 border-b border-zinc-800 pt-5 pb-3 px-3 flex items-center gap-2 relative z-10">
            <div className="h-8 w-8 rounded-full bg-emerald-green/10 border border-emerald-green/30 flex items-center justify-center font-bold text-xs text-emerald-green">
              🌱
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-none">Gebere Vision AI</h4>
              <span className="text-[9px] text-emerald-green font-medium">bot &bull; online</span>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 bg-obsidian p-3 overflow-y-auto space-y-4 pt-4 flex flex-col justify-end">
            {/* User photo upload message */}
            <div className="self-end max-w-[85%] bg-emerald-green text-obsidian rounded-2xl rounded-tr-sm p-2 flex flex-col gap-1.5 shadow-lg">
              <div className="rounded-lg overflow-hidden h-28 bg-emerald-green-dark">
                <img
                  src={selectedDisease.imagePlaceholder}
                  alt="Crop Leaf"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[9px] font-semibold flex items-center gap-1">
                <span>Diagnose crop in {langNames[selectedLanguage]}</span>
              </span>
            </div>

            {/* Bot Response */}
            {isDiagnosing ? (
              <div className="self-start max-w-[85%] bg-charcoal border border-zinc-800 rounded-2xl rounded-tl-sm p-3.5 space-y-2">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 text-emerald-green animate-spin" />
                  <span className="text-[10px] text-zinc-400 font-semibold">Running CABI RAG diagnostic...</span>
                </div>
                <div className="h-1.5 w-full bg-obsidian rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-green animate-[pulse_1s_infinite] w-2/3" />
                </div>
              </div>
            ) : diagnosisResult ? (
              <div className="self-start max-w-[85%] bg-charcoal border border-zinc-800 rounded-2xl rounded-tl-sm p-3.5 space-y-3.5 shadow-lg">
                {/* Result header */}
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[9px] font-bold text-emerald-green uppercase tracking-wider">
                      Diagnosis Result
                    </span>
                    <span className="bg-emerald-green/20 text-emerald-green text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {diagnosisResult.confidenceMock}% confidence
                    </span>
                  </div>
                  <h5 className="text-xs font-extrabold text-white">
                    {diagnosisResult.name[selectedLanguage]}
                  </h5>
                  <p className="text-[9px] text-zinc-500 italic mt-0.5">
                    Scientific: {diagnosisResult.scientificName}
                  </p>
                </div>

                {/* Voice Note Simulation */}
                <div className="bg-obsidian border border-zinc-800/80 rounded-xl p-2.5 flex items-center gap-2.5">
                  <button
                    onClick={togglePlay}
                    className="h-8 w-8 rounded-full bg-emerald-green hover:bg-emerald-green/90 text-obsidian flex items-center justify-center shrink-0 transition-all"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-obsidian ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-zinc-400 block leading-none">
                      Voice Remedies ({selectedLanguage.toUpperCase()})
                    </span>
                    {/* Simulated Waveform */}
                    <div className="h-5 flex items-center gap-0.5 pt-0.5">
                      {Array.from({ length: 24 }).map((_, idx) => {
                        const waveHeight = 2 + Math.abs(Math.sin(idx + audioProgress)) * 14;
                        const isPast = (idx / 24) * 100 <= audioProgress;
                        return (
                          <div
                            key={idx}
                            style={{ height: `${waveHeight}px` }}
                            className={`w-[2px] rounded-full transition-all duration-100 ${
                              isPast ? "bg-emerald-green" : "bg-zinc-700"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-500 shrink-0 font-bold">
                    {diagnosisResult.audioDuration}
                  </span>
                </div>

                {/* Text Summary */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Remedy Action Guide
                  </span>
                  <p className="text-[10px] text-zinc-300 leading-relaxed">
                    {diagnosisResult.organicRemedies[selectedLanguage]}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Telegram input bar */}
          <div className="bg-zinc-900 border-t border-zinc-800 p-2 flex items-center gap-2 relative z-10">
            <div className="flex-1 bg-obsidian border border-zinc-800 rounded-full px-3 py-1.5 flex items-center justify-between text-xs text-zinc-500">
              <span>Write message...</span>
              <Mic className="h-4 w-4 text-zinc-400 hover:text-emerald-green" />
            </div>
            <button className="h-8 w-8 bg-emerald-green text-obsidian rounded-full flex items-center justify-center shrink-0">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
