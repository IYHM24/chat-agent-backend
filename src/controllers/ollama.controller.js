/**
 * Controlador de autenticación
 */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ollamaService from '../services/ollama.service.js';
/**
 * @desc    Insertar productos masivamente
 * @route   POST /api/v1/products/insert/masivo
 * @access  Public
 */
const askAgent = asyncHandler(async (req, res) => {
  
  const Messages = req.body;
  const agentAnswer = await ollamaService.generateMessages(Messages);
    
  const responseData = [
    ...Messages,
    agentAnswer
  ]

  ApiResponse.created(res, responseData, `Respuesta generada correctamente`);
});




export {
 askAgent
};
