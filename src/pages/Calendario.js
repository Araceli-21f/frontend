import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../layouts/pages/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
const Calendar = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", category: "" }); // Añadimos category
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (calendarRef.current) {
      console.log("Calendario inicializado");
    }
  }, []);

  const handleDateClick = (info) => {
    setNewEvent({ ...newEvent, date: info.dateStr });
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    if (newEvent.title && newEvent.category) { // Agregamos la verificación de category
      setEvents([
        ...events,
        { title: newEvent.title, start: newEvent.date, className: newEvent.category }, // Guardamos la categoría como className
      ]);
      setShowModal(false);
      setNewEvent({ title: "", date: "", category: "" }); // Reseteamos category
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-grid">
                    <button
                      className="btn font-16 btn-primary"
                      onClick={() => setShowModal(true)}
                    >
                      <i className="mdi mdi-plus-circle-outline"></i> Create New Event
                    </button>
                  </div>

                  <div className="row justify-content-center mt-5">
                    <Link to="/" className="mb-5 d-block auth-logo">
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
                    <div className="external-event fc-event bg-danger" data-class="bg-danger">
                      <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Create New theme
                    </div>
                  </div>

                  <ol className="activity-feed mb-0 ps-2 mt-4 ms-1">
                    <li className="feed-item">
                      <p className="mb-0">Andrei Coman magna sed porta finibus, risus posted a new article: Forget UX Rowland</p>
                    </li>
                    <li className="feed-item">
                      <p className="mb-0">Zack Wetass, sed porta finibus, risus Chris Wallace Commented Developer Moreno</p>
                    </li>
                    <li className="feed-item">
                      <p className="mb-0">Zack Wetass, Chris combined Commented UX Murphy</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="card">
                <div className="card-body">
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin,listPlugin]}
                    initialView="dayGridMonth"
                    events={events} // Usamos el estado events
                    dateClick={handleDateClick}
                    height="auto"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    locale="es"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header py-3 px-4 border-bottom-0">
                <h5 className="modal-title">New Event</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body p-4">
                <form className="needs-validation" noValidate>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="event-title">
                      Event Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Event Title"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="event-category">
                      Category
                    </label>
                    <select
                      className="form-control form-select"
                      value={newEvent.category}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, category: e.target.value })
                      }
                    >
                      <option value="">--Select--</option>
                      <option value="bg-danger">Danger</option>
                      <option value="bg-success">Success</option>
                      <option value="bg-primary">Primary</option>
                      <option value="bg-info">Info</option>
                      <option value="bg-dark">Dark</option>
                      <option value="bg-warning">Warning</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveEvent}>
                  Save Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Calendar;