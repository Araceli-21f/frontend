import { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import AlertComponent from "../../components/AlertasComponent";

const EditarUsuario = ({ usuario, onUsuarioActualizado, onCancelarEdicion }) => {
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    email: "",
    rol: "",
    area: "",
    accesoNomina: "No",
  });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData(usuario);
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.nombre || !formData.email || !formData.rol || !formData.area) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    onUsuarioActualizado(formData);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ID:</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} className="form-control" disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Rol:</label>
            <input type="text" name="rol" value={formData.rol} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Área:</label>
            <input type="text" name="area" value={formData.area} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Acceso a Nómina:</label>
            <select name="accesoNomina" value={formData.accesoNomina} onChange={handleChange} className="form-select">
              <option value="No">No</option>
              <option value="Sí">Sí</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
          <button type="button" onClick={onCancelarEdicion} className="btn btn-secondary ms-2">Cancelar</button>
        </form>
        {showAlert && <AlertComponent type="success" entity="Usuario" action="save" onClose={handleAlertClose} />}
      </div>
    </Layout>
  );
};

export default EditarUsuario;