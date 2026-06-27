import {
  AIRecommendation,
  IrrigationEvent,
  SensorReading,
  ThresholdSettings,
  ValveState,
  WeatherForecast,
} from '../types';

/**
 * AgroMind MVP - Firebase Realtime Database SDK Simulation Layer
 * Simula conexión continua onValue() con latencia sub-segundo para IoT y actuadores.
 */

const STORAGE_KEY_SENSORS = 'agromind_rtdb_sensors_v1';
const STORAGE_KEY_VALVES = 'agromind_rtdb_valves_v1';
const STORAGE_KEY_THRESHOLDS = 'agromind_rtdb_thresholds_v1';
const STORAGE_KEY_HISTORY = 'agromind_rtdb_history_v1';
const STORAGE_KEY_WEATHER = 'agromind_rtdb_weather_v1';

export interface RTDBState {
  sensor: SensorReading;
  valves: ValveState[];
  thresholds: ThresholdSettings;
  history: IrrigationEvent[];
  weather: WeatherForecast;
  aiRecommendation: AIRecommendation;
}

const DEFAULT_THRESHOLDS: ThresholdSettings = {
  minMoisture: 45,
  maxMoisture: 80,
  autoPostponeRainPct: 60,
};

const DEFAULT_SENSOR: SensorReading = {
  id: 'node_zone_1',
  zoneName: 'Sector 4 - Las Camelias',
  cropType: 'Tomate Cherries Orgánico',
  moisture: 67,
  moistureThreshold: 45,
  temperature: 22.4,
  ambientHumidity: 62,
  salinityEC: 1.45,
  lastReadTimestamp: 'Hace 2 min',
  batteryLevel: 94,
  signalStrength: -65,
};

const DEFAULT_VALVES: ValveState[] = [
  {
    id: 'valve_1',
    zoneId: 'node_zone_1',
    name: 'Electroválvula Norte (Línea Principal)',
    status: 'closed',
    flowRateLpm: 24.5,
    lastChanged: '2026-06-26 14:00',
  },
  {
    id: 'valve_2',
    zoneId: 'node_zone_1',
    name: 'Electroválvula Centro (Goteo Bajo)',
    status: 'closed',
    flowRateLpm: 18.0,
    lastChanged: '2026-06-26 14:00',
  },
  {
    id: 'valve_3',
    zoneId: 'node_zone_1',
    name: 'Electroválvula Sur (Nebulización Invernadero)',
    status: 'closed',
    flowRateLpm: 12.0,
    lastChanged: '2026-06-25 18:30',
  },
];

const DEFAULT_WEATHER: WeatherForecast = {
  location: 'San Juan, Sector 4 (Finca Las Camelias)',
  temperature: 24.8,
  condition: 'Rain',
  conditionEs: 'Lluvia Moderada Pronosticada',
  rainProbability6h: 85,
  expectedRainMm: 12.5,
  evapotranspirationEt0: 5.2,
  windSpeedKmh: 12,
  humidity: 78,
  updatedAt: '19:45 hrs',
};

const DEFAULT_HISTORY: IrrigationEvent[] = [
  {
    id: 'evt_101',
    zoneId: 'node_zone_1',
    zoneName: 'Sector 4 - Las Camelias',
    timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    dateStr: '26 Jun 2026',
    timeStr: '16:00',
    durationMinutes: 0,
    trigger: 'IA_PROACTIVA',
    action: 'POSTERGADO_POR_LLUVIA',
    waterAmountGallons: 0,
    costSavedUSD: 45.0,
    notes: 'Riego programado cancelado por pronóstico de tormenta (Prob. Lluvia 88%). Ahorro de 880 galones.',
  },
  {
    id: 'evt_100',
    zoneId: 'node_zone_1',
    zoneName: 'Sector 4 - Las Camelias',
    timestamp: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
    dateStr: '25 Jun 2026',
    timeStr: '06:30',
    durationMinutes: 35,
    trigger: 'PROGRAMADO',
    action: 'RIEGO_APLICADO',
    waterAmountGallons: 850,
    notes: 'Riego estándar matutino compensando evapotranspiración ET0 de 5.4mm.',
  },
  {
    id: 'evt_099',
    zoneId: 'node_zone_1',
    zoneName: 'Sector 4 - Las Camelias',
    timestamp: new Date(Date.now() - 3600 * 1000 * 52).toISOString(),
    dateStr: '24 Jun 2026',
    timeStr: '14:15',
    durationMinutes: 20,
    trigger: 'MANUAL',
    action: 'RIEGO_EMERGENCIA',
    waterAmountGallons: 420,
    notes: 'Activación manual por operario de zona tras detectar pico de calor de 34°C en sensor térmico.',
  },
  {
    id: 'evt_098',
    zoneId: 'node_zone_1',
    zoneName: 'Sector 4 - Las Camelias',
    timestamp: new Date(Date.now() - 3600 * 1000 * 76).toISOString(),
    dateStr: '23 Jun 2026',
    timeStr: '18:00',
    durationMinutes: 0,
    trigger: 'IA_PROACTIVA',
    action: 'POSTERGADO_POR_LLUVIA',
    waterAmountGallons: 0,
    costSavedUSD: 45.0,
    notes: 'Riego vespertino postergado. Lluvia registrada en estación local (14.2mm).',
  },
];

