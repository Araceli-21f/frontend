import React from "react";
import Layout from "../layouts/pages/layout";

const Calendario = () => {
  return (
    <Layout>
      {/* Inicio del Dashboard de Calendario */}
      <div className="row">
        <div className="col-12">
          <div className="row">
            {/* Columna Lateral (3 columnas) */}
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  {/* Botón para crear un nuevo evento */}
                  <div className="d-grid">
                    <button className="btn font-16 btn-primary" id="btn-new-event">
                      <i className="mdi mdi-plus-circle-outline"></i> Crear Nuevo Evento
                    </button>
                  </div>

                  {/* Imagen de "Próximamente" */}
                  <div className="row justify-content-center mt-5">
                    <img src="assets/images/coming-soon-img.png" alt="" className="img-fluid d-block" />
                  </div>

                  {/* Eventos externos (arrastrables) */}
                  <div id="external-events" className="mt-2">
                    <br />
                    <p className="text-muted">Arrastra y suelta tu evento o haz clic en el calendario</p>
                    <div className="external-event fc-event bg-success" data-class="bg-success">
                      <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Nueva Planificación de Evento
                    </div>
                    <div className="external-event fc-event bg-info" data-class="bg-info">
                      <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Reunión
                    </div>
                    <div className="external-event fc-event bg-warning" data-class="bg-warning">
                      <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Generando Reportes
                    </div>
                    <div className="external-event fc-event bg-danger" data-class="bg-danger">
                      <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Crear Nuevo Tema
                    </div>
                  </div>

                  {/* Feed de actividad */}
                  <ol className="activity-feed mb-0 ps-2 mt-4 ms-1">
                    <li className="feed-item">
                      <p className="mb-0">Andrei Coman magna sed porta finibus, risus publicó un nuevo artículo: Forget UX Rowland</p>
                    </li>
                    <li className="feed-item">
                      <p className="mb-0">Zack Wetass, sed porta finibus, risus Chris Wallace Comentó Developer Moreno</p>
                    </li>
                    <li className="feed-item">
                      <p className="mb-0">Zack Wetass, Chris combined Comentó UX Murphy</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Columna del Calendario Principal (9 columnas) */}
            <div className="col-lg-9">
              <div className="card">
                <div className="card-body">
                  <div id="calendar"></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ clear: "both" }}></div>

          {/* Modal para Agregar/Editar Evento */}
          <div className="modal fade" id="event-modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-3 px-4 border-bottom-0">
                  <h5 className="modal-title" id="modal-title">Evento</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div className="modal-body p-4">
                  <form className="needs-validation" name="event-form" id="form-event" noValidate>
                    <input type="hidden" id="eventid" />
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label">Nombre del Evento</label>
                          <input className="form-control" placeholder="Insertar Nombre del Evento" type="text" name="title" id="event-title" required value="" />
                          <div className="invalid-feedback">Por favor, proporciona un nombre de evento válido</div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label">Categoría</label>
                          <select className="form-control form-select" name="category" id="event-category">
                            <option defaultValue="">--Seleccionar--</option>
                            <option value="bg-danger">Peligro</option>
                            <option value="bg-success">Éxito</option>
                            <option value="bg-primary">Primario</option>
                            <option value="bg-info">Información</option>
                            <option value="bg-dark">Oscuro</option>
                            <option value="bg-warning">Advertencia</option>
                          </select>
                          <div className="invalid-feedback">Por favor, selecciona una categoría de evento válida</div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-6">
                        <button type="button" className="btn btn-danger" id="btn-delete-event">Eliminar</button>
                      </div>
                      <div className="col-6 text-end">
                        <button type="button" className="btn btn-light me-1" data-bs-dismiss="modal">Cerrar</button>
                        <button type="submit" className="btn btn-success" id="edit-event-btn">Editar</button>
                        <button type="submit" className="btn btn-success" id="btn-save-event">Guardar</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inclusión de JavaScript específico para el Footer */}
      <script src="../assets/libs/jquery-ui-dist/jquery-ui.min.js"></script>
      <script src="../assets/libs/fullcalendar/index.global.min.js"></script>
      <script src="../assets/js/pages/calendar.init.js"></script>
    </Layout>
  );
};

export default Calendario;