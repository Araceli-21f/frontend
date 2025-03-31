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

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { // Faltaba la /
      email,
      password,
    });
    
    if (response.data.token) {
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      
      // Opcional: Guardar datos del usuario
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Configurar axios para enviar el token en futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    // Mejor manejo de errores
    if (error.response) {
      // Error del servidor (4xx, 5xx)
      throw new Error(error.response.data.error || 'Credenciales inválidas');
    } else if (error.request) {
      // No se recibió respuesta
      throw new Error('No se pudo conectar al servidor');
    } else {
      // Error al configurar la petición
      throw new Error('Error en la configuración de la petición');
    }
  }
};

const authService = {
  register,
  login,
};

export default authService;