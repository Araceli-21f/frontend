import { useState, useCallback } from 'react';
import axios from 'axios';

const CatalogoService = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = 'http://localhost:8000/catalogos';

    const obtenerCatalogo = useCallback(async (categoria, estatus) => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (categoria) params.categoria = categoria;
            if (estatus) params.estatus = estatus;
            
            const response = await axios.get(`${baseURL}`, { params });
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    }, []);

    const crearProducto = async (producto) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${baseURL}`, producto);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const buscarPorCodigo = async (codigo) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseURL}/codigo/${codigo}`);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const obtenerPorCategoria = async (categoria) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseURL}/categoria/${categoria}`);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const cargarCatalogo = async (file) => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file); 
            
            const response = await axios.post(`${baseURL}/cargar-excel`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const actualizarProducto = async (codigo, producto) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${baseURL}/${codigo}`, producto);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const eliminarProducto = async (codigo) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`${baseURL}/${codigo}`);
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
        obtenerCatalogo,
        crearProducto,
        buscarPorCodigo,
        obtenerPorCategoria,
        cargarCatalogo,
        actualizarProducto,
        eliminarProducto
    };
};

export default CatalogoService;