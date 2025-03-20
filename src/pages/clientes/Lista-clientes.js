import React, { useState } from "react";
import Layout from "../../layouts/pages/layout";

const ListaClientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Datos de ejemplo de clientes (reemplaza con tu lógica de obtención de datos)
  const clientes = [
    { id: "#CL001", nombre: "Juan Pérez", email: "juan.perez@example.com", telefono: "123-456-7890", direccion: "Calle 1, Ciudad", fechaRegistro: "2023-01-15" },
    { id: "#CL002", nombre: "María García", email: "maria.garcia@example.com", telefono: "987-654-3210", direccion: "Avenida 2, Ciudad", fechaRegistro: "2023-02-20" },
    // ... más clientes ...
  ];

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
            <h2 className="mb-3"><i className="fa fa-fw fa-bars"/> Lista de Usuarios</h2>

      <div className="row mb-3">
        
        <div className="col-md-3 ">
        <i
            className="fas fa-search position-absolute top-50 translate-middle-y end-0 me-3" // Añade el icono
            style={{ pointerEvents: "none" }} // Evita que el icono capture eventos de clic
          />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>
        <div className="col-md-3">
          <button type="button" className="btn btn-success waves-effect waves-light">
            <i className="mdi mdi-plus me-1"></i> Agregar Cliente
          </button>
        </div>
        
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-centered table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Dirección</th>
                      <th>Fecha de Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClientes.map((cliente) => (
                      <tr key={cliente.id}>
                        <td>{cliente.id}</td>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.email}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.direccion}</td>
                        <td>{cliente.fechaRegistro}</td>
                        <td>
                          <button className="btn btn-sm btn-primary me-1" title="Editar">
                            <i className="uil uil-pen"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" title="Eliminar">
                            <i className="uil uil-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div></div></div>
      {/* Inclusión de JavaScript específico para el Footer */}
      {/* Required datatable js */}
      <script src="/assets/libs/datatables.net/js/jquery.dataTables.min.js"></script>
      <script src="/assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js"></script>
      {/* Responsive examples */}
      <script src="/assets/libs/datatables.net-responsive/js/dataTables.responsive.min.js"></script>
      <script src="/assets/libs/datatables.net-responsive-bs4/js/responsive.bootstrap4.min.js"></script>
    </Layout>
  );
};

export default ListaClientes;