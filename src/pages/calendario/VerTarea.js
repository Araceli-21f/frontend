import React from "react";

const VerTarea = ({ 
  newEvent, 
  clientes, 
  loading, 
  changeToEditMode, 
  closeModal,
  getColorForArea,
  getIconForArea
}) => {
  // Buscar el cliente
  const cliente = clientes.find(c => c._id === newEvent.cliente_id);
  const clienteNombre = cliente ? cliente.nombre : "Sin cliente";
  
  // Función para formatear el nombre del área para mostrar
  const formatAreaName = (area) => {
    if (!area) return "Sin área";
    
    const areaLower = String(area).toLowerCase();
    
    switch(areaLower) {
      case 'datax': return 'DataX';
      case 'studiodesign': return 'StudioDesign';
      case 'generalsystech': return 'GeneralSystech';
      case 'smartsite': return 'SmartSite';
      default: return area;
    }
  };

  // Formatear la fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return dateString;
    }
  };

  return (
    <div>
      <div className="mb-3">
        <h6 className="text-muted">Cliente:</h6>
        <p>{clienteNombre}</p>
      </div>
      
      <div className="mb-3">
        <h6 className="text-muted">Descripción:</h6>
        <p>{newEvent.descripcion || "Sin descripción"}</p>
      </div>
      
      <div className="mb-3">
        <h6 className="text-muted">Fecha de vencimiento:</h6>
        <p>{formatDate(newEvent.fecha_vencimiento)}</p>
      </div>
      
      <div className="mb-3">
        <h6 className="text-muted">Área:</h6>
        <div 
          className="p-2 text-dark" // Cambiado a text-dark para mejor contraste
          style={{ 
            backgroundColor: getColorForArea(newEvent.area),
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          <i className={`mdi ${getIconForArea(newEvent.area)} me-2`}></i>
          {formatAreaName(newEvent.area)}
        </div>
      </div>
      
      <div className="mb-3">
        <h6 className="text-muted">Responsable:</h6>
        <p>{newEvent.responsable || "Sin responsable"}</p>
      </div>
      
      <div className="row mt-4">
        <div className="col-6">
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={changeToEditMode}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Editar"}
          </button>
        </div>
        
        <div className="col-6">
          <button
            type="button"
            className="btn btn-light w-100"
            onClick={closeModal}
            disabled={loading}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerTarea;