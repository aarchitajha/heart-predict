"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Bot, MessageCircle, Send, X, ClipboardList, Activity, Heart, ShieldQuestion } from "lucide-react";
import { PredictRequest, PredictResponse } from "@/types/prediction";

type Msg = { role: "user" | "bot"; text: string; ts: string };

const SUGGESTIONS = [
  { label: "Explain Diagnosis", icon: ClipboardList },
  { label: "Risk Factors", icon: Activity },
  { label: "Treatment Plan", icon: Heart },
  { label: "About Disease", icon: ShieldQuestion },
];

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hello! I'm your HeartPredict Assistant. How can I help you understand your cardiac health today?", ts: new Date().toLocaleTimeString() },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [predictionContext, setPredictionContext] = useState<{
    category: string;
    predicted_class?: number;
    probability: number;
    probabilities: Record<string, number>;
    risk_factors: PredictResponse["risk_factors"];
  }>({
    category: "Unknown",
    probability: 0,
    probabilities: {},
    risk_factors: [],
  });

  const [inputContext, setInputContext] = useState<PredictRequest | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    try {
      const resultRaw = sessionStorage.getItem("predict_result");
      const inputRaw = sessionStorage.getItem("predict_input");

      if (resultRaw) {
        const parsed: PredictResponse = JSON.parse(resultRaw);
        setPredictionContext({
          category: parsed.category || "Unknown",
          predicted_class: parsed.predicted_class,
          probability: parsed.probability ?? 0,
          probabilities: parsed.probabilities || {},
          risk_factors: parsed.risk_factors || [],
        });
      }

      if (inputRaw) {
        setInputContext(JSON.parse(inputRaw));
      }
    } catch (error) {
      console.error("FloatingChatbot context load failed", error);
    }
  }, [open]);

  const reply = (question: string) => {
    const q = question.toLowerCase().trim();
    
    // 1. ARRHYTHMIA SPECIFIC
    if (q.includes("arrhythmia") || q.includes("irregular heartbeat")) {
      return "Arrhythmia refers to an irregular heartbeat where the heart may beat too fast, too slow, or unevenly. In this model, it is predicted when abnormal ECG results (resting_ecg), irregular heart rate (max_heart_rate), and symptoms like dizziness or exercise-induced angina are observed. It requires clinical validation via a 12-lead ECG.";
    }

    // 2. RISK DRIVERS (CONTEXT AWARE)
    if (q.includes("what caused") || q.includes("why") || q.includes("drivers") || q.includes("factors")) {
      if (predictionContext.risk_factors.length > 0) {
        const factors = predictionContext.risk_factors.map(f => `${f.feature} (${f.impact} impact)`).join(", ");
        let specificDetail = "";
        if (inputContext) {
          specificDetail = ` Specifically, your data showed a max heart rate of ${inputContext.max_heart_rate} and ST depression (oldpeak) of ${inputContext.oldpeak}.`;
        }
        return `Your risk is primarily driven by: ${factors}.${specificDetail} These clinical markers were significantly weighted by the Naive Bayes engine.`;
      }
      return "Risk is typically driven by clinical markers like ST depression (oldpeak), abnormal ECG patterns, elevated cholesterol, and exercise-induced angina. Have you completed a prediction yet?";
    }

    // 3. TREATMENT / RECOMMENDATIONS
    if (q.includes("treatment") || q.includes("recommendation") || q.includes("what should i do")) {
      return "Based on clinical protocols, suggested actions include:\n\n• Lifestyle: Adoption of a Mediterranean diet and 150 min/week of moderate aerobic activity.\n• Clinical: Consultation with a cardiologist for a stress test or echocardiogram if symptoms persist.\n• Monitoring: Regular tracking of blood pressure and lipid profiles (cholesterol).";
    }

    // 4. DIAGNOSIS EXPLANATION
    if (q.includes("explain") || q.includes("diagnosis") || q.includes("result")) {
      if (predictionContext.category !== "Unknown") {
        const probText = (predictionContext.probability * 100).toFixed(2);
        return `The model predicted: **${predictionContext.category}** with a confidence score of **${probText}%**. This prediction is based on the interaction of 11 clinical features. A higher score indicates a stronger alignment with the typical profile for this condition.`;
      }
      return "I can explain your diagnosis once you've completed an assessment on the Predict page. Generally, the model categorizes risk into 6 specific cardiac profiles.";
    }

    // 5. NUTRITION & LIFESTYLE
    if (q.includes("diet") || q.includes("food") || q.includes("eat") || q.includes("nutrition")) {
      return "For heart health, focus on the 'Heart-Healthy' plate: plenty of leafy greens, fatty fish (Omega-3s), whole grains, and nuts. Limit sodium (under 2300mg/day), saturated fats, and processed sugars.";
    }

    // 6. EXERCISE
    if (q.includes("exercise") || q.includes("workout") || q.includes("activity")) {
      return "Moderate-intensity aerobic activity (like brisk walking) for at least 30 minutes a day, 5 days a week, is recommended. Always consult your doctor before starting a new vigorous exercise program, especially if you have existing cardiac indicators.";
    }

    // 7. EMERGENCY
    if (q.includes("emergency") || q.includes("chest pain") || q.includes("heart attack") || q.includes("pain")) {
      return "🚨 **IMPORTANT**: If you are currently experiencing severe chest pain, shortness of breath, or numbness in the arm, call emergency services (911 or your local equivalent) immediately. This AI tool is for informational risk assessment and NOT for emergency diagnosis.";
    }

    // 8. HOW IT WORKS
    if (q.includes("how it works") || q.includes("method") || q.includes("machine learning")) {
      return "This system uses a Naive Bayes classifier trained on 10,000 patient records. It calculates 'posterior probabilities' for 6 different heart health classes based on 11 clinical inputs like Age, ECG, and Cholesterol.";
    }

    // 9. FALLBACK
    return "I can help with a variety of topics: explaining your diagnosis, detailing risk factors, suggested lifestyle changes, or explaining how our AI works. What would you like to know more about?";
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const trimmed = text.trim();
    const userMessage: Msg = { role: "user", text: trimmed, ts: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);

    setTimeout(() => {
      const botText = reply(trimmed);
      const botMessage: Msg = { role: "bot", text: botText, ts: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[360px] md:w-[400px] rounded-2xl border bg-card shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b bg-accent/5">
            <div className="flex items-center gap-2">
              <div className="bg-accent rounded-lg p-1.5">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold block">HeartPredict Assistant</span>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online • AI Diagnosis Specialist
                </span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="p-4 space-y-4 h-[350px] overflow-y-auto bg-muted/10 scroll-smooth">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  m.role === "user" 
                    ? "bg-accent text-white rounded-tr-none" 
                    : "bg-white border rounded-tl-none text-slate-700"
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                  <div className={`text-[10px] mt-2 ${m.role === "user" ? "text-white/70" : "text-muted-foreground text-right"}`}>
                    {m.ts}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-3 flex flex-wrap gap-2 border-t bg-white">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.label)}
                className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-full border bg-background hover:bg-accent/5 hover:border-accent transition-all">
                <s.icon className="h-3 w-3 text-accent" />
                {s.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about risk, diet, or exercise..."
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(input);
                  setInput("");
                }
              }}
            />
            <button 
              onClick={() => {
                sendMessage(input);
                setInput("");
              }} 
              disabled={!input.trim()}
              className="rounded-xl bg-accent text-white p-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md shadow-accent/20"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="h-16 w-16 rounded-full bg-accent text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-8 w-8 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 border-2 border-white rounded-full"></div>
        </button>
      )}
    </div>
  );
}
