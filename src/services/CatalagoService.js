import { useState, useCallback } from 'react';
import axios from 'axios';

const CatalogoService = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = 'http://localhost:8000/Catalogos';

    const obtenerCatalogos = useCallback(async () => {
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

    const crearCatalogo = async (catalogo) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${baseURL}`, catalogo);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const obtenerCatalogoPorId = async (id) => {
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

    const actualizarCatalogo = async (id, catalogo) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${baseURL}/${id}`, catalogo);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const eliminarCatalogo = async (id) => {
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
        obtenerCatalogos,
        crearCatalogo,
        obtenerCatalogoPorId,
        actualizarCatalogo,
        eliminarCatalogo,
    };
};

export default CatalogoService;
