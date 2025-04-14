import React from "react";

const VerTarea = ({ 
  newEvent, 
  clientes, 
  filiales,
  loading, 
  changeToEditMode, 
  closeModal,
  getColorForFilial,
  getIconForFilial
}) => {
  // Buscar el cliente
  const cliente = clientes.find(c => c._id === newEvent.cliente_id);
  const clienteNombre = cliente ? cliente.nombre : "Sin cliente";
  
  // Buscar la filial
  const filial = filiales.find(f => f._id === newEvent.filial_id);
  const filialNombre = filial ? filial.nombre_filial : "Sin filial";
  
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
        <h6 className="text-muted">Filial:</h6>
        <div 
          className="p-2 text-dark"
          style={{ 
            backgroundColor: filial ? getColorForFilial(filial.nombre_filial) : '#6c757d',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          <i className={`mdi ${filial ? getIconForFilial(filial.nombre_filial) : 'mdi-help-circle'} me-2`}></i>
          {filialNombre}
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