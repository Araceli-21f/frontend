import { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import AlertComponent from "../../components/AlertasComponent";

const EditarUsuario = ({ user, onUsuarioActualizado, onCancelarEdicion }) => {
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

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    onUsuarioActualizado(formData);
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
               
              </div>        <h2>Editar Usuario</h2>
        <form onSubmit={handleSubmit}>

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
          <div className="mb-3">
            <label className="form-label">Acceso a Nómina:</label>
            <select name="accesoNomina" value={formData.accesoNomina} onChange={handleChange} className="form-select ">
              <option value="No">No</option>
              <option value="Sí">Sí</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
          <button type="button" onClick={onCancelarEdicion} className="btn btn-secondary ms-2">Cancelar</button>
        </form>
        {showAlert && <AlertComponent type="success" entity="Usuario" action="save" onClose={handleAlertClose} />}
      </div>
      </div></div>
    </Layout>
  );
};

export default EditarUsuario;