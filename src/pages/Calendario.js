/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { Link } from "react-router-dom";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Layout from "../layouts/pages/layout";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

const Calendario = () => {
  const [events, setEvents] = useState([
    { id: 1, title: "New Event Planning", start: new Date(), className: "bg-success" },
    { id: 2, title: "Meeting", start: new Date(), className: "bg-info" },
    { id: 3, title: "Generating Reports", start: new Date(), className: "bg-warning" },
    { id: 4, title: "Create New Theme", start: new Date(), className: "bg-danger" },
  ]);

  const [newEvent, setNewEvent] = useState({ 
    id: null, 
    title: "", 
    start: "", 
    className: "bg-primary", // Valor por defecto
    allDay: true
  });
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [viewMode, setViewMode] = useState("edit");
  
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const calendarRef = useRef(null);

  // Función para cerrar el modal correctamente
  const closeModal = () => {
    if (modalRef.current) {
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      if (modal) modal.hide();
    }
    setShowModal(false);
    setViewMode("edit");
  };

  // Función para alternar entre modos de vista/edición
  const toggleEditMode = () => {
    setViewMode(prevMode => prevMode === "view" ? "edit" : "view");
  };

  // Manejo de eventos del calendario
  const handleDateClick = (info) => {
    setNewEvent({ 
      id: null, 
      title: "", 
      start: info.dateStr,
      className: "bg-primary",
      allDay: info.allDay
    });
    setModalMode("create");
    setViewMode("edit");
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const eventData = events.find(event => event.id === parseInt(info.event.id));
    if (eventData) {
      setNewEvent({
        ...eventData,
        start: info.event.startStr,
        className: info.event.classNames[0] || "bg-primary"
      });
      setModalMode("edit");
      setViewMode("view");
      setShowModal(true);
    }
  };

  // Manejo del formulario
  const handleEventSubmit = (e) => {
    e.preventDefault();
    
    if (!newEvent.title.trim()) return;

    if (modalMode === "edit" && newEvent.id) {
      setEvents(events.map(event => 
        event.id === newEvent.id ? newEvent : event
      ));
    } else {
      const newEventData = {
        id: Math.floor(Math.random() * 10000),
        title: newEvent.title,
        start: newEvent.start,
        className: newEvent.className,
        allDay: newEvent.allDay
      };
      setEvents([...events, newEventData]);
    }
    
    closeModal();
  };

  // Eliminación de evento
  const handleDeleteEvent = () => {
    if (newEvent.id) {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== newEvent.id));
      closeModal();
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
                      title: "", 
                      start: "", 
                      className: "bg-primary",
                      allDay: true 
                    });
                    setModalMode("create");
                    setViewMode("edit");
                    setShowModal(true);
                  }}
                >
                  Create New Event
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
                  <p className="text-muted">Drag and drop your event or click in the calendar</p>
                  <div className="external-event bg-success" data-class="bg-success">
                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>New Event Planning
                  </div>
                  <div className="external-event bg-info" data-class="bg-info">
                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>Meeting
                  </div>
                  <div className="external-event bg-warning" data-class="bg-warning">
                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>Generating Reports
                  </div>
                  <div className="external-event bg-danger" data-class="bg-danger">
                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>Create New Theme
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9 d-flex flex-column h-100">
            <div className="card flex-grow-1">
              <div className="card-body">
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
                  eventDrop={(info) => {
                    setEvents(events.map(event => 
                      event.id === parseInt(info.event.id) 
                        ? { ...event, start: info.event.start } 
                        : event
                    ));
                  }}
                  eventResize={(info) => {
                    setEvents(events.map(event => 
                      event.id === parseInt(info.event.id) 
                        ? { ...event, end: info.event.end } 
                        : event
                    ));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar eventos */}
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
          {modalMode === "create" ? "Add Event" : "Edit Event"}
        </h5>
        <button 
          type="button" 
          className="btn-close" 
          onClick={closeModal}
        ></button>
      </div>
      
      <div className="modal-body p-4">
        <form onSubmit={handleEventSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Event Name</label>
            <input
              className="form-control"
              placeholder="Event name"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={newEvent.className}
              onChange={(e) => setNewEvent({...newEvent, className: e.target.value})}
              required
            >
              <option value="bg-primary">Primary</option>
              <option value="bg-success">Success</option>
              <option value="bg-info">Info</option>
              <option value="bg-warning">Warning</option>
              <option value="bg-danger">Danger</option>
              <option value="bg-dark">Dark</option>
            </select>
          </div>
          
          <div className="row mt-2">
            <div className="col-6">
              {modalMode === "edit" && (
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDeleteEvent}
                >
                  Delete
                </button>
              )}
            </div>
            
            <div className="col-6 text-end">
              <button
                type="button"
                className="btn btn-light me-1"
                onClick={closeModal}
              >
                Close
              </button>
              
              <button 
                type="submit" 
                className="btn btn-success"
              >
                {modalMode === "create" ? "Add Event" : "Update Event"}
              </button>
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