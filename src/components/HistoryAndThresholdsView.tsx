import React, { useState } from 'react';
import { RTDBState, updateRTDBThresholds } from '../services/firebaseRtdb';
import { ThresholdSettings } from '../types';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Database,
  Droplets,
  Save,
  Sliders,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface HistoryAndThresholdsViewProps {
  state: RTDBState;
}

export const HistoryAndThresholdsView: React.FC<HistoryAndThresholdsViewProps> = ({ state }) => {
  const { thresholds, history } = state;

  const [minMoist, setMinMoist] = useState(thresholds.minMoisture);
  const [maxMoist, setMaxMoist] = useState(thresholds.maxMoisture);
  const [rainTrigger, setRainTrigger] = useState(thresholds.autoPostponeRainPct);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings: ThresholdSettings = {
      minMoisture: Number(minMoist),
      maxMoisture: Number(maxMoist),
      autoPostponeRainPct: Number(rainTrigger),
    };
    updateRTDBThresholds(newSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* SECCIÓN 1: CONFIGURADOR DE UMBRALES EN FIREBASE RTDB (4 cols en Desktop) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800">
              <Sliders className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Umbrales IA (Firebase RTDB)
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              SYNC RTDB
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Configura los límites críticos de humedad para tu zona de cultivo. La lógica de IA
            evaluará continuamente estos valores contra las lecturas pulsadas del sensor ESP32 y el
            clima satelital.
          </p>

          <form onSubmit={handleSaveThresholds} className="space-y-5">
            {/* Umbral Mínimo */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Umbral Crítico Mínimo
                </label>
                <span className="text-sm font-black font-mono text-amber-600">
                  {minMoist}%
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="65"
                step="1"
                value={minMoist}
                onChange={(e) => setMinMoist(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <p className="text-[10px] text-slate-400 mt-1.5 font-sans">
                Si la humedad cae de {minMoist}%, la IA evalúa regar o emitir alerta de postergación por lluvia.
              </p>
            </div>

            {/* Umbral Máximo */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Capacidad Ideal Máxima
                </label>
                <span className="text-sm font-black font-mono text-emerald-600">
                  {maxMoist}%
                </span>
              </div>
              <input
                type="range"
                min="65"
                max="95"
                step="1"
                value={maxMoist}
                onChange={(e) => setMaxMoist(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <p className="text-[10px] text-slate-400 mt-1.5 font-sans">
                Límite de saturación objetivo tras aplicar riego o registrar tormenta.
              </p>
            </div>

            {/* Sensibilidad Pronóstico Lluvia */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. Gatillo Alerta Lluvia
                </label>
                <span className="text-sm font-black font-mono text-blue-600">
                  ≥ {rainTrigger}% prob.
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="5"
                value={rainTrigger}
                onChange={(e) => setRainTrigger(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <p className="text-[10px] text-slate-400 mt-1.5 font-sans">
                Probabilidad mínima pronosticada en las siguientes 6h para sugerir cancelar riego.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Guardar en Firebase RTDB
            </button>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>¡Umbrales actualizados y difundidos en tiempo real a todos los nodos!</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* SECCIÓN 2: HISTORIAL DE RIEGO CRONOLÓGICO (8 cols en Desktop) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col h-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-slate-800">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold uppercase tracking-wider">
                  Historial Cronológico de Riego
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Registro inmutable almacenado en Firebase Realtime Database (/irrigation_history)
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 font-bold text-slate-700">
                Total Registros: {history.length}
              </span>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[620px] pr-1">
            {history.map((event) => {
              const isAI = event.trigger === 'IA_PROACTIVA';
              const isPostponed = event.action === 'POSTERGADO_POR_LLUVIA';

              return (
                <div
                  key={event.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isPostponed
                      ? 'bg-amber-50/60 border-amber-200'
                      : isAI
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5 ${
                        isPostponed
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : isAI
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-white'
                      }`}
                    >
                      {isAI ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <UserCheck className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            isAI
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-100'
                          }`}
                        >
                          {event.trigger === 'IA_PROACTIVA' ? '✨ Recomendación IA' : '👷 Operario Manual'}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {event.action === 'POSTERGADO_POR_LLUVIA'
                            ? 'Postergado por Pronóstico Lluvia'
                            : event.action === 'RIEGO_APLICADO'
                            ? 'Riego Aplicado OK'
                            : 'Riego de Emergencia'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {event.notes}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {event.dateStr}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {event.timeStr}
                        </span>
                        <span className="flex items-center gap-1 text-blue-700 font-bold">
                          <Droplets className="w-3.5 h-3.5" />
                          {event.durationMinutes > 0
                            ? `Duración: ${event.durationMinutes} min (${event.waterAmountGallons} gal)`
                            : 'Duración: 0 min (Riego Ahorrado)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {event.costSavedUSD && (
                    <div className="bg-white p-3 rounded-xl border border-amber-200/80 text-center flex-shrink-0 shadow-xs">
                      <span className="text-[10px] text-amber-600 font-bold uppercase block font-mono tracking-wider">
                        ROI Impact
                      </span>
                      <span className="text-lg font-black text-slate-900 font-mono">
                        +${event.costSavedUSD.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-400 block uppercase">Costo Evitado</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
