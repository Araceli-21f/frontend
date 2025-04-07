import { useState, useCallback } from 'react';
import axios from 'axios';

const CotizacionService = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = 'http://localhost:8000/cotizaciones';

    const obtenerCotizaciones = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseURL}`);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    }, []); // <- Se ejecuta solo una vez y mantiene la referencia

    const crearCotizacion = async (cotizacion) => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.post(`${baseURL}`, cotizacion);
          setLoading(false);
          return response.data;
        } catch (err) {
          console.error('Error completo:', err.response?.data || err.message);
          setError(err.response?.data || err.message);
          setLoading(false);
          throw err.response?.data || err;
        }
      };

    const obtenerCotizacionPorId = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseURL}/${id}`);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const actualizarCotizacion = async (id, cotizacion) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${baseURL}/${id}`, cotizacion);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const eliminarCotizacion = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`${baseURL}/${id}`);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    return {
        loading,
        error,
        obtenerCotizaciones,
        crearCotizacion,
        obtenerCotizacionPorId,
        actualizarCotizacion,
        eliminarCotizacion,
    };
};

export default CotizacionService;