type Subscriber = (state: RTDBState) => void;
const subscribers: Set<Subscriber> = new Set();

function getStored<T>(key: string, backup: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : backup;
  } catch {
    return backup;
  }
}

function setStored(key: string, val: any) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export function getCurrentRTDBState(): RTDBState {
  const sensor = getStored(STORAGE_KEY_SENSORS, DEFAULT_SENSOR);
  const valves = getStored(STORAGE_KEY_VALVES, DEFAULT_VALVES);
  const thresholds = getStored(STORAGE_KEY_THRESHOLDS, DEFAULT_THRESHOLDS);
  const history = getStored(STORAGE_KEY_HISTORY, DEFAULT_HISTORY);
  const weather = getStored(STORAGE_KEY_WEATHER, DEFAULT_WEATHER);

  // Generar recomendación de IA en tiempo real basada en sensores actuales y clima
  const aiRecommendation = computeAIRecommendation(sensor, weather, thresholds);

  return {
    sensor,
    valves,
    thresholds,
    history,
    weather,
    aiRecommendation,
  };
}

function notifySubscribers() {
  const state = getCurrentRTDBState();
  subscribers.forEach((fn) => fn(state));
}

export function subscribeRTDB(callback: Subscriber): () => void {
  subscribers.add(callback);
  callback(getCurrentRTDBState());
  return () => subscribers.delete(callback);
}

export function computeAIRecommendation(
  sensor: SensorReading,
  weather: WeatherForecast,
  thresholds: ThresholdSettings
): AIRecommendation {
  const isBelowMin = sensor.moisture < thresholds.minMoisture;
  const willRain = weather.rainProbability6h >= thresholds.autoPostponeRainPct;

  if (isBelowMin && willRain) {
    return {
      id: 'rec_' + Date.now(),
      timestamp: 'Ahora mismo (IA Proactiva)',
      zoneId: sensor.id,
      type: 'POSTPONE_RAIN',
      severity: 'warning',
      title: 'Posponer riego programado (18:00)',
      message: `La humedad es de ${Math.round(sensor.moisture)}% (inferior al umbral configurado de ${thresholds.minMoisture}%), pero el pronóstico indica ${weather.rainProbability6h}% de probabilidad de lluvia (+${weather.expectedRainMm}mm) en las próximas 6 horas. Sugerimos postergar el riego.`,
      pushNotificationTriggered: true,
      waterSavedGallons: 880,
      estimatedCostSavedUSD: 45.0,
    };
  } else if (isBelowMin && !willRain) {
    return {
      id: 'rec_' + Date.now(),
      timestamp: 'Ahora mismo (IA Proactiva)',
      zoneId: sensor.id,
      type: 'IRRIGATE_URGENT',
      severity: 'warning',
      title: 'Activar Riego Inteligente Inmediato',
      message: `Humedad crítica detectada (${Math.round(sensor.moisture)}% vs umbral ${thresholds.minMoisture}%). Probabilidad de lluvia baja (${weather.rainProbability6h}%). Se sugiere abrir electroválvulas por 25 min.`,
      pushNotificationTriggered: true,
      waterSavedGallons: 0,
      estimatedCostSavedUSD: 0,
    };
  } else {
    return {
      id: 'rec_' + Date.now(),
      timestamp: 'Hace 5 min',
      zoneId: sensor.id,
      type: 'OPTIMAL_STANDBY',
      severity: 'success',
      title: 'Condiciones de Suelo Óptimas',
      message: `La humedad del suelo (${Math.round(sensor.moisture)}%) está dentro del rango ideal (${thresholds.minMoisture}% - ${thresholds.maxMoisture}%). Modo ahorro de electrólisis activo en nodos ESP32.`,
      pushNotificationTriggered: false,
      waterSavedGallons: 0,
      estimatedCostSavedUSD: 0,
    };
  }
}

