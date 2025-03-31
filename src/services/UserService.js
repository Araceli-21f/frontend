import { useState, useCallback } from 'react';
import axios from 'axios';

const UserService = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = 'http://localhost:8000/users';

    const obtenerUsuarios = useCallback(async () => {
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

    const crearUsuario = async (usuario) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${baseURL}`, usuario);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const obtenerUsuarioPorId = async (id) => {
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

    const actualizarUsuario = async (id, usuario) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${baseURL}/${id}`, usuario);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    const eliminarUsuario = async (id) => {
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
        obtenerUsuarios,
        crearUsuario,
        obtenerUsuarioPorId,
        actualizarUsuario,
        eliminarUsuario,
    };
};

export default UserService;
