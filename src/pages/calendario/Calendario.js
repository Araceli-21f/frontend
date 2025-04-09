/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { Link } from "react-router-dom";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Layout from "../../layouts/pages/layout";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import TareaService from "../../services/TareaService";
import ClienteService from "../../services/ClienteService";

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [newEvent, setNewEvent] = useState({ 
    id: null,
    cliente_id: "",
    descripcion: "",
    fecha_vencimiento: "",
    estado: "pendiente",
    responsable: "",
    className: "bg-primary"
  });
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [viewMode, setViewMode] = useState("edit");
  
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const calendarRef = useRef(null);

  const tareaService = TareaService();
  const clienteService = ClienteService();

  // Cargar tareas y clientes al iniciar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tareas = await tareaService.obtenerTareas();
        const clientesData = await clienteService.obtenerClientes();
        
        setClientes(clientesData);
        
        // Mapear tareas a eventos del calendario
        const eventos = tareas.map(tarea => ({
          id: tarea._id,
          title: tarea.descripcion,
          start: tarea.fecha_vencimiento,
          className: getClassNameByEstado(tarea.estado),
          extendedProps: {
            cliente_id: tarea.cliente_id,
            estado: tarea.estado,
            responsable: tarea.responsable
          }
        }));
        
        setEvents(eventos);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Función para obtener clase CSS según estado
  const getClassNameByEstado = (estado) => {
    switch(estado) {
      case 'pendiente': return 'bg-warning';
      case 'en progreso': return 'bg-info';
      case 'completada': return 'bg-success';
      default: return 'bg-primary';
    }
  };

  // Función para cerrar el modal
  const closeModal = () => {
    if (modalRef.current) {
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      if (modal) modal.hide();
    }
    setShowModal(false);
    setViewMode("edit");
  };

  // Manejo de eventos del calendario
  const handleDateClick = (info) => {
    setNewEvent({ 
      id: null,
      cliente_id: "",
      descripcion: "",
      fecha_vencimiento: info.dateStr,
      estado: "pendiente",
      responsable: "",
      className: getClassNameByEstado("pendiente")
    });
    setModalMode("create");
    setViewMode("edit");
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const eventData = {
      id: info.event.id,
      cliente_id: info.event.extendedProps.cliente_id?._id || info.event.extendedProps.cliente_id,
      descripcion: info.event.title,
      fecha_vencimiento: info.event.startStr,
      estado: info.event.extendedProps.estado,
      responsable: info.event.extendedProps.responsable,
      className: info.event.classNames[0] || getClassNameByEstado(info.event.extendedProps.estado)
    };
    
    setNewEvent(eventData);
    setModalMode("edit");
    setViewMode("view");
    setShowModal(true);
  };

  // Manejo del formulario
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    if (!newEvent.descripcion.trim() || !newEvent.cliente_id || !newEvent.responsable) {
      return;
    }

    try {
      setLoading(true);
      
      const tareaData = {
        cliente_id: newEvent.cliente_id,
        descripcion: newEvent.descripcion,
        fecha_vencimiento: newEvent.fecha_vencimiento,
        estado: newEvent.estado,
        responsable: newEvent.responsable
      };

      let response;
      
      if (modalMode === "edit" && newEvent.id) {
        response = await tareaService.actualizarTarea(newEvent.id, tareaData);
      } else {
        response = await tareaService.crearTarea(tareaData);
      }

      // Actualizar el calendario
      const updatedEvents = modalMode === "edit" 
        ? events.map(event => 
            event.id === newEvent.id 
              ? { 
                  ...event, 
                  title: response.descripcion,
                  start: response.fecha_vencimiento,
                  className: getClassNameByEstado(response.estado),
                  extendedProps: {
                    cliente_id: response.cliente_id,
                    estado: response.estado,
                    responsable: response.responsable
                  }
                } 
              : event
          )
        : [
            ...events, 
            {
              id: response._id,
              title: response.descripcion,
              start: response.fecha_vencimiento,
              className: getClassNameByEstado(response.estado),
              extendedProps: {
                cliente_id: response.cliente_id,
                estado: response.estado,
                responsable: response.responsable
              }
            }
          ];

      setEvents(updatedEvents);
      closeModal();
    } catch (error) {
      console.error("Error al guardar tarea:", error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminación de tarea
  const handleDeleteEvent = async () => {
    if (!newEvent.id) return;

    try {
      setLoading(true);
      await tareaService.eliminarTarea(newEvent.id);
      setEvents(events.filter(event => event.id !== newEvent.id));
      closeModal();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    } finally {
      setLoading(false);
    }
  };

  // Inicialización del modal
  useEffect(() => {
    if (modalRef.current && showModal) {
      const modal = new bootstrap.Modal(modalRef.current, { keyboard: false });
      modal.show();
      
      const handleHidden = () => {
        setShowModal(false);
        setViewMode("edit");
      };
      
      modalRef.current.addEventListener('hidden.bs.modal', handleHidden);
      
      return () => {
        if (modalRef.current) {
          modalRef.current.removeEventListener('hidden.bs.modal', handleHidden);
        }
      };
    }
  }, [showModal]);

  return (
    <Layout>
      <div className="container-fluid mt-4 min-vh-100 d-flex flex-column">
        <div className="row flex-grow-1">
          <div className="col-lg-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <button 
                  className="btn btn-primary w-100 mb-3" 
                  onClick={() => {
                    setNewEvent({ 
                      id: null,
                      cliente_id: "",
                      descripcion: "",
                      fecha_vencimiento: "",
                      estado: "pendiente",
                      responsable: "",
                      className: getClassNameByEstado("pendiente")
                    });
                    setModalMode("create");
                    setViewMode("edit");
                    setShowModal(true);
                  }}
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Crear Nueva Tarea"}
                </button>
                
                <div className="row justify-content-center mt-3">
                  <Link to="/" className="mb-3 d-block auth-logo">
                    <img
                      src="/assets/images/coming-soon-img.png"
                      alt="Coming Soon"
                      className="img-fluid d-block"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </Link>
                </div>
                
                <div id="external-events" className="mt-2">
                  <p className="text-muted">Leyenda de estados:</p>
                  <div className="external-event bg-warning">
                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>Pendiente
                  </div>
                  <div className="external-event bg-info">
                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>En progreso
                  </div>
                  <div className="external-event bg-success">
                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>Completada
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9 d-flex flex-column h-100">
            <div className="card flex-grow-1">
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    height="calc(100vh - 100px)"
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                    }}
                    editable={true}
                    droppable={true}
                    selectable={true}
                    eventDrop={async (info) => {
                      try {
                        const tareaData = {
                          cliente_id: info.event.extendedProps.cliente_id,
                          descripcion: info.event.title,
                          fecha_vencimiento: info.event.start,
                          estado: info.event.extendedProps.estado,
                          responsable: info.event.extendedProps.responsable
                        };
                        
                        await tareaService.actualizarTarea(info.event.id, tareaData);
                        
                        setEvents(events.map(event => 
                          event.id === info.event.id 
                            ? { ...event, start: info.event.start } 
                            : event
                        ));
                      } catch (error) {
                        console.error("Error al actualizar fecha:", error);
                        info.revert();
                      }
                    }}
                    eventContent={(eventInfo) => {
                      const cliente = clientes.find(c => c._id === eventInfo.event.extendedProps.cliente_id);
                      const clienteNombre = cliente ? cliente.nombre : "Sin cliente";
                      
                      return (
                        <div>
                          <div><strong>{eventInfo.event.title}</strong></div>
                          <div><small>{clienteNombre}</small></div>
                          <div><small>Responsable: {eventInfo.event.extendedProps.responsable}</small></div>
                        </div>
                      );
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar tareas */}
      <div 
        ref={modalRef} 
        className="modal fade" 
        id="event-modal" 
        tabIndex="-1" 
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header py-3 px-4 border-bottom-0">
              <h5 className="modal-title">
                {modalMode === "create" ? "Crear Tarea" : viewMode === "view" ? "Detalles de Tarea" : "Editar Tarea"}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={closeModal}
                disabled={loading}
              ></button>
            </div>
            
            <div className="modal-body p-4">
              <form onSubmit={handleEventSubmit} ref={formRef} noValidate>
                <div className="mb-3">
                  <label className="form-label">Cliente</label>
                  {viewMode === "view" ? (
                    <input 
                      className="form-control" 
                      value={clientes.find(c => c._id === newEvent.cliente_id)?.nombre || "No especificado"} 
                      readOnly 
                    />
                  ) : (
                    <select
                      className="form-select"
                      value={newEvent.cliente_id}
                      onChange={(e) => setNewEvent({...newEvent, cliente_id: e.target.value})}
                      required
                      disabled={loading || viewMode === "view"}
                    >
                      <option value="">Seleccionar cliente</option>
                      {clientes.map(cliente => (
                        <option key={cliente._id} value={cliente._id}>
                          {cliente.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <input
                    className="form-control"
                    placeholder="Descripción de la tarea"
                    value={newEvent.descripcion}
                    onChange={(e) => setNewEvent({...newEvent, descripcion: e.target.value})}
                    required
                    readOnly={viewMode === "view"}
                    disabled={loading}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Fecha de vencimiento</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={newEvent.fecha_vencimiento}
                    onChange={(e) => setNewEvent({...newEvent, fecha_vencimiento: e.target.value})}
                    required
                    readOnly={viewMode === "view"}
                    disabled={loading}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  {viewMode === "view" ? (
                    <input 
                      className="form-control" 
                      value={newEvent.estado.toUpperCase()} 
                      readOnly 
                    />
                  ) : (
                    <select
                      className="form-select"
                      value={newEvent.estado}
                      onChange={(e) => setNewEvent({
                        ...newEvent, 
                        estado: e.target.value,
                        className: getClassNameByEstado(e.target.value)
                      })}
                      required
                      disabled={loading}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en progreso">En progreso</option>
                      <option value="completada">Completada</option>
                    </select>
                  )}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Responsable</label>
                  <input
                    className="form-control"
                    placeholder="Nombre del responsable"
                    value={newEvent.responsable}
                    onChange={(e) => setNewEvent({...newEvent, responsable: e.target.value})}
                    required
                    readOnly={viewMode === "view"}
                    disabled={loading}
                  />
                </div>
                
                <div className="row mt-2">
                  <div className="col-6">
                    {modalMode === "edit" && viewMode === "view" && (
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={() => setViewMode("edit")}
                        disabled={loading}
                      >
                        Editar
                      </button>
                    )}
                    
                    {modalMode === "edit" && viewMode === "edit" && (
                      <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={handleDeleteEvent}
                        disabled={loading}
                      >
                        {loading ? "Eliminando..." : "Eliminar"}
                      </button>
                    )}
                  </div>
                  
                  <div className="col-6 text-end">
                    <button
                      type="button"
                      className="btn btn-light me-1"
                      onClick={closeModal}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    
                    {viewMode === "edit" && (
                      <button 
                        type="submit" 
                        className="btn btn-success"
                        disabled={loading}
                      >
                        {loading 
                          ? "Guardando..." 
                          : modalMode === "create" 
                            ? "Crear Tarea" 
                            : "Guardar Cambios"}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendario;