import React, { useState } from 'react';
import { RTDBState } from '../services/firebaseRtdb';
import { AlertTriangle, CheckCircle, CloudRain, Droplet, Eye, Play, Sparkles, Zap } from 'lucide-react';

interface DashboardViewProps {
  state: RTDBState;
  onConfirmPostpone: () => void;
  onTriggerManualIrrigation: (mins: number, valveId: string) => void;
  onSimulateMoistureDrop: () => void;
  onSimulateOptimal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onConfirmPostpone,
  onTriggerManualIrrigation,
  onSimulateMoistureDrop,
  onSimulateOptimal,
}) => {
  const { sensor, aiRecommendation, weather, valves, thresholds } = state;
  const [selectedDuration, setSelectedDuration] = useState(20);
  const [activeValveId, setActiveValveId] = useState('valve_1');

  // Cálculo visual de SVG dashoffset para el anillo de humedad
  // radio = 58, circunferencia = 2 * pi * 58 ≈ 364.4
  const circumference = 364;
  const clampedMoisture = Math.min(100, Math.max(0, sensor.moisture));
  const dashoffset = circumference - (clampedMoisture / 100) * circumference;

  const isCriticalLow = sensor.moisture < thresholds.minMoisture;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-x-hidden">
      {/* Columna Izquierda / Principal (8 cols en Desktop) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TARJETA 1: HUMEDAD DEL SUELO */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Humedad del Suelo
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">{sensor.zoneName}</p>
              </div>
              <span
                className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                  isCriticalLow
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isCriticalLow ? 'Bajo Umbral' : 'Óptimo'}
              </span>
            </div>

            <div className="flex items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-700 ${
                      isCriticalLow ? 'text-amber-500' : 'text-emerald-500'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-800">
                    {Math.round(sensor.moisture)}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Capacidad
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t border-slate-100 pt-3 mt-2 text-slate-600">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Umbral Mín</p>
                <p className="text-xs font-bold text-slate-800">{thresholds.minMoisture}%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Temp. Suelo</p>
                <p className="text-xs font-bold text-slate-800">{sensor.temperature}°C</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Lectura RTDB</p>
                <p className="text-xs font-bold text-emerald-600">{sensor.lastReadTimestamp}</p>
              </div>
            </div>
          </div>

          {/* TARJETA 2: ACCIÓN PROACTIVA IA (CENTRO DE ACCIÓN) */}
          <div className="bg-emerald-600 rounded-xl p-5 shadow-lg shadow-emerald-900/15 text-white flex flex-col justify-between border border-emerald-500 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-xs">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Acción Proactiva IA
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-800 text-emerald-200 uppercase tracking-widest border border-emerald-500/40">
                  AgroMind Engine
                </span>
              </div>

              <div className="flex-1">
                <p className="text-emerald-100 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Análisis en tiempo real:
                </p>
                <h4 className="text-lg font-bold leading-tight mb-3">
                  {aiRecommendation.title}
                </h4>
                <div className="bg-emerald-700/60 rounded-lg p-3.5 border border-white/15 backdrop-blur-xs shadow-inner">
                  <p className="text-xs leading-relaxed font-sans text-emerald-50">
                    <strong className="text-white not-italic font-black">Justificación: </strong>
                    {aiRecommendation.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-500/40">
              {aiRecommendation.type === 'POSTPONE_RAIN' ? (
                <button
                  onClick={onConfirmPostpone}
                  className="w-full bg-white text-emerald-700 font-extrabold py-2.5 px-4 rounded-xl text-xs hover:bg-emerald-50 hover:shadow-md transition-all uppercase tracking-widest flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Confirmar Postergación ($45 Ahorro)
                </button>
              ) : aiRecommendation.type === 'IRRIGATE_URGENT' ? (
                <button
                  onClick={() => onTriggerManualIrrigation(25, valves[0].id)}
                  className="w-full bg-amber-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs hover:bg-amber-300 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer animate-pulse"
                >
                  <Droplet className="w-4 h-4 fill-slate-950" />
                  Regar Ahora (25 min)
                </button>
              ) : (
                <div className="w-full bg-emerald-700/50 text-emerald-100 font-bold py-2 px-3 rounded-xl text-xs text-center uppercase tracking-wider border border-emerald-500/30">
                  ⚡ Modo Óptimo: Vigilancia IoT Activa
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MÓDULO VISUAL: STREAM DE VIDEO EN VIVO */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
          <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
            <div className="flex items-center gap-2 text-slate-700">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Monitoreo de Salud Vegetal (Stream IoT En Vivo)
              </span>
            </div>
            <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter not-italic">
                REC LIVE
              </span>
            </span>
          </div>

          <div className="relative aspect-video bg-slate-900 group overflow-hidden">
            {/* Fondo simulado de invernadero con gradiente verde tecnológico */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 opacity-90"></div>
            
            {/* Grid superpuesto tipo visor agrónomo */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 backdrop-blur-xs bg-slate-950/40 rounded-2xl border border-white/10 max-w-sm">
                <p className="text-emerald-400 text-xs font-mono font-bold mb-2 uppercase tracking-[0.2em]">
                  {sensor.zoneName} - Visor Infrarrojo
                </p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">NDVI Score</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">0.86</span>
                    <span className="text-[9px] text-emerald-300 block font-bold">Vigor Excelente</span>
                  </div>
                  <div className="h-8 w-px bg-white/20"></div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Plagas</span>
                    <span className="text-2xl font-black text-white font-mono">0</span>
                    <span className="text-[9px] text-slate-400 block">Anomalía Cero</span>
                  </div>
                </div>

                <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-emerald-500 w-2/3 animate-[shimmer_2s_infinite]"></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-mono">
                  Sincronización FPS automática
                </p>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-lg border border-white/10 text-[11px] text-slate-200 font-mono flex flex-wrap justify-between items-center gap-2">
              <span>LAT: 31.234N | LON: 68.452W | ALTURA CULTIVO: 1.2m</span>
              <span className="text-amber-400 font-bold">EVAPOTRANSPIRACIÓN ET0: {weather.evapotranspirationEt0} mm/día</span>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha / Paneles Secundarios (4 cols en Desktop) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* PANEL PRONÓSTICO CLIMA */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Pronóstico y Clima
            </h3>
            <span className="text-[10px] font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              OpenWeather API
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-blue-800 font-bold uppercase tracking-wider">
                    Lluvia Probable (6h)
                  </p>
                  <p className="text-2xl font-black text-blue-950">
                    {weather.rainProbability6h}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-blue-600 font-bold uppercase">Siguiente 6h</p>
                <p className="text-sm font-black text-blue-950 not-italic">
                  +{weather.expectedRainMm}mm
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Evapotransp.</p>
                <p className="text-sm font-extrabold text-slate-800">
                  {weather.evapotranspirationEt0} mm/d
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Viento</p>
                <p className="text-sm font-extrabold text-slate-800">
                  {weather.windSpeedKmh} km/h
                </p>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              📌 {weather.conditionEs}. Sincronizado a las {weather.updatedAt}.
            </p>
          </div>
        </div>

        {/* PANEL RESUMEN ROI SIMULATOR */}
        <div className="bg-slate-800 rounded-xl p-5 text-white shadow-lg flex flex-col justify-between border border-slate-700">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                  Simulador de ROI
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                Base $45/acre
              </span>
            </div>

            <div className="space-y-3 font-sans">
              <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                <span className="text-xs text-slate-400 uppercase font-medium">Costo por Acre/Riego</span>
                <span className="text-sm font-bold text-emerald-400">$45.00</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                <span className="text-xs text-slate-400 uppercase font-medium">Riegos Evitados (Mes)</span>
                <span className="text-sm font-bold text-emerald-400">14 riegos</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                <span className="text-xs text-slate-400 uppercase font-medium">Agua Conservada</span>
                <span className="text-sm font-bold text-emerald-400">12,400 Gal</span>
              </div>
            </div>

            <div className="mt-5 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-center">
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">
                Ahorro Proyectado (10 Acres)
              </p>
              <p className="text-3xl font-black text-white">$630.00 <span className="text-xs font-normal text-slate-300">/ mes</span></p>
              <p className="text-[10px] text-emerald-400 mt-1 uppercase font-semibold tracking-wider">
                Retorno de Inversión (ROI): +385%
              </p>
            </div>
          </div>
        </div>

        {/* PANEL ELECTROVÁLVULAS REAL-TIME */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Electroválvulas (Firebase RTDB)
            </span>
            <span className="text-[10px] font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
              REAL-TIME
            </span>
          </div>

          <div className="space-y-3">
            {valves.map((v) => {
              const isOpen = v.status === 'open';
              return (
                <div
                  key={v.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isOpen
                      ? 'bg-blue-50 border-blue-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        isOpen ? 'bg-blue-600 animate-ping' : 'bg-slate-300'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{v.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Caudal: {v.flowRateLpm} L/min | Estado: {isOpen ? 'ABIERTO' : 'CERRADO'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onTriggerManualIrrigation(15, v.id)}
                    disabled={isOpen}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
                      isOpen
                        ? 'bg-blue-600 text-white cursor-default'
                        : 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    {isOpen ? 'Regando...' : 'Abrir 15m'}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 mt-3 text-center uppercase tracking-tighter font-mono">
            Sensores IoT ESP32 activos | Modo Ahorro Electrólisis (10ms) ON
          </p>
        </div>

        {/* TOOLBAR INTERACTIVA DE SIMULACIÓN DE CASOS DE IA */}
        <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-800 shadow-md">
          <p className="text-[10px] font-mono text-amber-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Simulador Pruebas RTDB (Evaluar Proactive AI)
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={onSimulateMoistureDrop}
              className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-left px-3 py-2 rounded-lg text-xs font-bold transition-all border border-slate-700 flex items-center justify-between group cursor-pointer"
            >
              <span>1. Simular Sequía Crítica (Humedad 38%) antes de Lluvia</span>
              <span className="text-[10px] bg-slate-700 group-hover:bg-slate-950 group-hover:text-amber-400 px-1.5 py-0.5 rounded font-mono">
                Disparar Alerta
              </span>
            </button>
            <button
              onClick={onSimulateOptimal}
              className="bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-left px-3 py-2 rounded-lg text-xs font-bold transition-all border border-slate-700 flex items-center justify-between group cursor-pointer"
            >
              <span>2. Simular Suelo Saturado tras Lluvia (Humedad 72%)</span>
              <span className="text-[10px] bg-slate-700 group-hover:bg-slate-950 group-hover:text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                Normalizar
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
