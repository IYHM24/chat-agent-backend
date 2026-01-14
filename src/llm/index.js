/**
 * Punto de entrada principal del módulo LLM
 * 
 * Exporta las funcionalidades principales para facilitar las importaciones
 */

import ollamaService from '../services/ollama.service.js';
import intentValidator from './validators/intent.validator.js';
import config from '../config/llm.config.js';

/**
 * Función principal para procesar preguntas de usuarios
 * 
 * @param {string} userQuestion - Pregunta del usuario
 * @returns {Promise<Object>} - Intención validada
 */
async function extractIntent(userQuestion) {
  // Extraer intención usando LLM con reintentos
  const rawIntent = await ollamaService.extractIntentWithRetry(userQuestion);
  
  // Validar contra JSON Schema
  const validatedIntent = intentValidator.validateOrThrow(rawIntent);
  
  return validatedIntent;
}

/**
 * Función que retorna resultado de validación sin lanzar error
 * 
 * @param {string} userQuestion - Pregunta del usuario
 * @returns {Promise<Object>} - { valid: boolean, errors: Array|null, data: Object|null }
 */
async function extractIntentSafe(userQuestion) {
  try {
    const rawIntent = await ollamaService.extractIntentWithRetry(userQuestion);
    const result = intentValidator.validateIntent(rawIntent);
    return result;
  } catch (error) {
    return {
      valid: false,
      errors: [{ field: 'system', message: error.message }],
      data: null
    };
  }
}

// Exportar funciones principales
export {
  // Funciones principales
  extractIntent,
  extractIntentSafe,
  
  // Servicios (para uso avanzado)
  ollamaService,
  intentValidator,
  
  // Configuración
  config
};

// Exportación por defecto
export default {
  extractIntent,
  extractIntentSafe,
  ollamaService,
  intentValidator,
  config
};
