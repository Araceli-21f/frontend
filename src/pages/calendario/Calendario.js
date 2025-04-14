import React, { useState, useRef, useEffect, useCallback } from "react";
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
import FilialService from "../../services/FilialService";
import UserService from "../../services/UserService";
import CrearTarea from "../calendario/CrearTarea";
import EditarTarea from "../calendario/EditarTarea";
import VerTarea from "../calendario/VerTarea";

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filiales, setFiliales] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [newEvent, setNewEvent] = useState({ 
    id: null,
    cliente_id: "",
    descripcion: "",
    fecha_vencimiento: "",
    filial_id: "", 
    estado: "pendiente", 
    usuario_id: "",
 
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [viewMode, setViewMode] = useState("edit");
  
  const modalRef = useRef(null);
  const calendarRef = useRef(null);

  const tareaService = useRef(TareaService());
  const clienteService = useRef(ClienteService());
  const filialService = useRef(FilialService());
  const userService = useRef(UserService());
  // Función para obtener el color según la filial
  const getColorForFilial = useCallback((nombre_filial) => {
    const colors = {
      'DataX': '#34c38f',      // Verde
      'StudioDesign': '#f46a6a', // Rojo
      'GeneralSystech': '#50a5f1', // Azul
      'SmartSite': '#f1b44c'    // Amarillo
    };
    return colors[nombre_filial] || '#cccccc';
  }, []);

  // Función para obtener ícono según la filial
  const getIconForFilial = useCallback((nombre_filial) => {
    const icons = {
      'DataX': 'mdi-database',
      'StudioDesign': 'mdi-vector-arrange-above',
      'GeneralSystech': 'mdi-server-network',
      'SmartSite': 'mdi-checkbox-blank-circle'
    };
    return icons[nombre_filial] || 'mdi-help-circle';
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tareas, clientesData, filialesData, usuariosData] = await Promise.all([
          tareaService.current.obtenerTareas(),
          clienteService.current.obtenerClientes(),
          filialService.current.obtenerFilials(), // Faltaba esta coma
          userService.current.obtenerUsuarios() 
        ]);
        
        setClientes(clientesData);
        setFiliales(filialesData);
        setUsuarios(usuariosData);
  
        
        // Crear mapa de filiales para fácil acceso
        const filialesMap = {};
        filialesData.forEach(filial => {
          filialesMap[filial._id] = filial.nombre_filial;
        });
        
        const usuariosMap = {};
        usuariosData.forEach(usuario => {
          usuariosMap[usuario._id] = usuario;
        });

        // Mapear tareas a eventos del calendario
        const eventos = tareas.map(tarea => {
          const nombreFilial = filialesMap[tarea.filial_id] || 'Desconocida';
          const usuario = usuariosMap[tarea.usuario_id] || {};
          return {
            id: tarea._id,
            title: tarea.descripcion,
            start: tarea.fecha_vencimiento,
            backgroundColor: getColorForFilial(nombreFilial),
            borderColor: getColorForFilial(nombreFilial),
            textColor: '#000',
            extendedProps: {
              cliente_id: tarea.cliente_id,
              filial_id: tarea.filial_id,
              nombre_filial: nombreFilial,
              estado: tarea.estado,
              usuario_id: tarea.usuario_id,
            }
          };
        });
        
        setEvents(eventos);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [getColorForFilial]);

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
      filial_id: filiales[0]?._id || "",
      estado: "pendiente",
      usuario_id: "",
  
    });
    setModalMode("create");
    setViewMode("edit");
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const eventData = {
      id: info.event.id,
      cliente_id: info.event.extendedProps.cliente_id?._id || info.event.extendedProps.cliente_id,
      descripcion: info.event.title.split(' (Asignada a:')[0], // Extraer solo la descripción
      fecha_vencimiento: info.event.startStr,
      filial_id: info.event.extendedProps.filial_id,
      estado: info.event.extendedProps.estado || "pendiente",
      usuario_id: info.event.extendedProps.usuario_id
    };
    
    setNewEvent(eventData);
    setModalMode("edit");
    setViewMode("view");
    setShowModal(true);
  };

  // Manejo de creación y edición de tareas
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    if (!newEvent.descripcion.trim() || !newEvent.filial_id ) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      setLoading(true);
      
      const tareaData = {
        cliente_id: newEvent.cliente_id || null,
        descripcion: newEvent.descripcion,
        fecha_vencimiento: newEvent.fecha_vencimiento,
        filial_id: newEvent.filial_id,
        estado: newEvent.estado,
        usuario_id: newEvent.usuario_id,
      };

      let response;
      
      if (modalMode === "edit" && newEvent.id) {
        response = await tareaService.current.actualizarTarea(newEvent.id, tareaData);
      } else {
        response = await tareaService.current.crearTarea(tareaData);
      }

      // Obtener nombre de la filial para el color
      const filial = filiales.find(f => f._id === response.filial_id);
      const nombreFilial = filial ? filial.nombre_filial : 'Desconocida';
      const usuario = usuarios.find(u => u._id === response.usuario_id) || {};

      // Actualizar el calendario
       const updatedEvent = {
        id: response._id,
        title: `${response.descripcion} (Asignada a: ${usuario.nombre || 'Sin asignar'})`,
        start: response.fecha_vencimiento,
        backgroundColor: getColorForFilial(nombreFilial),
        borderColor: getColorForFilial(nombreFilial),
        textColor: '#000',
        extendedProps: {
          cliente_id: response.cliente_id,
          filial_id: response.filial_id,
          nombre_filial: nombreFilial,
          estado: response.estado,
          usuario_id: response.usuario_id,
          usuario_nombre: usuario.nombre || 'Sin asignar'
        }
      };

      if (modalMode === "edit") {
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === newEvent.id ? updatedEvent : event
          )
        );
      } else {
        setEvents(prevEvents => [...prevEvents, updatedEvent]);
      }

      closeModal();
    } catch (error) {
      console.error("Error al guardar tarea:", error);
      alert("Ocurrió un error al guardar la tarea. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Eliminación de tarea
  const handleDeleteEvent = async () => {
    if (!newEvent.id) return;

    try {
      setLoading(true);
      await tareaService.current.eliminarTarea(newEvent.id);
      setEvents(events.filter(event => event.id !== newEvent.id));
      closeModal();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      alert("Ocurrió un error al eliminar la tarea. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Inicialización del modal
  useEffect(() => {
    if (modalRef.current && showModal) {
      const modal = new bootstrap.Modal(modalRef.current, { keyboard: false });
      modal.show();
      
      const currentModalRef = modalRef.current;

      const handleHidden = () => {
        setShowModal(false);
        setViewMode("edit");
      };
      
      modalRef.current.addEventListener('hidden.bs.modal', handleHidden);
      
      return () => {
        if (currentModalRef) {
          currentModalRef.removeEventListener('hidden.bs.modal', handleHidden);
        }
      };
    }
  }, [showModal]);

  // Manejo de cambio en el formulario
  const handleInputChange = (field, value) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

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
                      filial_id: filiales[0]?._id || "",
                      estado: "pendiente",
                      usuario_id: "",
                    
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
                  <p className="text-muted">Leyenda de filiales:</p>
                  {filiales.map(filial => (
                    <div 
                      key={filial._id}
                      className="external-event" 
                      style={{
                        backgroundColor: getColorForFilial(filial.nombre_filial),
                        color: '#000', 
                        padding: '8px', 
                        marginBottom: '10px', 
                        borderRadius: '4px'
                      }}
                    >
                      <i className={`mdi ${getIconForFilial(filial.nombre_filial)} me-2 vertical-middle`}></i>
                      {filial.nombre_filial}
                    </div>
                  ))}
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
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                    }}
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventDisplay="block"
                    eventTextColor="#000"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar/ver tareas */}
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
              {modalMode === "create" && (
                <CrearTarea 
                  newEvent={newEvent}
                  clientes={clientes}
                  filiales={filiales}
                  loading={loading}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleEventSubmit}
                  closeModal={closeModal}
                />
              )}
              
              {modalMode === "edit" && viewMode === "edit" && (
                <EditarTarea 
                  newEvent={newEvent}
                  clientes={clientes}
                  filiales={filiales}
                  loading={loading}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleEventSubmit}
                  handleDelete={handleDeleteEvent}
                  closeModal={closeModal}
                />
              )}
              
              {modalMode === "edit" && viewMode === "view" && (
                <VerTarea 
                  newEvent={newEvent}
                  clientes={clientes}
                  filiales={filiales}
                  loading={loading}
                  changeToEditMode={() => setViewMode("edit")}
                  closeModal={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendario;