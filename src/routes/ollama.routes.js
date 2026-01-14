/**
 * Rutas de Ollama
 */

import express from 'express';
import { askAgent } from '../controllers/ollama.controller.js';

const router = express.Router();


// Rutas protegidas
router.post(
    '/ask',        // Ruta para insertar productos masivamente
    //protect,            // Middleware de protección (autenticación requerida)
    askAgent   // Controlador para manejar la inserción de productos
);




export default router;
