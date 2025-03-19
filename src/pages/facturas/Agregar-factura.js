import { Layout } from 'lucide-react';
import React from 'react';


function Agregar_factura() {
  const [facturas, setFacturas] = React.useState([]);
  const [newFactura, setNewFactura] = React.useState({
    id: '',
    fecha: '',
    nombre: '',
    monto: '',
    estado: 'Pendiente',
  });

  const handleChange = (e) => {
    setNewFactura({ ...newFactura, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFacturas([...facturas, { ...newFactura, id: Date.now() }]); //Generate a unique ID
    setNewFactura({
      id: '',
      fecha: '',
      nombre: '',
      monto: '',
      estado: 'Pendiente',
    });
  };

  return (
    <>
    <Layout>
    <div>
      <h2>Crear Factura</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">Fecha</label>
          <input type="date" className="form-control" id="fecha" name="fecha" value={newFactura.fecha} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="nombre" name="nombre" value={newFactura.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="monto" className="form-label">Monto</label>
          <input type="number" className="form-control" id="monto" name="monto" value={newFactura.monto} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="estado" className="form-label">Estado</label>
          <select className="form-select" id="estado" name="estado" value={newFactura.estado} onChange={handleChange}>
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Crear</button>
      </form>

      
    </div>
    </Layout>
    </>

  );
}

export default Agregar_factura;