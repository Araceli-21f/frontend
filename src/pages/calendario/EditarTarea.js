import React from "react";

const EditarTarea = ({ 
  newEvent = {}, 
  clientes = [], 
  filiales = [],
  loading = false, 
  handleInputChange = () => {}, 
  handleSubmit = () => {}, 
  handleDelete = () => {},
  closeModal = () => {},
  getColorForFilial = () => '#6c757d',
  getIconForFilial = () => 'mdi-help-circle'
}) => {
  // Manejo seguro de valores
  const safeEvent = {
    cliente_id: newEvent.cliente_id || '',
    descripcion: newEvent.descripcion || '',
    fecha_vencimiento: newEvent.fecha_vencimiento || '',
    filial_id: newEvent.filial_id || '',
    responsable: newEvent.responsable || '',
    estado: newEvent.estado || 'pendiente'
  };

  // Obtener la filial seleccionada de manera segura
  const selectedFilial = filiales.find(f => f._id === safeEvent.filial_id);
  const currentColor = selectedFilial ? 
    getColorForFilial(selectedFilial.nombre_filial) : 
    '#6c757d';

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Campo Cliente */}
        <div className="col-12 mb-3">
          <label className="form-label">Cliente</label>
          <select 
            className="form-select"
            value={safeEvent.cliente_id}
            onChange={(e) => handleInputChange('cliente_id', e.target.value)}
            disabled={loading}
          >
            <option value="">Seleccionar cliente...</option>
            {Array.isArray(clientes) && clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre || 'Sin nombre'}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Descripción */}
        <div className="col-12 mb-3">
          <label className="form-label">Descripción*</label>
          <input
            type="text"
            className="form-control"
            value={safeEvent.descripcion}
            onChange={(e) => handleInputChange('descripcion', e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Campo Fecha */}
        <div className="col-12 mb-3">
          <label className="form-label">Fecha de vencimiento*</label>
          <input
            type="datetime-local"
            className="form-control"
            value={safeEvent.fecha_vencimiento}
            onChange={(e) => handleInputChange('fecha_vencimiento', e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Campo Filial */}
        <div className="col-12 mb-3">
          <label className="form-label">Filial*</label>
          <div className="mb-2 d-flex align-items-center">
            <div 
              className="color-preview me-2"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: currentColor,
                borderRadius: '4px'
              }}
            ></div>
            <small>{selectedFilial?.nombre_filial || 'No seleccionada'}</small>
          </div>
          <select 
            className="form-select"
            value={safeEvent.filial_id}
            onChange={(e) => handleInputChange('filial_id', e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Seleccionar filial...</option>
            {Array.isArray(filiales) && filiales.map((filial) => (
              <option key={filial._id} value={filial._id}>
                {filial.nombre_filial || 'Sin nombre'}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Responsable */}
        <div className="col-12 mb-3">
          <label className="form-label">Responsable*</label>
          <input
            type="text"
            className="form-control"
            value={safeEvent.responsable}
            onChange={(e) => handleInputChange('responsable', e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Campo Estado */}
        <div className="col-12 mb-4">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            value={safeEvent.estado}
            onChange={(e) => handleInputChange('estado', e.target.value)}
            disabled={loading}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="d-flex justify-content-between mt-4">
        <button 
          type="button" 
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Eliminando...
            </>
          ) : "Eliminar"}
        </button>

        <div>
          <button 
            type="button" 
            className="btn btn-secondary me-2"
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
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Guardando...
              </>
            ) : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditarTarea;