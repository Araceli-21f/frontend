import { useState, useCallback } from 'react';
import axios from 'axios';

const CotizacionService = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = 'http://localhost:8000/cotizaciones'; // Nota el /api añadido

    // Función para configurar axios con el token
    const getConfig = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    };

    const obtenerCotizaciones = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(baseURL, {
                ...getConfig(),
                params
            });
            return response.data.data; // Ajuste para la estructura de respuesta
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerCotizacionPorId = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseURL}/${id}`, getConfig());
            return response.data.data;
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // En tu CotizacionService.js
const crearCotizacion = async (cotizacionData) => {
    try {
      const token = localStorage.getItem('token'); // O tu método de almacenamiento
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log("Enviando datos:", cotizacionData);
      const response = await axios.post(baseURL, cotizacionData, config);
      return response.data;
    } catch (err) {
      console.error("Error detallado:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      throw err;
    }
  };

    const actualizarCotizacion = async (id, cotizacionData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${baseURL}/${id}`, cotizacionData, getConfig());
            return response.data;
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const eliminarCotizacion = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`${baseURL}/${id}`, getConfig());
            return response.data;
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Funciones adicionales para operaciones específicas
    const activarServicio = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${baseURL}/${id}/activar`, {}, getConfig());
            return response.data;
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const registrarPago = async (id, pagoData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${baseURL}/${id}/pagos`, pagoData, getConfig());
            return response.data;
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        obtenerCotizaciones,
        obtenerCotizacionPorId,
        crearCotizacion,
        actualizarCotizacion,
        eliminarCotizacion,
        activarServicio,
        registrarPago
    };
};

export default CotizacionService;