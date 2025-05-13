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
    // Intenta obtener el token de localStorage o sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      // Redirige al login si no hay token
      window.location.href = '/login';
      throw new Error('Redirigiendo a login...');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.get(baseURL, {
      ...config,
      params
    });
    
    return response.data.data;
  } catch (err) {
    if (err.response?.status === 401) {
      // Token inválido - limpiar y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    setError(err.message);
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

// Frontend - CotizacionService.js (versión mejorada)
const crearCotizacion = async (cotizacionData) => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    };

    const response = await axios.post(baseURL, cotizacionData, config);
    return response.data;

  } catch (error) {
    if (error.response?.status === 401) {
      // Token inválido - limpiar almacenamiento y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    console.error('Error en crearCotizacion:', error);
    throw error.response?.data || error;
  } finally {
    setLoading(false);
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