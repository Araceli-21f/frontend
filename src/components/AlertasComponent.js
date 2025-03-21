import React from "react";

const AlertComponent = ({ type, entity, action, onConfirm, onCancel, message }) => {
  const icons = {
    view: "uil uil-eye text-primary",
    delete: "uil uil-trash text-danger",
    create: "uil uil-plus-circle text-success",
    save: "uil uil-save text-warning",
    error: "uil uil-exclamation-octagon text-danger",
    confirmDelete: "uil uil-question-circle text-info",
  };

  const messages = {
    view: `Visualizando ${entity}`,
    delete: `${entity} eliminado correctamente`,
    create: `${entity} creado exitosamente`,
    save: `${entity} guardado con éxito`,
    error: `Error al procesar ${entity}`,
    confirmDelete: `¿Estás seguro de que deseas eliminar este ${entity}?`,
  };

  const modalClasses = {
    success: "text-success",
    danger: "text-danger",
    warning: "text-warning",
    info: "text-info",
  };

  return (
    <div
      className="modal fade bs-example-modal-center show"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="mySmallModalLabel"
      aria-hidden="true"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="alertModalLabel">
              {action.charAt(0).toUpperCase() + action.slice(1)} {entity}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body text-center">
            <i className={`${icons[action]} display-4 mt-2 mb-3`}></i>
            <h5 className={modalClasses[type]}>
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </h5>
            <p>{message || messages[action]}</p>

            {action === "confirmDelete" && (
              <div className="d-flex justify-content-center">
                <button className="btn btn-danger me-2" onClick={onConfirm}>
                  Confirmar
                </button>
                <button className="btn btn-secondary" onClick={onCancel}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertComponent;