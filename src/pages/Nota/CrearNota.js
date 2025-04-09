import React, { useState, useEffect } from 'react';
import NotaService from '../../services/NotaService';
import Layout from "../../layouts/pages/layout";
import { useNavigate } from "react-router-dom";

const CrearNota = () => {
  const navigate = useNavigate();
  const { crearNota, loading, error } = NotaService();
  
  // Obtener los datos del usuario autenticado
  const [userData, setUserData] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    cliente_id: userData?.cliente_id || '',
    cliente_nombre: userData?.cliente_nombre || '',
    importante: false,
    etiquetas: '',
    autor: userData?.nombre || ''
  });

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        cliente_id: userData.cliente_id,
        cliente_nombre: userData.cliente_nombre,
        autor: userData.nombre
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cliente_id) {
      alert('Error: No se ha identificado el cliente asociado');
      return;
    }

    try {
      const notaData = {
        ...formData,
        etiquetas: formData.etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      await crearNota(notaData);
      navigate('/notas');
    } catch (err) {
      console.error("Error al crear nota:", err);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col">
          <div className="card p-4">
            <div className="invoice-title d-flex justify-content-between align-items-center">
              <h3 className="font-size-h4">Crear Nueva Nota</h3>
              <div className="mb-4">
                <img src="/assets/images/logo-dark.png" alt="logo" height="20" className="logo-dark" />
                <img src="/assets/images/logo-light.png" alt="logo" height="20" className="logo-light" />
              </div>
            </div>
            <hr className="my-3"/>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error.message.includes('cliente_id') 
                  ? 'Error: Debes estar asociado a un cliente válido' 
                  : error.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Mostrar información del cliente */}
              {formData.cliente_nombre && (
                <div className="mb-3 p-3 bg-light rounded">
                  <p className="mb-1"><strong>Cliente:</strong> {formData.cliente_nombre}</p>
                </div>
              )}

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label"><i className="uil-text-fields"/> Título:</label>
                    <input 
                      type="text" 
                      name="titulo" 
                      value={formData.titulo} 
                      onChange={handleChange} 
                      required 
                      className="form-control shadow-sm" 
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label"><i className="uil-user"/> Autor:</label>
                    <input 
                      type="text" 
                      name="autor" 
                      value={formData.autor} 
                      className="form-control shadow-sm bg-light" 
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="mb-2">
                  <label className="form-label"><i className="uil-notes"/> Contenido:</label>
                  <textarea 
                    name="contenido" 
                    value={formData.contenido} 
                    onChange={handleChange} 
                    rows="5" 
                    required 
                    className="form-control shadow-sm"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label"><i className="uil-tag"/> Etiquetas (separadas por comas):</label>
                    <input 
                      type="text" 
                      name="etiquetas" 
                      value={formData.etiquetas} 
                      onChange={handleChange} 
                      className="form-control shadow-sm" 
                      placeholder="ejemplo: trabajo, importante, seguimiento"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3 form-check pt-4">
                    <input 
                      type="checkbox" 
                      name="importante" 
                      checked={formData.importante} 
                      onChange={handleChange} 
                      className="form-check-input" 
                      id="importanteCheck"
                    />
                    <label className="form-check-label" htmlFor="importanteCheck">
                      Marcar como importante
                    </label>
                  </div>
                </div>
              </div>

              {/* Campos ocultos */}
              <input type="hidden" name="cliente_id" value={formData.cliente_id || ''} />
              <input type="hidden" name="cliente_nombre" value={formData.cliente_nombre || ''} />

              <div className="text-center mt-3">
                <button 
                  type="button" 
                  onClick={() => navigate('/notas')} 
                  className="btn w-lg btn-outline-secondary mr-2" 
                  disabled={loading}
                >
                  <i className="uil-times"/> Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn w-lg btn-outline-primary" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="uil uil-spinner spinner"/> Creando...
                    </>
                  ) : (
                    <>
                      <i className="uil-note"/> Crear Nota
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CrearNota;