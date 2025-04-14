import React from 'react';

const CrearTarea = ({ 
  newEvent, 
  clientes = [], 
  filiales = [], 
  loading, 
  handleInputChange, 
  handleSubmit, 
  closeModal 
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {/* Campo descripción */}
      <div className="mb-3">
        <label className="form-label">Descripción*</label>
        <input
          type="text"
          className="form-control"
          value={newEvent.descripcion || ''}
          onChange={(e) => handleInputChange('descripcion', e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {/* Campo cliente */}
      <div className="mb-3">
        <label className="form-label">Cliente</label>
        <select
          className="form-select"
          value={newEvent.cliente_id || ''}
          onChange={(e) => handleInputChange('cliente_id', e.target.value)}
          disabled={loading}
        >
          <option value="">Seleccione un cliente</option>
          {clientes.map(cliente => (
            <option key={cliente._id} value={cliente._id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Campo filial */}
      <div className="mb-3">
        <label className="form-label">Filial*</label>
        <select
          className="form-select"
          value={newEvent.filial_id || ''}
          onChange={(e) => handleInputChange('filial_id', e.target.value)}
          required
          disabled={loading}
        >
          <option value="">Seleccione una filial</option>
          {filiales.map(filial => (
            <option key={filial._id} value={filial._id}>
              {filial.nombre_filial}
            </option>
          ))}
        </select>
      </div>

      {/* Campo fecha vencimiento */}
      <div className="mb-3">
        <label className="form-label">Fecha de vencimiento*</label>
        <input
          type="date"
          className="form-control"
          value={newEvent.fecha_vencimiento || ''}
          onChange={(e) => handleInputChange('fecha_vencimiento', e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {/* Campo responsable */}
      <div className="mb-3">
        <label className="form-label">Responsable*</label>
        <input
          type="text"
          className="form-control"
          value={newEvent.responsable || ''}
          onChange={(e) => handleInputChange('responsable', e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {/* Campo estado */}
      <div className="mb-3">
        <label className="form-label">Estado</label>
        <select
          className="form-select"
          value={newEvent.estado || 'pendiente'}
          onChange={(e) => handleInputChange('estado', e.target.value)}
          disabled={loading}
        >
          <option value="pendiente">Pendiente</option>
          <option value="en progreso">En progreso</option>
          <option value="completada">Completada</option>
        </select>
      </div>

      {/* Botones */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button 
          type="button" 
          className="btn btn-light" 
          onClick={closeModal}
          disabled={loading}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default CrearTarea;