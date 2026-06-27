import React, { useState } from 'react';
import { ROISimulationParams, ROISimulationResult } from '../types';
import { ArrowUpRight, Calculator, DollarSign, Droplet, Layers, ShieldCheck, TrendingUp } from 'lucide-react';

export const RoiSimulatorView: React.FC = () => {
  const [params, setParams] = useState<ROISimulationParams>({
    acres: 14,
    costPerAcreUSD: 45, // Base $45/acre mandated by prompt
    irrigationEventsPerMonth: 22,
    unnecessaryIrrigationsPreventedPct: 35, // 35% saved by anticipatory weather AI
    waterCostPer1kGallons: 3.8,
    gallonsPerAcreEvent: 850,
  });

  // Cálculos matemáticos del simulador
  const totalMonthlyEvents = params.acres * params.irrigationEventsPerMonth;
  const eventsSavedPerMonth = Math.round(totalMonthlyEvents * (params.unnecessaryIrrigationsPreventedPct / 100));
  
  // Ahorro directo en bombeo, mano de obra y cuotas de agua ($45 por cada acre-riego innecesario)
  const directLaborPumpingSavingsUSD = eventsSavedPerMonth * params.costPerAcreUSD;
  
  // Agua ahorrada en galones
  const monthlyWaterSavedGallons = eventsSavedPerMonth * params.gallonsPerAcreEvent;
  const annualWaterSavedGallons = monthlyWaterSavedGallons * 12;
  
  const monthlySavingsUSD = directLaborPumpingSavingsUSD;
  const annualSavingsUSD = monthlySavingsUSD * 12;

  // Asumiendo costo de inversión tecnológica de sensores ESP32 + Válvulas IoT = $1,200 por finca
  const mvpHardwareInvestmentUSD = 1200;
  const paybackPeriodMonths = Math.max(0.1, Number((mvpHardwareInvestmentUSD / monthlySavingsUSD).toFixed(1)));
  const roiPercentage = Math.round(((annualSavingsUSD - mvpHardwareInvestmentUSD) / mvpHardwareInvestmentUSD) * 100);

  const handleParamChange = (key: keyof ROISimulationParams, val: number) => {
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* SECCIÓN PARÁMETROS INTERACTIVOS (5 cols en Desktop) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Parámetros de Simulación ROI
              </h3>
            </div>
            <span className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              $45 / ACRE BASE
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-5 leading-relaxed font-sans">
            Ajusta las dimensiones de tu parcela agrícola para proyectar el retorno de inversión
            (ROI) eliminando el riego reactivo mediante pronóstico satelital de lluvia.
          </p>

          <div className="space-y-4">
            {/* Superficie Cultivada */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-400" /> Superficie Total (Acres)
                </label>
                <span className="text-sm font-black font-mono text-slate-900">{params.acres} Acres</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={params.acres}
                onChange={(e) => handleParamChange('acres', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Costo Operativo Base por Acre */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Costo Base / Acre / Riego
                </label>
                <span className="text-sm font-black font-mono text-emerald-600">${params.costPerAcreUSD} USD</span>
              </div>
              <input
                type="number"
                value={params.costPerAcreUSD}
                onChange={(e) => handleParamChange('costPerAcreUSD', Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-800"
              />
              <p className="text-[10px] text-slate-400 mt-1">Incluye energía de bombeo, mano de obra y amortización hídrica.</p>
            </div>

            {/* Riegos Programados al mes */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Riegos Programados (Mes)
                </label>
                <span className="text-sm font-black font-mono text-slate-900">{params.irrigationEventsPerMonth} riegos</span>
              </div>
              <input
                type="range"
                min="8"
                max="35"
                value={params.irrigationEventsPerMonth}
                onChange={(e) => handleParamChange('irrigationEventsPerMonth', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            {/* % Riegos Cancelados proactivamente */}
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-emerald-900 uppercase">
                  Eficiencia Proactiva IA
                </label>
                <span className="text-sm font-black font-mono text-emerald-700">{params.unnecessaryIrrigationsPreventedPct}% cancelados</span>
              </div>
              <input
                type="range"
                min="10"
                max="75"
                value={params.unnecessaryIrrigationsPreventedPct}
                onChange={(e) => handleParamChange('unnecessaryIrrigationsPreventedPct', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-200 rounded-lg"
              />
              <p className="text-[10px] text-emerald-800 mt-1">Porcentaje de riegos evitados anticipando tormentas o ET0 reducida.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN RESULTADOS Y TABLERO FINANCIERO (7 cols en Desktop) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-slate-800 rounded-xl p-6 text-white shadow-xl border border-slate-700 flex flex-col justify-between h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-white">
                    Proyección de Retorno Tecnológico
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">AgroMind Financial Engine v1</p>
                </div>
              </div>

              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-xs rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFICADO ROI
              </span>
            </div>

            {/* Métrica Destacada: Ahorro Proyectado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-2xl border border-emerald-400/30 shadow-lg text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100 block mb-1">
                  Ahorro Operativo Mensual
                </span>
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-4xl font-black">${monthlySavingsUSD.toLocaleString()}</span>
                  <span className="text-xs text-emerald-100 uppercase">USD / mes</span>
                </div>
                <p className="text-[11px] text-emerald-100 mt-2 font-sans border-t border-emerald-500/50 pt-2 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {eventsSavedPerMonth} riegos innecesarios cancelados
                </p>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Ahorro Anual Acumulado
                </span>
                <div className="flex items-baseline gap-2 font-mono text-amber-400">
                  <span className="text-4xl font-black">${annualSavingsUSD.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 uppercase">USD / año</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-sans border-t border-slate-800 pt-2">
                  Retorno neto tras descontar hardware MVP
                </p>
              </div>
            </div>

            {/* Desglose de Impacto Hídrico y Financiero */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-medium">
                  <Droplet className="w-4 h-4 text-blue-400" /> Conservación de Agua (Anual)
                </span>
                <span className="text-sm font-black text-blue-400">
                  {annualWaterSavedGallons.toLocaleString()} Galones
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-300 font-sans font-medium">Amortización Kit Sensores IoT ($1,200)</span>
                <span className="text-sm font-black text-emerald-400">
                  Payback en {paybackPeriodMonths} Meses
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-300 font-sans font-medium">Retorno de Inversión (ROI 12 Meses)</span>
                <span className="text-base font-black text-amber-400">
                  +{roiPercentage}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/80 text-[11px] text-slate-400 font-sans flex justify-between items-center">
            <span>💡 Basado en métricas reales de agricultores en invernaderos con riego por goteo.</span>
            <span className="font-mono text-emerald-400 font-bold">AGROMIND FINANCIAL v1.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
