import React, { useState } from "react";
import Layout from "../../layouts/pages/layout";
import { useNavigate } from "react-router-dom";
import AlertComponent from '../../components/AlertasComponent';
import useCatalogoService from "../../services/CatalagoService";
import { Form, Row, Col, Card, Button } from "react-bootstrap";

const CrearCatalogo = () => {
    const navigate = useNavigate();
    const { crearProducto } = useCatalogoService();
    const [formData, setFormData] = useState({
      codigo: "",
      nombre: "",
      descripcion: "",
      precio: 0,
      categoria: "Producto",
      unidad_medida: "",
      activo: true
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        if (!isNaN(value) && parseFloat(value) >= 0) {
            setFormData({ ...formData, [name]: parseFloat(value) });
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    // Modifica el handleSubmit para mejor manejo de errores
const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    try {
      // Validación adicional
      if (formData.precio <= 0) {
        throw new Error("El precio debe ser mayor a 0");
      }
  
      const response = await crearProducto(formData);
      
      if (!response.success) {
        throw new Error(response.error || "Error al crear el producto");
      }
  
      setAlertType("success");
      setAlertMessage("Producto creado exitosamente.");
      setShowAlert(true);
      
      // Reset form
      setFormData({
        codigo: "",
        nombre: "",
        descripcion: "",
        precio: 0,
        categoria: "Producto",
        unidad_medida: "",
        activo: true
      });
      setValidated(false);
      
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.message || "Error al crear el producto");
      setShowAlert(true);
    }
  };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <Layout>
            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="header-title">Agregar Producto al Catálogo</h4>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => navigate("/catalogo")}
                                    disabled={loading}
                                >
                                    <i className="uil uil-arrow-left me-1"></i> Volver
                                </Button>
                            </div>
                            <hr className="mt-0" />

                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Código <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="codigo"
                                                value={formData.codigo}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Ej: PROD-001"
                                                disabled={loading}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Por favor ingrese un código válido
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Nombre del producto"
                                                disabled={loading}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Por favor ingrese un nombre válido
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        placeholder="Descripción detallada del producto"
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Precio <span className="text-danger">*</span></Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <Form.Control
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    name="precio"
                                                    value={formData.precio}
                                                    onChange={handleNumberChange}
                                                    required
                                                    disabled={loading}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor ingrese un precio válido (mayor o igual a 0)
                                                </Form.Control.Feedback>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Categoría <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="categoria"
                                                value={formData.categoria}
                                                onChange={handleInputChange}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="Producto">Producto</option>
                                                <option value="Servicio">Servicio</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Unidad de Medida</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="unidad_medida"
                                                value={formData.unidad_medida}
                                                onChange={handleInputChange}
                                                placeholder="Ej: kg, lt, unidad"
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        name="activo"
                                        label="Producto activo"
                                        checked={formData.activo}
                                        onChange={handleCheckboxChange}
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <Button 
                                        variant="light" 
                                        type="button"
                                        onClick={() => navigate("/catalogo")}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="uil uil-save me-1"></i> Guardar Producto
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {showAlert && (
                <AlertComponent
                    type={alertType}
                    entity="Producto"
                    action={alertType === "success" ? "create" : "error"}
                    onCancel={handleAlertClose}
                    message={alertMessage}
                    autoClose={true}
                    onClose={() => setShowAlert(false)}
                />
            )}
        </Layout>
    );
};

export default CrearCatalogo;