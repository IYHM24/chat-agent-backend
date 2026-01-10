/**
 * Servicio genérico para ejecutar stored procedures de MySQL
 * Equivalente a Dapper de .NET
 */

import { sequelize } from '../config/database.js';
import { QueryTypes } from 'sequelize';
import { logger } from '../config/logger.js';

class TransactSQL {
  /**
   * Ejecutar SP que retorna un único registro
   * @param {string} procedure - Nombre del stored procedure
   * @param {object} parameters - Parámetros del SP
   * @returns {Promise<object|null>}
   */
  async singleQuery(procedure, parameters = {}) {
    try {
      const placeholders = Object.keys(parameters)
        .map(key => `:${key}`)
        .join(', ');
      
      const query = placeholders 
        ? `CALL ${procedure}(${placeholders})`
        : `CALL ${procedure}()`;

      logger.debug(`Ejecutando query: ${query}`, parameters);

      const [results] = await sequelize.query(query, {
        replacements: parameters,
        type: QueryTypes.SELECT,
        raw: true
      });

      return results?.[0] || null;
    } catch (error) {
      logger.error(`Error en singleQuery - ${procedure}:`, {
        message: error.message,
        sql: error.sql,
        parameters: error.parameters
      });
      throw error;
    }
  }

  /**
   * Ejecutar SP sin retornar resultados
   * @param {string} procedure - Nombre del stored procedure
   * @returns {Promise<number>} - Número de filas afectadas
   */
  async singleQueryAsync(procedure) {
    try {
      const [, metadata] = await sequelize.query(`CALL ${procedure}()`, {
        raw: true
      });

      return metadata?.affectedRows || 0;
    } catch (error) {
      logger.error(`Error en singleQueryAsync - ${procedure}:`, error);
      return 0;
    }
  }

  /**
   * Ejecutar SP que retorna múltiples registros
   * @param {string} procedure - Nombre del stored procedure
   * @param {object} parameters - Parámetros del SP
   * @returns {Promise<Array>}
   */
  async listQuery(procedure, parameters = {}) {
    try {
      const placeholders = Object.keys(parameters)
        .map(key => `:${key}`)
        .join(', ');
      
      const query = placeholders 
        ? `CALL ${procedure}(${placeholders})`
        : `CALL ${procedure}()`;

      const [results] = await sequelize.query(query, {
        replacements: parameters,
        type: QueryTypes.SELECT,
        raw: true
      });

      return results || [];
    } catch (error) {
      logger.error(`Error en listQuery - ${procedure}:`, error);
      throw error;
    }
  }

  /**
   * Ejecutar SP sin retornar resultados (INSERT/UPDATE/DELETE)
   * @param {string} procedure - Nombre del stored procedure
   * @param {object} parameters - Parámetros del SP
   * @returns {Promise<void>}
   */
  async executeQuery(procedure, parameters = {}) {
    try {
      const placeholders = Object.keys(parameters)
        .map(key => `:${key}`)
        .join(', ');
      
      const query = placeholders 
        ? `CALL ${procedure}(${placeholders})`
        : `CALL ${procedure}()`;

      await sequelize.query(query, {
        replacements: parameters,
        type: QueryTypes.RAW
      });
    } catch (error) {
      logger.error(`Error en executeQuery - ${procedure}:`, error);
      throw error;
    }
  }

  /**
   * Ejecutar query SQL directa
   * @param {string} query - Query SQL
   * @param {object} parameters - Parámetros
   * @param {QueryTypes} type - Tipo de query
   * @returns {Promise<any>}
   */
  async rawQuery(query, parameters = {}, type = QueryTypes.SELECT) {
    try {
      const [results] = await sequelize.query(query, {
        replacements: parameters,
        type: type,
        raw: true
      });

      return results;
    } catch (error) {
      logger.error('Error en rawQuery:', error);
      throw error;
    }
  }
}

export default new TransactSQL();
