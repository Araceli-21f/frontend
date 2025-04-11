import React from "react";

const EditarTarea = ({ 
  newEvent, 
  clientes, 
  loading, 
  handleInputChange, 
  handleSubmit, 
  handleDelete,
  closeModal,
  getColorForArea,
  getIconForArea
}) => {
  // Visualización previa del color según el área seleccionada
  const currentColor = getColorForArea(newEvent.area);
  
  return (
    <form className="needs-validation" onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="col-12">
          <div className="mb-3">
            <label className="form-label">Cliente</label>
            <select 
              className="form-select"
              value={newEvent.cliente_id}
              onChange={(e) => handleInputChange('cliente_id', e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente._id} value={cliente._id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">Por favor selecciona un cliente</div>
          </div>
        </div>

        <div className="col-12">
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              value={newEvent.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              required
              disabled={loading}
            />
            <div className="invalid-feedback">Por favor ingresa una descripción</div>
          </div>
        </div>

        <div className="col-12">
          <div className="mb-3">
            <label className="form-label">Fecha de vencimiento</label>
            <input
              type="datetime-local"
              className="form-control"
              value={newEvent.fecha_vencimiento}
              onChange={(e) => handleInputChange('fecha_vencimiento', e.target.value)}
              required
              disabled={loading}
            />
            <div className="invalid-feedback">Por favor selecciona una fecha</div>
          </div>
        </div>

        <div className="col-12">
          <div className="mb-3">
            <label className="form-label">Área</label>
            <div className="mb-2">
              <div className="color-preview" style={{
                height: '20px',
                width: '100%',
                backgroundColor: currentColor,
                borderRadius: '4px',
                marginBottom: '10px'
              }}></div>
            </div>
            <select 
              className="form-select"
              value={newEvent.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              required
              disabled={loading}
            >
              <option value="datax" style={{backgroundColor: getColorForArea('datax')}}>
                DataX
              </option>
              <option value="studiodesign" style={{backgroundColor: getColorForArea('studiodesign')}}>
                StudioDesign
              </option>
              <option value="generalsystech" style={{backgroundColor: getColorForArea('generalsystech')}}>
                GeneralSystech
              </option>
              <option value="smartsite" style={{backgroundColor: getColorForArea('smartsite')}}>
                SmartSite
              </option>
            </select>
            <div className="invalid-feedback">Por favor selecciona un área</div>
          </div>
        </div>

        <div className="col-12">
          <div className="mb-3">
            <label className="form-label">Responsable</label>
            <input
              type="text"
              className="form-control"
              value={newEvent.responsable}
              onChange={(e) => handleInputChange('responsable', e.target.value)}
              required
              disabled={loading}
            />
            <div className="invalid-feedback">Por favor ingresa un responsable</div>
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col">
          <div className="d-grid gap-2">
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Eliminando...
                </>
              ) : "Eliminar"}
            </button>
          </div>
        </div>
        <div className="col">
          <div className="d-grid gap-2">
            <button 
              type="button" 
              className="btn btn-light" 
              onClick={closeModal}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
        <div className="col">
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-success" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditarTarea;