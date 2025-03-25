import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import { Link } from "react-router-dom";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Layout from "../layouts/pages/layout";

const Calendario = () => {
  const [events, setEvents] = useState([
    { title: "New Event Planning", start: new Date(), className: "bg-success text-white p-2 rounded" },
    { title: "Meeting", start: new Date(), className: "bg-info text-white p-2 rounded" },
    { title: "Generating Reports", start: new Date(), className: "bg-warning text-white p-2 rounded" },
    { title: "Create New Theme", start: new Date(), className: "bg-danger text-white p-2 rounded" },
  ]);

  const [newEvent, setNewEvent] = useState({id:null, title: "", start: "", category: "" });
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const handleDateClick = (info) => {
    setNewEvent({ ...newEvent, start: info.dateStr,  id: null });
    setShowModal(true);
  };
  const handleEventClick = (info) => {
    const eventData = events.find(event => event.id === info.event.id);
    if (eventData) {
      setNewEvent(eventData); // Set the event details into the form fields
      setShowModal(true);
    }
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.start) return;
    if (newEvent.id) {
      // Edit existing event
      setEvents(events.map(event => (event.id === newEvent.id ? newEvent : event)));
    } else {
      // Create new event
      const newEventData = {
        id: events.length + 1,
        title: newEvent.title,
        start: new Date(newEvent.start),
        className: newEvent.category || "bg-primary",
      };
      setEvents([...events, newEventData]);
    }
    setNewEvent({ id: null, title: "", start: "", category: "" });
    setShowModal(false);
  };
  const handleDeleteEvent = () => {
    if (newEvent.id) {
      setEvents(events.filter((event) => event.id !== newEvent.id));
    }
    setNewEvent({ id: null, title: "", start: "", category: "" });
    setShowModal(false);
  };
  return (
    <Layout>
      <div className="container-fluid mt-4 min-vh-100 d-flex flex-column">
        <div className="row flex-grow-1">
          <div className="col-lg-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <button className="btn btn-primary w-100 mb-3" onClick={() => setShowModal(true)}>
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
                 <div className="external-event fc-event bg-success" data-class="bg-success">
                     <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>New Event Planning
                 </div>
                 <div className="external-event fc-event bg-info" data-class="bg-info">
                   <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Meeting
                 </div>
                 <div className="external-event fc-event bg-warning" data-class="bg-warning">
                   <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Generating Reports
                 </div>
                <div className="external-event fc-event bg-danger" data-className="bg-danger">
                  <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Create New theme
                </div>
              </div>
            </div>
          </div>
       </div>

          <div className="col-lg-9 d-flex flex-column h-100">
            <div className="card flex-grow-1">
              <div className="card-body">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  dateClick={handleDateClick}
                  height="calc(100vh - 100px)"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar evento */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header py-3 px-4 border-bottom-0">
                <h5 className="modal-title">Event</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form className="needs-validation" onSubmit={handleEventSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label">Event Name</label>
                    <input 
                    className="form-control"
                    placeholder="Insert Event Name"
                    type="text"
                    required 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                    <div className="invalid-feedback">Please provide a valid event name</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-control form-select" required value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}>
                      <option value=""> --Select-- </option>
                      <option value="bg-danger">Danger</option>
                      <option value="bg-success">Success</option>
                      <option value="bg-primary">Primary</option>
                      <option value="bg-info">Info</option>
                      <option value="bg-dark">Dark</option>
                      <option value="bg-warning">Warning</option>
                    </select>
                    <div className="invalid-feedback">Please select a valid event category</div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-6">
                    <button type="button" className="btn btn-danger" onClick={handleDeleteEvent}>Delete</button>
                    </div>
                    <div className="col-6 text-end">
                    <button type="button" className="btn btn-light me-1" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                      <button type="submit" className="btn btn-success" id="btn-save-event">Save</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Calendario;
