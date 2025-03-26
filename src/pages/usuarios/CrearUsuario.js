import React, { useState } from "react";
import Layout from "../../layouts/pages/layout";
import AlertComponent from "../../components/AlertasComponent";
import UserService from "../../services/UserService"; // Importa tu servicio

const CrearUsuario = ({ onUsuarioCreado }) => {
  const { crearUsuario } = UserService(); // Asume que tienes un método crearUsuario en tu servicio
  const [formData, setFormData] = useState({
    name: "",
    apellidos: "",
    email: "",
    password: "", // Añadimos el campo password
    rol_user: ["usuario", "admin"], // Cambiamos a rol_user
    area: "",
    foto_user: "", // Añadimos foto_user
  });
  const [errors, setErrors] = useState({
    name: "",
    apellidos: "",
    email: "",
    password: "",
    rol_user: "",
    area: "",
  });

  // Alertas
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // Roles
  const roles = ["usuario", "admin"]; // Cambiamos a los roles del modelo
  const areas = ["Sistemas", "Finanzas"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Limpia el error al cambiar el campo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};
    let hasErrors = false;

    if (!formData.name) {
      formErrors.name = "El nombre es requerido.";
      hasErrors = true;
    }
    if (!formData.apellidos) {
      formErrors.apellidos = "Los apellidos son requeridos.";
      hasErrors = true;
    }
    if (!formData.email) {
      formErrors.email = "El email es requerido.";
      hasErrors = true;
    }
    if (!formData.password) {
      formErrors.password = "La contraseña es requerida.";
      hasErrors = true;
    }
    if (!formData.rol_user) {
      formErrors.rol_user = "El rol es requerido.";
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

    try {
      await crearUsuario(formData); // Llama a tu servicio para crear el usuario
      setAlertType("success");
      setAlertMessage("Usuario creado exitosamente.");
      setShowAlert(true);
      setFormData({ name: "", apellidos: "", email: "", password: "", rol_user: "usuario", area: "", foto_user: "" });
      setErrors({ name: "", apellidos: "", email: "", password: "", rol_user: "", area: "" });
      if (onUsuarioCreado) {
        onUsuarioCreado(formData);
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      setAlertType("error");
      setAlertMessage("Error al crear el usuario.");
      setShowAlert(true);
    }
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
                <img src="/assets/images/logo-dark.png" alt="logo" height="20" className="logo-dark" />
                <img src="/assets/images/logo-light.png" alt="logo" height="20" className="logo-light" />
              </div>
            </div>
            <h3>Agregar Usuario</h3>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label">Nombre:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label">Apellidos:</label>
                    <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="form-control" />
                    {errors.apellidos && <div className="text-danger">{errors.apellidos}</div>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label">Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label">Contraseña:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" />
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <label className="col col-form-label">Rol</label>
                <div className="col-md-10">
                  <select className="form-select" name="rol_user" value={formData.rol_user} onChange={handleChange}>
                    <option value="">Selecciona un rol</option>
                    {roles.map((rol) => (
                      <option key={rol} value={rol}>
                        {rol}
                      </option>
                    ))}
                  </select>
                  {errors.rol_user && <div className="text-danger">{errors.rol_user}</div>}
                </div>
              </div>
              <div className="mb-2 row">
                <label className="col col-form-label">Área</label>
                <div className="col-md-10">
                  <select className="form-select" name="area" value={formData.area} onChange={handleChange}>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CrearUsuario;