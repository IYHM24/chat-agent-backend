/**
 * Configuración centralizada para el servicio LLM
 * 
 * Este archivo facilita el cambio de modelo o proveedor LLM
 * sin necesidad de modificar el código del servicio
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  // Configuración de Ollama
  ollama: {
    // URL base del servidor Ollama (puede ser local o remoto)
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    
    // Modelo a utilizar (cambiar aquí para usar otro modelo)
    // Opciones comunes: phi3, llama2, mistral, codellama
    model: process.env.OLLAMA_MODEL || 'phi3',
    
    // Timeout para las peticiones (en milisegundos)
    timeout: parseInt(process.env.OLLAMA_TIMEOUT) || 60000,
    
    // Parámetros de generación
    options: {
      // Temperatura: controla la aleatoriedad (0 = determinista, 1 = creativo)
      temperature: 0.1, // Bajo para respuestas más consistentes
      
      // Top-p: muestreo de núcleo
      top_p: 0.9,
      
      // Número máximo de tokens a generar
      num_predict: 500,
      
      // Stop tokens: detener generación al encontrar estos tokens
      stop: ['\n\n', '```']
    }
  },

  // Rutas de archivos del módulo LLM
  paths: {
    // Directorio base del módulo LLM
    baseDir: join(__dirname, '..', 'llm'),
    
    // Directorio de prompts
    promptsDir: join(__dirname, '..', 'llm', 'prompts'),
    
    // Directorio de schemas
    schemasDir: join(__dirname, '..', 'llm', 'schemas'),
    
    // Versión actual del prompt de extracción de intenciones
    intentPromptVersion: 'v1'
  },

  // Configuración de reintentos
  retry: {
    // Número máximo de reintentos en caso de error
    maxAttempts: 3,
    
    // Delay entre reintentos (en milisegundos)
    delayMs: 1000,
    
    // Factor de backoff exponencial
    backoffMultiplier: 2
  }
};
