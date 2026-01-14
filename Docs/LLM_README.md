````markdown
# Módulo LLM - Extracción de Intenciones

Módulo para integración con Ollama (Phi-3) que convierte preguntas de usuarios en intenciones estructuradas y validadas.

## 📁 Estructura

```
src/
├── config/
│   └── llm.config.js              # Configuración centralizada (movido aquí)
├── services/
│   └── ollama.service.js          # Servicio de comunicación con Ollama (movido aquí)
└── llm/
    ├── prompts/
    │   └── intent-extraction.v1.prompt.txt  # Prompt versionado
    ├── schemas/
    │   └── intent.schema.json     # JSON Schema de validación
    ├── validators/
    │   └── intent.validator.js    # Validador usando AJV
    ├── examples/
    │   └── intent-extraction.example.js  # Ejemplo completo de uso
    └── index.js                   # Punto de entrada
```

## 🎯 Contrato de Intención

```javascript
{
  "entity": "product",           // Solo "product" es válido
  "filters": {
    "brand": string | null,      // Marca del producto (opcional)
    "model": string | null       // Modelo del producto (opcional)
  },
  "fields": string[]             // Campos solicitados (ports, price, stock, etc.)
}
```

### Campos válidos
- `ports` - Número de puertos
- `price` - Precio
- `stock` - Disponibilidad
- `description` - Descripción
- `brand` - Marca
- `model` - Modelo
- `name` - Nombre del producto
- `features` - Características

## 🚀 Uso

### Básico

```javascript
import { processUserQuestion } from './llm/examples/intent-extraction.example.js';

// Extraer y validar intención
const intent = await processUserQuestion('¿Cuántos puertos tiene el forti32h?');

console.log(intent);
// {
//   "entity": "product",
//   "filters": {
//     "brand": null,
//     "model": "forti32h"
//   },
//   "fields": ["ports"]
// }
```

### Avanzado

```javascript
import ollamaService from './services/ollama.service.js';
import intentValidator from './llm/validators/intent.validator.js';

async function processQuestion(userQuestion) {
  try {
    // Extraer intención (con reintentos automáticos)
    const rawIntent = await ollamaService.extractIntentWithRetry(userQuestion);
    
    // Validar con JSON Schema
    const validatedIntent = intentValidator.validateOrThrow(rawIntent);
    
    return validatedIntent;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}
```

## ⚙️ Configuración

### Variables de entorno (.env)

```bash
# URL del servidor Ollama
OLLAMA_BASE_URL=http://localhost:11434

# Modelo a utilizar
OLLAMA_MODEL=phi3

# Timeout (milisegundos)
OLLAMA_TIMEOUT=30000
```

### Cambiar modelo LLM

Editar [src/config/llm.config.js](src/config/llm.config.js):

```javascript
export default {
  ollama: {
    model: 'llama2',  // Cambiar aquí
    // ... resto de configuración
  }
};
```

## 📋 Prerequisitos

1. **Ollama instalado y ejecutándose**
   ```bash
   # Instalar Ollama
   # https://ollama.ai/download
   
   # Descargar modelo Phi-3
   ollama pull phi3
   
   # Verificar que esté corriendo
   ollama list
   ```

2. **Dependencias instaladas**
   ```bash
   pnpm install
   ```

3. **Package.json configurado con ES modules**
   ```json
   {
     "type": "module"
   }
   ```

## 🧪 Ejecutar ejemplos

```bash
node src/llm/examples/intent-extraction.example.js
```

Ejecutará 4 ejemplos:
- ✓ "¿Cuántos puertos tiene el forti32h?"
- ✓ "¿Cuál es el precio del Cisco 2960?"
- ✓ "Dame información del router Mikrotik RB3011"
- ✓ "¿Hay stock de switches HP?"

## 🏗️ Arquitectura

### Separación de responsabilidades

1. **Config** ([llm.config.js](../src/config/llm.config.js))
   - Configuración centralizada
   - Fácil cambio de modelo/proveedor

2. **Prompts** ([*.prompt.txt](../src/llm/prompts/))
   - Versionados en archivos separados
   - No hardcodeados en el código
   - Fáciles de iterar y mejorar

3. **Service** ([ollama.service.js](../src/services/ollama.service.js))
   - Comunicación con Ollama
   - Manejo de errores y reintentos
   - Parseo de JSON
   - Cache de prompts

4. **Validator** ([intent.validator.js](../src/llm/validators/intent.validator.js))
   - Validación estricta con AJV
   - Rechazo de respuestas inválidas
   - Mensajes de error claros

5. **Schema** ([intent.schema.json](../src/llm/schemas/intent.schema.json))
   - Contrato formal de la intención
   - Validación automática
   - Documentación implícita

## ⚡ Características

✅ **Prompts versionados** - Fácil rollback y A/B testing  
✅ **Validación estricta** - JSON Schema asegura respuestas válidas  
✅ **Reintentos automáticos** - Backoff exponencial  
✅ **Cache de prompts** - Mejor performance  
✅ **Preparado para cambio de modelo** - Configuración centralizada  
✅ **Manejo robusto de errores** - Mensajes claros y accionables  
✅ **Sin lógica de BD** - Enfocado solo en extracción de intención  

## 🔧 Personalización

### Agregar nuevos campos

1. Editar [intent.schema.json](../src/llm/schemas/intent.schema.json):
```json
"fields": {
  "items": {
    "enum": ["ports", "price", "stock", "nuevoCampo"]
  }
}
```

2. Actualizar [intent-extraction.v1.prompt.txt](../src/llm/prompts/intent-extraction.v1.prompt.txt) con ejemplos

3. Recargar schema:
```javascript
intentValidator.reloadSchema();
```

### Versionar prompts

Crear nuevo archivo `intent-extraction.v2.prompt.txt` y actualizar config:

```javascript
// llm.config.js
paths: {
  intentPromptVersion: 'v2'  // Cambiar aquí
}
```

## 📊 Ejemplo de flujo completo

```
Usuario: "¿Cuántos puertos tiene el forti32h?"
   ↓
[Ollama Service] Carga prompt + pregunta
   ↓
[Ollama/Phi-3] Genera respuesta JSON
   ↓
{
  "entity": "product",
  "filters": { "brand": null, "model": "forti32h" },
  "fields": ["ports"]
}
   ↓
[Intent Validator] Valida contra schema
   ↓
✓ Intención validada lista para usar
```

## 🚨 Manejo de errores

El módulo rechaza:
- ❌ Respuestas no-JSON
- ❌ Campos extra no permitidos
- ❌ Entity diferente de "product"
- ❌ Fields con valores inválidos
- ❌ Filtros mal formados
- ❌ Timeouts del modelo

## 📝 Notas importantes

- **No incluye lógica de base de datos** - Solo extracción de intención
- **No genera SQL** - La intención debe ser procesada por otro módulo
- **No responde preguntas** - Solo estructura la pregunta

## 🔐 Seguridad

- ✅ Validación estricta de entrada (JSON Schema)
- ✅ No se permiten campos adicionales (additionalProperties: false)
- ✅ Enum limita valores posibles
- ✅ Sin inyección de prompts (prompt separado del input)

````
