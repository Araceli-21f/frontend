// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; // Cambia la URL base para utilizar las rutas de autenticación
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

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data; // Lanza el error del backend
  }
};

const authService = {
  register,
  login,
};

export default authService;