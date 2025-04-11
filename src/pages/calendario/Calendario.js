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
import CrearTarea from "../calendario/CrearTarea";
import EditarTarea from "../calendario/EditarTarea";
import VerTarea from "../calendario/VerTarea";

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [newEvent, setNewEvent] = useState({ 
    id: null,
    cliente_id: "",
    descripcion: "",
    fecha_vencimiento: "",
    area: "datax", 
    responsable: ""
  });
  
  if (module.hot) {
    module.hot.accept();
  }

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [viewMode, setViewMode] = useState("edit");
  
  const modalRef = useRef(null);
  const calendarRef = useRef(null);

  const tareaService = useRef(TareaService());
  const clienteService = useRef(ClienteService());

  // Función para obtener el color según el área - MODIFICADA para ser más robusta
  const getColorForArea = useCallback((area) => {
    // Aseguramos que area existe y la convertimos a minúsculas para evitar problemas de case sensitivity
    if (!area) return 'gray';
    
    const areaLower = String(area).toLowerCase();
    let color;
    
    switch(areaLower) {
      case 'datax': color = '#34c38f'; break;
      case 'studiodesign': color = '#f46a6a'; break;
      case 'generalsystech': color = '#50a5f1'; break;
      case 'smartsite': color = '#f1b44c'; break;
      default: color = 'gray';
    }
    
    console.log(`Área: ${area}, Color asignado: ${color}`); 
    return color;
  }, []);

  // Cargar tareas y clientes al iniciar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tareas = await tareaService.current.obtenerTareas();
        const clientesData = await clienteService.current.obtenerClientes();
        
        setClientes(clientesData);
        
        console.log("Datos de las tareas:", tareas);
        // Mapear tareas a eventos del calendario
        const eventos = tareas.map(tarea => {
          // Añadimos logging para verificar cada tarea y su color asignado
          const color = getColorForArea(tarea.area);
          console.log(`Mapeando tarea: ${tarea._id}, Área: ${tarea.area}, Color: ${color}`);
          
          return {
            id: tarea._id,
            title: tarea.descripcion,
            start: tarea.fecha_vencimiento,
            backgroundColor: color,
            borderColor: color,
            textColor: '#000',
            extendedProps: {
              cliente_id: tarea.cliente_id,
              area: tarea.area,
              responsable: tarea.responsable
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
  }, [getColorForArea]);

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
      area: "datax", // Establecemos un valor por defecto para asegurar que siempre haya un área
      responsable: ""
    });
    setModalMode("create");
    setViewMode("edit");
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    // Verificamos y extraemos la información correctamente
    const eventData = {
      id: info.event.id,
      cliente_id: info.event.extendedProps.cliente_id?._id || info.event.extendedProps.cliente_id,
      descripcion: info.event.title,
      fecha_vencimiento: info.event.startStr,
      area: info.event.extendedProps.area || "datax", // Valor por defecto si no hay área
      responsable: info.event.extendedProps.responsable
    };
    
    console.log("Evento clickeado:", eventData);
    
    setNewEvent(eventData);
    setModalMode("edit");
    setViewMode("view");
    setShowModal(true);
  };

  // Manejo de creación y edición de tareas - MODIFICADO
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    if (!newEvent.descripcion.trim() || !newEvent.cliente_id || !newEvent.responsable) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      setLoading(true);
      
      // Aseguramos que el área siempre tenga un valor válido
      const area = newEvent.area || "datax"; 
      
      const tareaData = {
        cliente_id: newEvent.cliente_id,
        descripcion: newEvent.descripcion,
        fecha_vencimiento: newEvent.fecha_vencimiento,
        area: area,
        responsable: newEvent.responsable
      };

      console.log("Guardando tarea con datos:", tareaData);
      
      let response;
      
      if (modalMode === "edit" && newEvent.id) {
        response = await tareaService.current.actualizarTarea(newEvent.id, tareaData);
      } else {
        response = await tareaService.current.crearTarea(tareaData);
      }

      console.log("Respuesta del servidor:", response);
      
      // Aseguramos que tenemos un área válida después de la respuesta
      const responseArea = response.area || area;
      
      // Obtenemos el color basado en el área
      const color = getColorForArea(responseArea);
      console.log(`Color asignado después de guardar: ${color} para área: ${responseArea}`);

      // Actualizar el calendario con el evento nuevo o modificado
      if (modalMode === "edit") {
        // Para edición, actualizamos el evento existente
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === newEvent.id 
              ? { 
                  ...event, 
                  title: response.descripcion,
                  start: response.fecha_vencimiento,
                  backgroundColor: color,
                  borderColor: color,
                  textColor: '#000',
                  extendedProps: {
                    cliente_id: response.cliente_id,
                    area: responseArea,
                    responsable: response.responsable
                  }
                } 
              : event
          )
        );
      } else {
        // Para creación, añadimos un nuevo evento
        const newCalendarEvent = {
          id: response._id,
          title: response.descripcion,
          start: response.fecha_vencimiento,
          backgroundColor: color,
          borderColor: color,
          textColor: '#000',
          extendedProps: {
            cliente_id: response.cliente_id,
            area: responseArea,
            responsable: response.responsable
          }
        };
        
        console.log("Nuevo evento a añadir:", newCalendarEvent);
        setEvents(prevEvents => [...prevEvents, newCalendarEvent]);
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
    setNewEvent(prev => {
      const updated = { ...prev, [field]: value };
      
      // Si cambia el área, mostrar el valor actualizado
      if (field === 'area') {
        console.log(`Área cambiada a: ${value}, color correspondiente: ${getColorForArea(value)}`);
      }
      
      return updated;
    });
  };

  // Obtener ícono según el área
  const getIconForArea = (area) => {
    if (!area) return 'mdi-help-circle';
    
    const areaLower = String(area).toLowerCase();
    
    switch(areaLower) {
      case 'datax': return 'mdi-database';
      case 'studiodesign': return 'mdi-vector-arrange-above';
      case 'generalsystech': return 'mdi-server-network';
      case 'smartsite': return 'mdi-checkbox-blank-circle';
      default: return 'mdi-help-circle';
    }
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
                      area: "datax", // Establecemos un valor por defecto
                      responsable: ""
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
                  <p className="text-muted">Leyenda de areas:</p>
                  {/* Actualizado para mostrar los colores correctos en la leyenda */}
                  <div className="external-event" style={{backgroundColor: getColorForArea('datax'), color: '#000', padding: '8px', marginBottom: '10px', borderRadius: '4px'}}>
                    <i className="mdi mdi-database me-2 vertical-middle"></i>DataX
                  </div>
                  <div className="external-event" style={{backgroundColor: getColorForArea('studiodesign'), color: '#000', padding: '8px', marginBottom: '10px', borderRadius: '4px'}}>
                    <i className="mdi mdi-vector-arrange-above me-2 vertical-middle"></i>StudioDesign
                  </div>
                  <div className="external-event" style={{backgroundColor: getColorForArea('generalsystech'), color: '#000', padding: '8px', marginBottom: '10px', borderRadius: '4px'}}>
                    <i className="mdi mdi-server-network me-2 vertical-middle"></i>GeneralSystech
                  </div>
                  <div className="external-event" style={{backgroundColor: getColorForArea('smartsite'), color: '#000', padding: '8px', marginBottom: '10px', borderRadius: '4px'}}>
                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>SmartSite
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
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                    }}
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventDisplay="block"
                    eventTextColor="#000" // Cambiado a negro para mejor visibilidad
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
                  loading={loading}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleEventSubmit}
                  closeModal={closeModal}
                  getColorForArea={getColorForArea}
                  getIconForArea={getIconForArea}
                />
              )}
              
              {modalMode === "edit" && viewMode === "edit" && (
                <EditarTarea 
                  newEvent={newEvent}
                  clientes={clientes}
                  loading={loading}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleEventSubmit}
                  handleDelete={handleDeleteEvent}
                  closeModal={closeModal}
                  getColorForArea={getColorForArea}
                  getIconForArea={getIconForArea}
                />
              )}
              
              {modalMode === "edit" && viewMode === "view" && (
                <VerTarea 
                  newEvent={newEvent}
                  clientes={clientes}
                  loading={loading}
                  changeToEditMode={() => setViewMode("edit")}
                  closeModal={closeModal}
                  getColorForArea={getColorForArea}
                  getIconForArea={getIconForArea}
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