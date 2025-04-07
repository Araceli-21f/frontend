import React, { useState ,useEffect} from 'react';
import NotaService from '../../services/NotaService';
import Layout from "../../layouts/pages/layout";
import { useNavigate } from "react-router-dom";


const CrearNota = () => {
  const navigate = useNavigate();
  const { crearNota, loading, error } = NotaService();
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    cliente_id: '', // Puedes obtener esto del contexto de autenticación si es necesario
    importante: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearNota(formData);
      navigate('/notas'); // Redirigir al listado después de crear
    } catch (err) {
      console.error("Error al crear nota:", err);
    }
  };

  return (
<Layout>
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Nueva Nota</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="titulo">
            Título
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="contenido">
            Contenido
          </label>
          <textarea
            id="contenido"
            name="contenido"
            value={formData.contenido}
            onChange={handleChange}
            rows="5"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            id="importante"
            name="importante"
            type="checkbox"
            checked={formData.importante}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="importante" className="ml-2 block text-gray-700">
            Marcar como importante
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/notas')}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Nota'}
          </button>
        </div>
      </form>
    </div>
    </Layout>
  );
};

export default CrearNota;