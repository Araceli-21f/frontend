 // src/context/AuthContext.js
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import authService from '../services/authService';
import useUserService from '../services/UserService';

const AuthContext = createContext();


export function AuthProvider({ children }) {
    const userService = useUserService();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || sessionStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar autenticación al cargar la app
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }
                // Verify token validity
                await authService.verifyToken();
                // Fetch full user profile
                const profile = await userService.obtenerPerfil(token);
                setUser(profile);
                // Removed setToken(token) to prevent infinite loop
            } catch (err) {
                authService.logout();
                setUser(null);
            }
        };
        checkAuth();
    }, [token, userService]);

    const login = async (email, password, rememberMe = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await authService.login(email, password);
            if (data.token) {
                if (rememberMe) {
                    localStorage.setItem('token', data.token);
                    sessionStorage.removeItem('token');
                } else {
                    sessionStorage.setItem('token', data.token);
                    localStorage.removeItem('token');
                }
                setToken(data.token);
                // Fetch full user profile
                const profile = await userService.obtenerPerfil(data.token);
                setUser(profile);
            }
            return data;
        } catch (err) {
            setError(err.error || "Error en el login");
            throw err;
        } finally {
            setLoading(false);
        }
    };


    const register = async (name, apellidos, email, password, area) => {
        try {
            setLoading(true);
            setError(null);
            const data = await authService.register(name, apellidos, email, password, area);
            if (data.token) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                if (data.usuario) {
                    setUser(data.usuario);
                } else {
                    // Fetch full user profile
                    const profile = await userService.obtenerPerfil(data.token);
                    setUser(profile);
                }
                authService.setAuthToken(data.token);
            }
            return data;
        } catch (err) {
            setError(err.error || "Error en el registro");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}
