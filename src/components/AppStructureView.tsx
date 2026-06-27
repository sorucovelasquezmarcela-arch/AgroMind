import React from 'react';
import { CheckCircle, FileCode, FolderTree, Layers } from 'lucide-react';

export const AppStructureView: React.FC = () => {
  const folders = [
    {
      name: 'src/',
      desc: 'Código fuente principal de la aplicación móvil React Native / Multiplataforma.',
      children: [
        {
          name: 'components/',
          desc: 'Componentes UI modulares con diseño Professional Polish y Tailwind CSS.',
          files: [
            'Header.tsx (Barra superior con indicadores de conexión Firebase RTDB en tiempo real)',
            'DashboardView.tsx (Medidor circular SVG de humedad, Botón Acción IA y Módulo Visual Stream)',
            'HistoryAndThresholdsView.tsx (Listado cronológico inmutable y deslizadores de umbrales RTDB)',
            'RoiSimulatorView.tsx (Calculadora financiera $45/acre, agua ahorrada y Payback)',
            'IotCodeView.tsx (Visor de lógica C++ Arduino/ESP32 con pulsos de 10ms anti-electrólisis)',
            'ProactiveAIToast.tsx (Alerta Push emergente ante pronóstico de lluvia inminente)',
          ],
        },
        {
          name: 'services/',
          desc: 'Integraciones de datos en tiempo real e inteligencia artificial proactiva.',
          files: [
            'firebaseRtdb.ts (Capa de gestión en tiempo real simulando Firebase Realtime Database e integraciones OpenWeather API)',
          ],
        },
        {
          name: 'data/',
          desc: 'Firmwares embebidos y constantes del sistema.',
          files: [
            'esp32Code.ts (Código fuente completo C++ para nodos ESP32 con Deep Sleep)',
          ],
        },
        {
          name: 'types.ts',
          desc: 'Contratos e interfaces TypeScript (SensorReading, ValveState, AIRecommendation, ROISimulationResult).',
        },
        {
          name: 'App.tsx',
          desc: 'Entregable principal App.js con orquestación de estado, notificaciones push y ruteo de pestañas.',
        },
      ],
    },
    {
      name: 'Entregables del MVP',
      desc: 'Cumpliendo estrictamente con las especificaciones del cliente AgroMind:',
      children: [
        {
          name: '✅ Arquitectura Proactiva de IA',
          desc: 'Evalúa humedad vs pronóstico a 6 horas (OpenWeather) y dispara alerta de postergación.',
        },
        {
          name: '✅ ROI Simulator ($45 / Acre)',
          desc: 'Cálculo dinámico de ahorro de agua y amortización del hardware IoT.',
        },
        {
          name: '✅ Monitoreo Vegetal en Vivo',
          desc: 'Visor infrarrojo de salud vegetal con cálculo de índice NDVI.',
        },
        {
          name: '✅ C++ IoT Anti-Corrosión',
          desc: 'Energización exacta de 10ms cada 30 min con transistor de conmutación.',
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <FolderTree className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
                  Estructura de Carpetas & Entregable MVP
                </h3>
                <p className="text-xs text-slate-400">
                  Organización multiplataforma lista para despliegue en React Native / Expo
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold text-xs rounded-full">
              AGROMIND MVP v1.0
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {folders.map((section, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-800 font-mono flex items-center gap-2 mb-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    {section.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4 font-sans">{section.desc}</p>

                  <div className="space-y-4">
                    {section.children.map((child, cIdx) => (
                      <div key={cIdx} className="pl-3 border-l-2 border-emerald-500/40">
                        <p className="text-xs font-bold text-slate-800 font-mono">{child.name}</p>
                        {child.desc && <p className="text-[11px] text-slate-500 mt-0.5">{child.desc}</p>}

                        {child.files && (
                          <ul className="mt-1.5 space-y-1">
                            {child.files.map((file, fIdx) => (
                              <li key={fIdx} className="text-[11px] font-mono text-slate-600 flex items-start gap-1.5 bg-white p-1.5 rounded border border-slate-200/60">
                                <FileCode className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span>{file}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Sincronización Git activa</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> ESTRUCTURA COMPLETA
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