// Actuadores de Escritura Firebase Realtime Database
export function updateRTDBThresholds(newThresholds: ThresholdSettings) {
  setStored(STORAGE_KEY_THRESHOLDS, newThresholds);
  // Actualizar también en el objeto del sensor para coherencia visual
  const currentSensor = getStored(STORAGE_KEY_SENSORS, DEFAULT_SENSOR);
  setStored(STORAGE_KEY_SENSORS, { ...currentSensor, moistureThreshold: newThresholds.minMoisture });
  notifySubscribers();
}

export function confirmAIPostponeAction() {
  const history = getStored(STORAGE_KEY_HISTORY, DEFAULT_HISTORY);
  const sensor = getStored(STORAGE_KEY_SENSORS, DEFAULT_SENSOR);
  const weather = getStored(STORAGE_KEY_WEATHER, DEFAULT_WEATHER);

  const newEvent: IrrigationEvent = {
    id: 'evt_' + Math.floor(Math.random() * 89999 + 10000),
    zoneId: sensor.id,
    zoneName: sensor.zoneName,
    timestamp: new Date().toISOString(),
    dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    timeStr: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    durationMinutes: 0,
    trigger: 'IA_PROACTIVA',
    action: 'POSTERGADO_POR_LLUVIA',
    waterAmountGallons: 0,
    costSavedUSD: 45.0,
    notes: `Confirmado en App: Riego cancelado anticipando tormenta (${weather.rainProbability6h}% prob). Ahorro directo de $45.00 en agua y bombeo.`,
  };

  setStored(STORAGE_KEY_HISTORY, [newEvent, ...history]);
  notifySubscribers();
}

export function triggerManualIrrigationRTDB(durationMin: number, valveId: string) {
  const history = getStored(STORAGE_KEY_HISTORY, DEFAULT_HISTORY);
  const valves = getStored(STORAGE_KEY_VALVES, DEFAULT_VALVES);
  const sensor = getStored(STORAGE_KEY_SENSORS, DEFAULT_SENSOR);

  // Abrir electroválvula
  const updatedValves = valves.map((v) =>
    v.id === valveId ? { ...v, status: 'open' as const, lastChanged: 'Ahora mismo (Manual)' } : v
  );
  setStored(STORAGE_KEY_VALVES, updatedValves);

  // Registrar en historial
  const newEvent: IrrigationEvent = {
    id: 'evt_' + Math.floor(Math.random() * 89999 + 10000),
    zoneId: sensor.id,
    zoneName: sensor.zoneName,
    timestamp: new Date().toISOString(),
    dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    timeStr: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    durationMinutes: durationMin,
    trigger: 'MANUAL',
    action: 'RIEGO_APLICADO',
    waterAmountGallons: Math.round(durationMin * 24.5),
    notes: `Apertura manual remota desde panel AgroMind App. Duración fijada: ${durationMin} minutos.`,
  };

  setStored(STORAGE_KEY_HISTORY, [newEvent, ...history]);

  // Simular incremento paulatino de humedad tras regar
  setTimeout(() => {
    const curSensor = getStored(STORAGE_KEY_SENSORS, DEFAULT_SENSOR);
    setStored(STORAGE_KEY_SENSORS, {
      ...curSensor,
      moisture: Math.min(95, curSensor.moisture + 18),
      lastReadTimestamp: 'Hace unos segundos (Pulsed IoT)',
    });
    // Cerrar válvula
    const closedValves = getStored(STORAGE_KEY_VALVES, DEFAULT_VALVES).map((v: ValveState) =>
      v.id === valveId ? { ...v, status: 'closed' as const, lastChanged: 'Recién cerrado' } : v
    );
    setStored(STORAGE_KEY_VALVES, closedValves);
    notifySubscribers();
  }, 3500);

  notifySubscribers();
}

export function simulateLiveIoTPulse(customMoisture?: number) {
  const curSensor = getStored(STORAGE_KEY_SENSORS, DEFAULT_SENSOR);
  const newMoisture = customMoisture !== undefined ? customMoisture : Math.max(30, Math.min(88, curSensor.moisture + (Math.random() * 6 - 3)));
  setStored(STORAGE_KEY_SENSORS, {
    ...curSensor,
    moisture: Number(newMoisture.toFixed(1)),
    lastReadTimestamp: 'Hace 10ms (Pulso Anti-Corrosión)',
    temperature: Number((curSensor.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1)),
  });
  notifySubscribers();
}

export function resetRTDBSimulation() {
  localStorage.clear();
  notifySubscribers();
}
