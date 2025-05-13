// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/auth'; // Cambia la URL base para utilizar las rutas de autenticación
// services/authService.js
const register = async (name, apellidos, email, password, area) => { // Agrega 'area' como parámetro
    try {
        const response = await axios.post(`${API_URL}/registro`, {
            name,
            apellidos,
            email,
            password,
            area, 
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};


// En tu authService.js (función login)
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    if (response.data.token) {
      // Guarda el token en localStorage y sessionStorage como respaldo
      localStorage.setItem('token', response.data.token);
      sessionStorage.setItem('token', response.data.token);
      
      // Guarda datos básicos del usuario
      if (response.data.user) {
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      setAuthToken(response.data.token);
      return response.data;
    }
    throw new Error('No se recibió token en la respuesta');
  } catch (error) {
    // Limpia cualquier token previo en caso de error
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error.response?.data || { error: "Error en el login" };
  }
};

const verifyToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await axios.get(`${API_URL}/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    logout();
    throw error.response?.data || { error: "Error verificando token" };
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};



const authService = {
  register,
  login,
  verifyToken,
  logout,
  setAuthToken
};

export default authService;