import React, { useState } from "react";
import Layout from "../../layouts/pages/layout";
import AlertComponent from "../../components/AlertasComponent";

const AgregarUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    email: "",
    rol: "",
    area: "",
    accesoNomina: "No",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertAction, setAlertAction] = useState("");


// Actualiza el estado formData con los valores del formulario.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Procesa el envío del formulario, actualiza la lista de usuarios y muestra una alerta.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.nombre || !formData.email || !formData.rol || !formData.area) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (editMode) { // Si está en modo de edición, actualiza el usuario existente.
      setUsuarios(usuarios.map((user) => (user.id === selectedUser.id ? formData : user)));
      setAlertType("success");
      setAlertAction("save");
      setShowAlert(true);
      setEditMode(false);
      setSelectedUser(null);
    } else { // Si no está en modo de edición, agrega un nuevo usuario.
      setUsuarios([...usuarios, formData]);
      setAlertType("success");
      setAlertAction("create");
      setShowAlert(true);    }
    
    setFormData({ id: "", nombre: "", email: "", rol: "", area: "", accesoNomina: "No" });
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setSelectedUser(user);
    setFormData(user);
  };

  const handleAlertClose = () => { // Cierra la alerta.
    setShowAlert(false);
  };


  return (
    <Layout>
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="invoice-title">
                  <h4 className="float-end font-size-16">
                    {editMode ? "Editar Usuario" : "Agregar Usuario"}
                  </h4>
                  <div className="mb-4">
                    <h2 className="mb-1">{editMode ? "Editar Usuario" : "Agregar Usuario"}</h2>
                  </div>
                </div>
                <hr className="my-4" />
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="text-muted">
                        <div className="mb-3">
                          <label className="form-label">ID:</label>
                          <input type="text" className="form-control" name="id" value={formData.id} onChange={handleChange} required disabled={editMode} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Nombre:</label>
                          <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email:</label>
                          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted">
                        <div className="mb-3">
                          <label className="form-label">Rol:</label>
                          <input type="text" className="form-control" name="rol" value={formData.rol} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Área:</label>
                          <input type="text" className="form-control" name="area" value={formData.area} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Acceso a Nómina:</label>
                          <select className="form-select" name="accesoNomina" value={formData.accesoNomina} onChange={handleChange}>
                            <option value="No">No</option>
                            <option value="Sí">Sí</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-print-none mt-4">
                    <div className="float-end">
                      <button type="submit" className="btn btn-primary w-md waves-effect waves-light">
                        {editMode ? "Guardar Cambios" : "Agregar Usuario"}
                      </button>
                      {editMode && (
                        <button type="button" onClick={() => setEditMode(false)} className="btn btn-secondary w-md waves-effect waves-light ms-2">                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {showAlert && (
          <AlertComponent
            type={alertType}
            entity="Usuario"
            action={alertAction}
            onCancel={handleAlertClose}
          />
        )}
        
      </div>
    </Layout>
  );
};

export default AgregarUsuario;