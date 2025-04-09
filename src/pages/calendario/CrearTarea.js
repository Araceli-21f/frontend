import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CrearTarea = ({ show, onHide, mode, tarea, onSave, onDelete, obtenerClientes }) => {
  const [formData, setFormData] = useState({
    cliente_id: '',
    descripcion: '',
    fecha_vencimiento: new Date(),
    estado: 'pendiente',
    responsable: ''
  });

  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Inicializar formulario al seleccionar una tarea
  useEffect(() => {
    if (tarea) {
      setFormData({
        cliente_id: tarea.cliente_id || '',
        descripcion: tarea.descripcion || '',
        fecha_vencimiento: tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento) : new Date(),
        estado: tarea.estado || 'pendiente',
        responsable: tarea.responsable || '',
        id: tarea.id || null
      });
    } else {
      setFormData({
        cliente_id: '',
        descripcion: '',
        fecha_vencimiento: new Date(),
        estado: 'pendiente',
        responsable: ''
      });
    }
  }, [tarea]);

  // Obtener clientes al montar
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setIsLoading(true);
        const fetchedClientes = await obtenerClientes();
        setClientes(fetchedClientes);
      } catch (err) {
        console.error("Error al obtener clientes:", err);
        setAlertType("danger");
        setAlertMessage("Error al cargar los clientes");
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (obtenerClientes) {
      fetchClientes();
    }
  }, [obtenerClientes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, fecha_vencimiento: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tareaData = {
      ...formData,
      fecha_vencimiento: formData.fecha_vencimiento.toISOString()
    };
    onSave(tareaData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{mode === "create" ? "Crear Nueva Tarea" : "Editar Tarea"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && (
          <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>
            <Form.Control
              as="select"
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </Form.Control>
            {isLoading && <Spinner animation="border" size="sm" className="ms-2" />}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de Vencimiento</Form.Label>
            <DatePicker
              selected={formData.fecha_vencimiento}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Responsable</Form.Label>
            <Form.Control
              type="text"
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <div>
              {mode === "edit" && (
                <Button
                  variant="danger"
                  onClick={() => onDelete(formData.id)}
                >
                  Eliminar
                </Button>
              )}
            </div>
            <div>
              <Button variant="secondary" onClick={onHide} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {mode === "create" ? "Crear Tarea" : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CrearTarea;
