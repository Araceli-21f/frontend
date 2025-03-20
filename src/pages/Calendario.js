import Layout from "../layouts/pages/layout";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [password, setPassword] = useState('');  // Ejemplo de estado si lo necesitas para el formulario

  return (
    <Layout>
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-grid">
                    <button className="btn font-16 btn-primary" id="btn-new-event">
                      <i className="mdi mdi-plus-circle-outline"></i> Create New Event
                    </button>
                  </div>

                  {/* Aquí está el ejemplo de la imagen sin importarla */}
                  <div className="row justify-content-center mt-5">
                    <Link to="index" className="mb-5 d-block auth-logo">
                      {/* Utilizando la ruta relativa para acceder a la imagen */}
                      <img src="/assets/images/coming-soon-img.png" alt="Coming Soon" className="img-fluid d-block" />
                    </Link>
                  </div>

                  {/* Aquí iría el contenido relacionado con los eventos */}
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
                  <div id="calendar"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal para agregar nuevo evento */}
          <div className="modal fade" id="event-modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-3 px-4 border-bottom-0">
                  <h5 className="modal-title" id="modal-title">Event</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div className="modal-body p-4">
                  <form className="needs-validation" name="event-form" id="form-event" noValidate>
                    <input type="hidden" id="eventid" />
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="event-title">Event Name</label>
                          <input
                            className="form-control"
                            placeholder="Insert Event Name"
                            type="text"
                            name="title"
                            id="event-title"
                            required
                          />
                          <div className="invalid-feedback">Please provide a valid event name</div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="event-category">Category</label>
                          <select className="form-control form-select" name="category" id="event-category">
                            <option selected>--Select--</option>
                            <option value="bg-danger">Danger</option>
                            <option value="bg-success">Success</option>
                            <option value="bg-primary">Primary</option>
                            <option value="bg-info">Info</option>
                            <option value="bg-dark">Dark</option>
                            <option value="bg-warning">Warning</option>
                          </select>
                          <div className="invalid-feedback">Please select a valid event category</div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-6">
                        <button type="button" className="btn btn-danger" id="btn-delete-event">Delete</button>
                      </div>
                      <div className="col-6 text-end">
                        <button type="button" className="btn btn-light me-1" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-success" id="edit-event-btn">Edit</button>
                        <button type="submit" className="btn btn-success" id="btn-save-event">Save</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

   
    </Layout>
  );
};

export default Calendar;
