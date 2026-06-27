/**
 * @title AgroMind MVP - Asistente Virtual de Riego Inteligente
 * @description Entregable principal App.js multiplataforma (React / React Native Web)
 * con integración Firebase Realtime Database, IA Proactiva OpenWeather y Simulador ROI.
 */

import React, { useEffect, useState } from 'react';
import { AppStructureView } from './components/AppStructureView';
import { DashboardView } from './components/DashboardView';
import { Header } from './components/Header';
import { HistoryAndThresholdsView } from './components/HistoryAndThresholdsView';
import { IotCodeView } from './components/IotCodeView';
import { ProactiveAIToast } from './components/ProactiveAIToast';
import { RoiSimulatorView } from './components/RoiSimulatorView';
import {
  RTDBState,
  confirmAIPostponeAction,
  resetRTDBSimulation,
  simulateLiveIoTPulse,
  subscribeRTDB,
  triggerManualIrrigationRTDB,
} from './services/firebaseRtdb';
import { TabType } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [rtdbState, setRtdbState] = useState<RTDBState | null>(null);

  // Suscripción continua en tiempo real a Firebase Realtime Database (onValue)
  useEffect(() => {
    const unsubscribe = subscribeRTDB((newState) => {
      setRtdbState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Simulación opcional periódica de pulso de sensor IoT en segundo plano (cada 18 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      simulateLiveIoTPulse();
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  if (!rtdbState) {
    return (
      <div className="bg-slate-50 text-slate-900 w-full min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Conectando con Firebase Realtime Database...
          </p>
        </div>
      </div>
    );
  }

  const handleSimulateMoistureDrop = () => {
    simulateLiveIoTPulse(38); // Cae a 38%, por debajo del umbral del 45% -> Dispara alerta de lluvia inminente
    setCurrentTab('dashboard');
  };

  const handleSimulateOptimal = () => {
    simulateLiveIoTPulse(72); // Normaliza al 72%
  };

  return (
    <div className="bg-slate-50 text-slate-900 w-full min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* ALERTA EMERGENTE PUSH DE IA PROACTIVA */}
      <ProactiveAIToast
        recommendation={rtdbState.aiRecommendation}
        onConfirmPostpone={confirmAIPostponeAction}
      />

      {/* HEADER PROFESIONAL POLISH */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        rtdbState={rtdbState}
        onResetSimulation={resetRTDBSimulation}
      />

      {/* CUERPO CENTRAL DINÁMICO */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col">
        {currentTab === 'dashboard' && (
          <DashboardView
            state={rtdbState}
            onConfirmPostpone={confirmAIPostponeAction}
            onTriggerManualIrrigation={triggerManualIrrigationRTDB}
            onSimulateMoistureDrop={handleSimulateMoistureDrop}
            onSimulateOptimal={handleSimulateOptimal}
          />
        )}

        {currentTab === 'history' && <HistoryAndThresholdsView state={rtdbState} />}

        {currentTab === 'roi' && <RoiSimulatorView />}

        {currentTab === 'iot_code' && <IotCodeView />}

        {currentTab === 'structure' && <AppStructureView />}
      </main>

      {/* FOOTER PROFESIONAL POLISH */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-400 uppercase flex-shrink-0 gap-2 mt-auto">
        <div className="flex gap-6">
          <span>AgroMind MVP v1.2.0</span>
          <span className="text-emerald-700 font-extrabold flex items-center gap-1">
            ● Firebase RTDB Live Sync
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-emerald-600 font-mono">⚡ IoT ESP32 (10ms anti-electrólisis)</span>
          <span className="hover:text-slate-600 cursor-pointer transition-colors">Soporte Agrónomo</span>
        </div>
      </footer>
    </div>
  );
}

