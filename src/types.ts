export type TabType = 'dashboard' | 'history' | 'roi' | 'monitor' | 'iot_code' | 'structure';

export interface ThresholdSettings {
  minMoisture: number; // e.g., 45%
  maxMoisture: number; // e.g., 80%
  autoPostponeRainPct: number; // e.g., 60% probability
}

export interface IrrigationEvent {
  id: string;
  zoneId: string;
  zoneName: string;
  timestamp: string;
  dateStr: string;
  timeStr: string;
  durationMinutes: number;
  trigger: 'IA_PROACTIVA' | 'MANUAL' | 'PROGRAMADO';
  action: 'POSTERGADO_POR_LLUVIA' | 'RIEGO_APLICADO' | 'RIEGO_EMERGENCIA';
  waterAmountGallons: number;
  costSavedUSD?: number;
  notes: string;
}

export interface SensorReading {
  id: string;
  zoneName: string;
  cropType: string;
  moisture: number; // Porcentaje 0 - 100
  moistureThreshold: number; // Umbral crítico ej. 45%
  temperature: number; // Celsius
  ambientHumidity: number; // Porcentaje
  salinityEC: number; // dS/m
  lastReadTimestamp: string;
  batteryLevel: number; // Porcentaje 0-100
  signalStrength: number; // dBm (-40 a -90)
}

export interface ValveState {
  id: string;
  zoneId: string;
  name: string;
  status: 'closed' | 'open' | 'auto';
  flowRateLpm: number; // Litros por minuto
  lastChanged: string;
}

export interface WeatherForecast {
  location: string;
  temperature: number;
  condition: 'Clear' | 'Clouds' | 'Rain' | 'Thunderstorm' | 'Drizzle';
  conditionEs: string;
  rainProbability6h: number; // 0 - 100%
  expectedRainMm: number; // Milímetros esperados en 6h
  evapotranspirationEt0: number; // mm/día
  windSpeedKmh: number;
  humidity: number;
  updatedAt: string;
}

export interface AIRecommendation {
  id: string;
  timestamp: string;
  zoneId: string;
  type: 'POSTPONE_RAIN' | 'IRRIGATE_URGENT' | 'OPTIMAL_STANDBY' | 'ADJUST_ET0';
  severity: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  pushNotificationTriggered: boolean;
  waterSavedGallons: number;
  estimatedCostSavedUSD: number;
}

export interface ROISimulationParams {
  acres: number;
  costPerAcreUSD: number; // Base $45/acre
  irrigationEventsPerMonth: number;
  unnecessaryIrrigationsPreventedPct: number; // % de riegos cancelados por lluvia/IA
  waterCostPer1kGallons: number;
  gallonsPerAcreEvent: number;
}

export interface ROISimulationResult {
  monthlySavingsUSD: number;
  annualSavingsUSD: number;
  waterSavedGallonsYear: number;
  paybackPeriodMonths: number;
  roiPercentage: number;
}

export interface PlantHealthStream {
  url: string;
  status: 'live' | 'buffering' | 'offline';
  ndviScore: number; // Vigor foliar 0.0 - 1.0
  pestAnomalyDetected: boolean;
  lastAnalysis: string;
}
