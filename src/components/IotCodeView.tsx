import React, { useState } from 'react';
import { ESP32_LOW_LEVEL_CODE } from '../data/esp32Code';
import { Check, Copy, Cpu, ShieldAlert, Terminal } from 'lucide-react';

export const IotCodeView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ESP32_LOW_LEVEL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  Nodo IoT de Bajo Nivel: ESP32 / Arduino (C++)
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Lectura pulsada de 10ms cada 30 minutos | Cero Electrólisis Galvánica
                </p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer self-start md:self-auto"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              {copied ? '¡Código C++ Copiado!' : 'Copiar Código ESP32'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5 font-mono text-xs">
              <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block mb-1">
                Problema IoT Tradicional
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                Dejar corriente continua en sondas analógicas provoca electrólisis rápida, disolviendo el cobre/oro en menos de 3 semanas por oxidación galvánica.
              </p>
            </div>

            <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/30 font-mono text-xs">
              <span className="text-[10px] text-emerald-400 uppercase font-black tracking-widest block mb-1">
                Solución AgroMind (10ms)
              </span>
              <p className="text-emerald-100 font-sans text-xs leading-relaxed">
                Conmutamos GND/VCC con un transistor NPN solo 10 milisegundos cada 30 min. Extiende la vida útil de la sonda a +5 años y ahorra batería.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5 font-mono text-xs">
              <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest block mb-1">
                Sincronización RTDB
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                Envía petición HTTP PUT rápida a Firebase Realtime Database (/sensors) y entra automáticamente en Deep Sleep de 1800s.
              </p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                AgroMind_Node_AntiCorrosion.ino
              </span>
              <span>C++17 (ESP32 DevKit)</span>
            </div>
            <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[580px] scrollbar-thin">
              <code>{ESP32_LOW_LEVEL_CODE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
