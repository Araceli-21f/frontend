import React, { useState } from "react";
import Layout from "../../layouts/pages/layout";

const Lista_nomina = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo de nómina (reemplaza con tu lógica de obtención de datos)
  const nominas = [
    { id: "#NM001", empleado: "Ana López", fecha: "2023-10-31", salario: "$2500", departamento: "Ventas" },
    { id: "#NM002", empleado: "Carlos Ruiz", fecha: "2023-10-31", salario: "$3000", departamento: "Desarrollo" },
    { id: "#NM003", empleado: "Laura Gómez", fecha: "2023-10-31", salario: "$2800", departamento: "Recursos Humanos" },
    // ... más datos de nómina ...
  ];

  const filteredNominas = nominas.filter(
    (nomina) =>
      nomina.empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nomina.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="row mb-3">
      <div className="col-md-3">
          <button type="button" className="input-daterange input-group btn btn-success waves-effect waves-light">
            <i className="mdi mdi-plus me-1"></i> Agregar Nómina
          </button>
        </div> 
        <div className="col-md-8 position-relative">
          <i
            className="fas fa-search position-absolute top-50 translate-middle-y end-0 me-3"
            style={{ pointerEvents: "none" }}
          />
          <input
            type="text"
            className="form-control pe-5"
            placeholder="Buscar nómina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                      <th>Empleado</th>
                      <th>Fecha</th>
                      <th>Salario</th>
                      <th>Departamento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNominas.map((nomina) => (
                      <tr key={nomina.id}>
                        <td>{nomina.id}</td>
                        <td>{nomina.empleado}</td>
                        <td>{nomina.fecha}</td>
                        <td>{nomina.salario}</td>
                        <td>{nomina.departamento}</td>
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
                {/* Implementar paginación aquí si es necesario */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inclusión de JavaScript específico para el Footer */}
      <script src="/assets/libs/datatables.net/js/jquery.dataTables.min.js"></script>
      <script src="/assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js"></script>
      <script src="/assets/libs/datatables.net-responsive/js/dataTables.responsive.min.js"></script>
      <script src="/assets/libs/datatables.net-responsive-bs4/js/responsive.bootstrap4.min.js"></script>
    </Layout>
  );
};

export default Lista_nomina;