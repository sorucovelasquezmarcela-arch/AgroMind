import React, { useEffect, useState } from 'react';
import { AIRecommendation } from '../types';
import { Bell, CloudRain, Sparkles, X } from 'lucide-react';

interface ProactiveAIToastProps {
  recommendation: AIRecommendation;
  onConfirmPostpone: () => void;
}

export const ProactiveAIToast: React.FC<ProactiveAIToastProps> = ({
  recommendation,
  onConfirmPostpone,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (recommendation.pushNotificationTriggered && recommendation.type === 'POSTPONE_RAIN') {
      setVisible(true);
      const timer = setTimeout(() => {
        // Permanece 12 segundos o hasta cerrar
      }, 12000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [recommendation.id, recommendation.pushNotificationTriggered, recommendation.type]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl text-white animate-bounce-short">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/40 text-emerald-400">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            IA Proactiva - Alerta Push
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-3.5 my-2.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-emerald-600/40">
          <CloudRain className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold leading-tight text-white mb-1">
            {recommendation.title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            "{recommendation.message}"
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-3.5 pt-3 border-t border-slate-800">
        <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
          Ahorro ROI Proyectado: ${recommendation.estimatedCostSavedUSD.toFixed(2)}
        </span>
        <button
          onClick={() => {
            onConfirmPostpone();
            setVisible(false);
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          Confirmar y Postergar
        </button>
      </div>
    </div>
  );
};
