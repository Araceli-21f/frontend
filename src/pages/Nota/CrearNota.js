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
                Error: {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="col-md-12">
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

              <div className="col-md-12">
                <div className="mb-3 form-check">
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

              <div className="text-center">
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