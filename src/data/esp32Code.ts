export const ESP32_LOW_LEVEL_CODE = `/**
 * @title AgroMind MVP - Nodo IoT de Monitoreo de Suelo (ESP32 / Arduino)
 * @description Lectura pulsada ultra-corta (10ms cada 30 min) para eliminar 
 * electrólisis galvánica y corrosión del sensor capacitivo/resistivo.
 * @author AgroMind Engineering Team
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- CONFIGURACIÓN DE PINES Y TIEMPOS ---
#define SENSOR_POWER_PIN  23 // Pin conectado a Base de Transistor NPN / Gate de MOSFET (2N2222 o AO3400)
#define SENSOR_ANALOG_PIN 34 // Pin ADC1 para lectura de humedad de suelo
#define BATTERY_PIN       35 // Pin ADC para monitoreo de voltaje de batería (división resistiva)

// Tiempos de operación anti-electrólisis
const unsigned long PULSE_DURATION_MS = 10;          // Tiempo total de energización del sensor (10ms)
const unsigned long DEEP_SLEEP_SECONDS = 30 * 60;    // 30 minutos en Deep Sleep (1800s)
const uint64_t uS_TO_S_FACTOR = 1000000ULL;          // Factor de conversión microsegundos a segundos

// Configuración Firebase Realtime Database & Wi-Fi
const char* WIFI_SSID = "AGRO_GREENHOUSE_WIFI";
const char* WIFI_PASS = "smartirrigation2026";
const char* FIREBASE_RTDB_URL = "https://agromind-mvp-default-rtdb.firebaseio.com/sensors/node_zone_1.json";

RTC_DATA_ATTR int bootCount = 0; // Variable persistente en memoria RTC durante Deep Sleep

void setup() {
  Serial.begin(115200);
  bootCount++;
  
  // 1. Mantener apagado el sensor por defecto para evitar paso de corriente galvánica
  pinMode(SENSOR_POWER_PIN, OUTPUT);
  digitalWrite(SENSOR_POWER_PIN, LOW);
  pinMode(SENSOR_ANALOG_PIN, INPUT);

  Serial.println("\\n[AgroMind IoT] Despertando de Deep Sleep # " + String(bootCount));

  // 2. Proceso de Lectura Pulsada (Pulsed Excitation)
  int moistureRaw = readMoisturePulsed();
  float moisturePercent = mapMoistureToPercent(moistureRaw);
  float batteryVolts = readBatteryVoltage();

  Serial.printf("[Sensor] Humedad Leída: %.1f %% (Raw: %d)\\n", moisturePercent, moistureRaw);

  // 3. Conexión Wi-Fi rápida y envío a Firebase Realtime Database
  if (connectWiFiFast()) {
    sendTelemetryToFirebase(moisturePercent, batteryVolts);
    WiFi.disconnect(true);
    WiFi.mode(WIFI_OFF);
  }

  // 4. Configurar temporizador de Deep Sleep y dormir
  Serial.printf("[IoT Sleep] Entrando en reposo profundo por %ld minutos...\\n", DEEP_SLEEP_SECONDS / 60);
  esp_sleep_enable_timer_wakeup(DEEP_SLEEP_SECONDS * uS_TO_S_FACTOR);
  
  // Aislar pines durante el sueño para garantizar 0uA de fuga al suelo
  gpio_hold_en((gpio_num_t)SENSOR_POWER_PIN);
  esp_deep_sleep_start();
}

void loop() {
  // El ciclo principal nunca se ejecuta debido a esp_deep_sleep_start() en setup()
}

/**
 * Energiza el transistor de conmutación únicamente durante 10ms.
 * Evita la disociación iónica del agua y oxidación galvánica de los electrodos.
 */
int readMoisturePulsed() {
  unsigned long startPulse = millis();
  
  // PASO A: Disparar Transistor de conmutación (Energizar sonda)
  digitalWrite(SENSOR_POWER_PIN, HIGH);
  
  // PASO B: Esperar 2ms para estabilización del circuito RC capacitivo
  delayMicroseconds(2000); 
  
  // PASO C: Muestreo analógico veloz (promedio de 8 lecturas en ~6ms)
  long accumulator = 0;
  const int SAMPLES = 8;
  for (int i = 0; i < SAMPLES; i++) {
    accumulator += analogRead(SENSOR_ANALOG_PIN);
    delayMicroseconds(500);
  }
  
  // PASO D: Corte inmediato de energía (< 10ms totales)
  digitalWrite(SENSOR_POWER_PIN, LOW);
  
  unsigned long activeTime = millis() - startPulse;
  Serial.printf("[Diagnóstico] Sonda energizada durante exactamente %lu ms\\n", activeTime);
  
  return (int)(accumulator / SAMPLES);
}

float mapMoistureToPercent(int rawValue) {
  // Calibración estándar ADC ESP32 (12-bit: 0 - 4095) en suelo seco vs saturado
  const int DRY_AIR_RAW = 3200;  // 0% humedad
  const int WATER_SAT_RAW = 1450;// 100% humedad
  
  float pct = ((float)(DRY_AIR_RAW - rawValue) / (DRY_AIR_RAW - WATER_SAT_RAW)) * 100.0;
  return constrain(pct, 0.0, 100.0);
}

float readBatteryVoltage() {
  int rawBat = analogRead(BATTERY_PIN);
  return (rawBat / 4095.0) * 3.3 * 2.0; // Divisor de tensión 1:1 en batería LiPo 4.2V
}

bool connectWiFiFast() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  int retries = 0;
  while (WiFi.status() !== WL_CONNECTED && retries < 20) {
    delay(150);
    retries++;
  }
  return WiFi.status() === WL_CONNECTED;
}

void sendTelemetryToFirebase(float moisture, float battery) {
  if (WiFi.status() !== WL_CONNECTED) return;
  
  HTTPClient http;
  http.begin(FIREBASE_RTDB_URL);
  http.addHeader("Content-Type", "application/json");

  // Estructura JSON compatible con Firebase Realtime Database REST API
  StaticJsonDocument<200> doc;
  doc["moisture"] = moisture;
  doc["battery"] = battery;
  doc["timestamp"] = "2026-06-26T20:30:00Z";
  doc["status"] = (moisture < 40.0) ? "CRITICAL_LOW" : "NORMAL";

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  int httpResponseCode = http.PUT(jsonPayload); // PUT actualiza el nodo en tiempo real
  if (httpResponseCode > 0) {
    Serial.printf("[Firebase RTDB] Sincronizado OK (Code: %d)\\n", httpResponseCode);
  } else {
    Serial.printf("[Firebase RTDB] Error de envío: %s\\n", http.errorToString(httpResponseCode).c_str());
  }
  http.end();
}
`;
