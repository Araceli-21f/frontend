import { useState } from "react";
import Layout from "../../layouts/pages/layout";
import AlertComponent from "../../components/AlertasComponent";

const CrearUsuario = ({ onUsuarioCreado }) => {
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    email: "",
    rol: "",
    area: "",
    accesoNomina: "No",
  });
  const [errors, setErrors] = useState({
    id: "",
    nombre: "",
    email: "",
    rol: "",
    area: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Limpia el error al cambiar el campo
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};
    let hasErrors = false;

    if (!formData.id) {
      formErrors.id = "El ID es requerido.";
      hasErrors = true;
    }
    if (!formData.nombre) {
      formErrors.nombre = "El nombre es requerido.";
      hasErrors = true;
    }
    if (!formData.email) {
      formErrors.email = "El email es requerido.";
      hasErrors = true;
    }
    if (!formData.rol) {
      formErrors.rol = "El rol es requerido.";
      hasErrors = true;
    }
    if (!formData.area) {
      formErrors.area = "El área es requerida.";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(formErrors);
      return;
    }

    onUsuarioCreado(formData);
    setAlertType("success");
    setAlertMessage("Usuario creado exitosamente.");
    setShowAlert(true);
    setFormData({ id: "", nombre: "", email: "", rol: "", area: "", accesoNomina: "No" });
    setErrors({ id: "", nombre: "", email: "", rol: "", area: "" }); // Limpia los errores después de crear el usuario
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Agregar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ID:</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} className="form-control" />
            {errors.id && <div className="text-danger">{errors.id}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control" />
            {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Rol:</label>
            <input type="text" name="rol" value={formData.rol} onChange={handleChange} className="form-control" />
            {errors.rol && <div className="text-danger">{errors.rol}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Área:</label>
            <input type="text" name="area" value={formData.area} onChange={handleChange} className="form-control" />
            {errors.area && <div className="text-danger">{errors.area}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Acceso a Nómina:</label>
            <select name="accesoNomina" value={formData.accesoNomina} onChange={handleChange} className="form-select">
              <option value="No">No</option>
              <option value="Sí">Sí</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Agregar Usuario</button>
        </form>
        {showAlert && (
          <AlertComponent
            type={alertType}
            entity="Usuario"
            action={alertType === "success" ? "create" : "error"}
            onCancel={handleAlertClose}
            message={alertMessage}
          />
        )}
      </div>
    </Layout>
  );
};

export default CrearUsuario;