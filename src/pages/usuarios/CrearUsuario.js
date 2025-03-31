import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import AlertComponent from "../../components/AlertasComponent";
import UserService from "../../services/UserService";

const CrearUsuario = ({ onUsuarioCreado }) => {
    const navigate = useNavigate();
  const { crearUsuario } = UserService(); 
  const [formData, setFormData] = useState({ name: "", apellidos: "", email: "", password: "", rol_user: ["usuario", "admin"], area: "", foto_user: "", });
  const [errors, setErrors] = useState({ name: "", apellidos: "", email: "", password: "", rol_user: "", area: "",});

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
      navigate(`/Lista_usuarios`);
      setShowAlert(true);
      setFormData({ name: "", apellidos: "", email: "", password: "", rol_user: "", area: "", foto_user: "" });
      setErrors({ name: "", apellidos: "", email: "", password: "", rol_user: "", area: "" });
      if (onUsuarioCreado) {
        onUsuarioCreado(formData);
        navigate(`/Lista_usuarios`);

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
          <div className="invoice-title d-flex justify-content-between align-items-center">
            <h3 className="font-size-h4">Agregar Usuario</h3>
            <div className="mb-4">
               <img src="/assets/images/logo-dark.png" alt="logo" height="20" className="logo-dark" />
               <img src="/assets/images/logo-light.png" alt="logo" height="20" className="logo-light" />
              </div>
             </div>
            <hr className="my-3"/>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 ">
                  <div className="mb-2 ">
                    <label className="form-label "><i className="uil-user"/> Nombre:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control shadow-sm" />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label"><i className="uil-user"/> Apellidos:</label>
                    <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="form-control shadow-sm" />
                    {errors.apellidos && <div className="text-danger">{errors.apellidos}</div>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label"><i className="uil-envelope-alt"/> Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control shadow-sm" />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label"><i className="uil-lock-alt"/> Contraseña:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control shadow-sm" />
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                  </div>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-4">
                   <div className="mb-2">
                     <label className="col col-form-label"><i className="bx bxs-user-detail"/> Rol</label>
                      <select className="form-select shadow-sm" name="rol_user" value={formData.rol_user} onChange={handleChange} >
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
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="col col-form-label"><i className="bx bxs-user-detail"/> Área</label>
                    <select className="form-select shadow-sm" name="area" value={formData.area} onChange={handleChange}>
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
                 </div>
                 <div className="text-center">
                   <button type="submit" className="btn w-lg btn-outline-success ml-3"><i className="uil-user-plus fs-6"/> Agregar Usuario </button>
                 </div>
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