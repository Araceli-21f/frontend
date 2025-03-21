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

  //Alertas
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  //roles
  const roles = ["Empleado", "Admin"];
  const areas = ["Sistemas", "Finanzas"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Limpia el error al cambiar el campo
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};
    let hasErrors = false;

    
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
    setFormData({ nombre: "", email: "", rol: "", area: "", accesoNomina: "No" });
    setErrors({ nombre: "", email: "", rol: "", area: "" }); // Limpia los errores después de crear el usuario
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <Layout>
      <div className="row">
        <div className="col">
          <div className="card p-4">
      <div className="invoice-title">
              
                <div className="mb-4">
                  <img
                    src="/assets/images/logo-dark.png"
                    alt="logo"
                    height="20"
                    className="logo-dark"
                  />
                  <img
                    src="/assets/images/logo-light.png"
                    alt="logo"
                    height="20"
                    className="logo-light"
                  />
                </div>
               
              </div>
        <h3 class="">Agregar Usuario</h3>
        <form onSubmit={handleSubmit}>
        <div class="row">
        <div class="col-md-6">
          <div className="mb-2">
            <label className="form-label">Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control" />
            {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
          </div>
          </div>
          <div class="col-md-6">
          <div className="mb-2">
            <label className="form-label">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          </div></div>
          <div class="mb-2 row">
          <label class="col col-form-label">Rol</label>
          <div class="col-md-10">
              <select
                  className="form-select"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>
            {errors.rol && <div className="text-danger">{errors.rol}</div>}

          </div>
        </div>
        <div class="mb-2 row">
          <label class="col col-form-label">Area</label>
          <div class="col-md-10">
          <select
                  className="form-select"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un área</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
            {errors.area && <div className="text-danger">{errors.area}</div>}

          </div>
        </div>
          <button type="submit" className="btn btn-md btn-primary m-3 p-2 ">Agregar Usuario</button>
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
      </div></div></div>
    </Layout>
  );
};

export default CrearUsuario;