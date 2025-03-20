import { useState } from "react";
import Layout from "../../layouts/pages/layout";
import AlertComponent from "../../components/AlertasComponent";

const Agregar = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    email: "",
    rol: "",
    area: "",
    accesoNomina: "No",
  });
  const [showAlert, setShowAlert] = useState(false);
  
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
    onSubmit(formData);
    setShowAlert(true);
    setFormData({ id: "", nombre: "", email: "", rol: "", area: "", accesoNomina: "No" });
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Agregar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ID" required />
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input type="text" name="rol" value={formData.rol} onChange={handleChange} placeholder="Rol" required />
          <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="Área" required />
          <select name="accesoNomina" value={formData.accesoNomina} onChange={handleChange}>
            <option value="No">No</option>
            <option value="Sí">Sí</option>
          </select>
          <button type="submit">Agregar Usuario</button>
        </form>
        {showAlert && <AlertComponent type="success" entity="Usuario" action="create" />}
      </div>
    </Layout>
  );
};

export default CrearUsuario;