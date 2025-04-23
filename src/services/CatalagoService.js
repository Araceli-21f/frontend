import { useState, useCallback } from 'react';
import axios from 'axios';

const CatalogoService = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = 'http://localhost:8000/catalogos';

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
    }, []);

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

    const exportarExcel = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseURL}/exportar-excel`, {
                responseType: 'blob' // Esto es crucial para manejar archivos binarios
            });
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
        exportarExcel
    };
};

export default CatalogoService;