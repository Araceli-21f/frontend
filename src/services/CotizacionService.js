import { useState, useCallback } from 'react';
import axios from 'axios';

const CotizacionService = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = 'http://localhost:8000/cotizaciones';

    const obtenerCotizaciones = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(baseURL, { params });
            return response.data.data;
        } catch (err) {
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
            const response = await axios.get(`${baseURL}/${id}`);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const crearCotizacion = async (cotizacionData) => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${baseURL}/cotizaciones`, cotizacionData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
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
            const response = await axios.put(`${baseURL}/${id}`, cotizacionData);
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
            const response = await axios.delete(`${baseURL}/${id}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const activarServicio = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${baseURL}/${id}/activar`, {});
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
            const response = await axios.post(`${baseURL}/${id}/pagos`, pagoData);
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