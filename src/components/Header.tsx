import React from 'react';
import { RTDBState } from '../services/firebaseRtdb';
import { TabType } from '../types';
import { Activity, Cpu, Database, Droplet, Layers, RefreshCw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  rtdbState: RTDBState;
  onResetSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  rtdbState,
  onResetSimulation,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard IA', icon: <Droplet className="w-4 h-4" /> },
    {
      id: 'history',
      label: 'Historial & Umbrales',
      icon: <Database className="w-4 h-4" />,
      badge: `${rtdbState.history.length}`,
    },
    { id: 'roi', label: 'Simulador Ahorro ($45/acre)', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'iot_code', label: 'C++ IoT (Anti-Corrosión)', icon: <Cpu className="w-4 h-4" /> },
    { id: 'structure', label: 'Estructura App', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-600/20">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 uppercase flex items-center gap-1.5">
              AgroMind <span className="text-emerald-600 italic">MVP</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
              Asistente de Riego Inteligente
            </p>
          </div>
        </div>

        {/* Mobile sensors indicator */}
        <div className="flex md:hidden items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-semibold text-slate-600">RTDB LIVE</span>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-800 tracking-wider">
            FIREBASE RTDB ONLINE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800">Finca Las Camelias</p>
            <p className="text-[10px] text-slate-500 font-medium">San Juan, Sector 4</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-black text-xs">
            FC
          </div>
        </div>

        <button
          onClick={onResetSimulation}
          title="Reiniciar datos simulados de Firebase RTDB"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
