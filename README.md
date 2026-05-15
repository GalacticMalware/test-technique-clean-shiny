markdown# Clean and Shiny - Automation Service 🚀

Prueba tecnica Clean and Shiny
---

## 🏛️ Arquitectura del Sistema

El proyecto implementa una **Arquitectura Dirigida por Eventos (EDA)** y desacoplada mediante colas de mensajería en memoria. El ciclo de vida de una petición sigue el siguiente flujo:

1. **API Gateway (Express + ESM):** Punto de entrada único. Valida firmas criptográficas de seguridad, verifica idempotencia rápida y delega la tarea. Tiempo de respuesta: `< 50ms`.
2. **Buffer de Resiliencia (BullMQ + Redis):** Absorbe picos masivos de tráfico en webhooks (Gmail / QUO SMS) evitando la pérdida de paquetes.
3. **Workers Dedicados:** Procesos independientes que extraen tareas de la cola, consultan el contexto unificado en la base de datos, extraen intenciones usando IA y ejecutan transacciones.
4. **Capa Integrada de Proveedores:** Conexión nativa con Supabase, Teamup Calendar, Invoice Ninja y canales de escalación humana (Slack).

---

## 📂 Estructura del Proyecto (Enterprise-Ready)

```text
clean-shiny-automation/
├── .env.example             # Plantilla de variables de entorno (vacía para producción)
├── package.json             # Configuración de dependencias y scripts ESM
├── tsconfig.json            # Configuración estricta del compilador de TypeScript
└── src/
    ├── app                  # Configuración global del ciclo de vida de Express
    ├── server.ts            # Punto de entrada HTTP y arranque del servidor
    ├── config/              # Validadores de entornos y constantes del sistema
    ├── core/                # Infraestructura núcleo (Inicialización de BullMQ/Redis)
    ├── controllers/         # Controladores de Webhooks y desestructuración de payloads
    ├── interfaces/          # Tipados estrictos y contratos DTO de TypeScript
    ├── middlewares/         # Capa de seguridad, rate-limiting y catch-all de errores
    ├── routes/              # Centralización de enrutamiento modular y versionado de API
    ├── services/            # Clases encapsuladas para integraciones con APIs de terceros
    └── workers/             # Procesadores asíncronos de la cola de mensajería
```

---

## 🛠️ Requisitos Previos

Antes de levantar el entorno local, asegúrate de tener instalado:
* **Node.js** (Versión v20 o superior para soporte nativo estable de ESM)
* **Redis Server** (v7.0+ ejecutándose localmente o una instancia en la nube)
* **TypeScript Compiler** (Instalado globalmente o vía dependencias de desarrollo)

---

## ⚙️ Configuración del Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo. **Mantén las comillas vacías** e introduce tus credenciales correspondientes:

```env
  PORT=3000,
  
  // LLMs
  GEMINI_API_KEY='',
  OPENAI_API_KEY='' ,
  MISTRAL_API_KEY='',
  
  // Integraciones
  TEAMUP_API_KEY='',
  TEAMUP_CALENDAR_ID='',
  INVOICE_NINJA_TOKEN='',
  SUPABASE_URL='',
  SUPABASE_ANON_KEY='',
  SLACK_WEBHOOK_URL='',
  
  // QUO (SMS)
  QUO_API_KEY='',
  QUO_WEBHOOK_SECRET='',
  
  // Gmail
  GMAIL_CLIENT_ID='',
  GMAIL_CLIENT_SECRET='',
  GMAIL_REFRESH_TOKEN='',
```

---

## 🚀 Instalación y Despliegue

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com
cd clean-shiny-automation
npm install
```

### 2. Ejecutar en Entorno de Desarrollo (Hot-Reloading)
Utiliza `tsx` para compilar y ejecutar en tiempo real sin generar archivos basura en disco:
```bash
npm run dev
```

### 3. Compilación y Arranque para Producción (Build)
Genera el artefacto transpilado en JavaScript nativo optimizado con módulos de ECMAScript (`dist/`):
```bash
npm run build
npm start
```

---

## 🛡️ Pilares de Calidad y Resiliencia

* **Idempotencia Absoluta:** Cada webhook entrante se valida contra la clave primaria `message_id` en Supabase antes de ser encolado. Peticiones de red duplicadas se descartan en la frontera.
* **Control de Costos de IA:** El sistema implementa un filtro por Regex duro para confirmaciones de texto comunes (Costo = $0). Las consultas dinámicas utilizan un esquema estructurado (**JSON Schema**) a través de modelos ligeros locales como *Mistral Small*, reservando LLMs avanzados únicamente para la redacción empática de quejas complejas.
* **Rate-Limiting Operacional:** Los workers de BullMQ regulan automáticamente las peticiones hacia Teamup e Invoice Ninja para evitar bloqueos por límites de uso (*Rate Limits*), aplicando reintentos automáticos con retrasos exponenciales (*Backoff*).
* **Escalación Segura (Fallback Humano):** Si la IA devuelve un puntaje de confianza inferior al 85% o requiere una temperatura de creatividad superior a 0.7, la automatización se detiene e inyecta de inmediato una alerta en el canal operativo de Slack para atención humana manual.

---
