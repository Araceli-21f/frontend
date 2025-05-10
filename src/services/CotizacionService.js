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
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!token || !userData?._id) {
      throw new Error('Usuario no autenticado correctamente');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-User-Id': userData._id // Header adicional para debug
      },
      timeout: 10000
    };

    // Debug: Verificar token antes de enviar
    console.log('Token que se enviará:', token);

    const response = await axios.post(baseURL, cotizacionData, config);
    return response.data;

  } catch (error) {
    // Manejo detallado de errores
    console.error('Error completo en crearCotizacion:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      tokenInLocalStorage: localStorage.getItem('token'),
      userInLocalStorage: localStorage.getItem('user')
    });

    if (error.response?.status === 401) {
      // Limpiar datos de sesión si el token es inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    throw error;
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