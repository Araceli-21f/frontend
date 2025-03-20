import React, { useState } from "react";
import Layout from "../../layouts/pages/layout";

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

    if (editMode) {
      setUsuarios(usuarios.map((user) => (user.id === selectedUser.id ? formData : user)));
      setEditMode(false);
      setSelectedUser(null);
    } else {
      setUsuarios([...usuarios, formData]);
    }
    
    setFormData({ id: "", nombre: "", email: "", rol: "", area: "", accesoNomina: "No" });
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setSelectedUser(user);
    setFormData(user);
  };

  return (
    <Layout>
      <div className="container">
        <h2>{editMode ? "Editar Usuario" : "Agregar Usuario"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>ID:</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} required disabled={editMode} />
          </div>
          <div>
            <label>Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Rol:</label>
            <input type="text" name="rol" value={formData.rol} onChange={handleChange} required />
          </div>
          <div>
            <label>Área:</label>
            <input type="text" name="area" value={formData.area} onChange={handleChange} required />
          </div>
          <div>
            <label>Acceso a Nómina:</label>
            <select name="accesoNomina" value={formData.accesoNomina} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Sí">Sí</option>
            </select>
          </div>
          <button type="submit">{editMode ? "Guardar Cambios" : "Agregar Usuario"}</button>
          {editMode && <button type="button" onClick={() => setEditMode(false)}>Cancelar</button>}
        </form>

        <h3>Lista de Usuarios</h3>
        <ul>
          {usuarios.map((user) => (
            <li key={user.id}>
              {user.nombre} - {user.email} - {user.rol} - {user.area} - Acceso Nómina: {user.accesoNomina}
              <button onClick={() => handleEdit(user)}>Editar</button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default AgregarUsuario;