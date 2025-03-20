// BotonesAccion.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BotonesAccion = ({ id, entidad }) => {
    const navigate = useNavigate();

    const handleVer = () => {
        navigate(`/${entidad}/ver/${id}`);
    };

    const handleEditar = () => {
        navigate(`/${entidad}/editar/${id}`);
    };

    const handleEliminar = () => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar este ${entidad}?`)) {
            // Lógica de eliminación según la entidad
            switch (entidad) {
                case 'usuario':
                    // Eliminar cliente
                    console.log(`Usuario con ID: ${id} eliminado`);
                    break;
                case 'cliente':
                    // Eliminar cliente
                    console.log(`Cliente con ID: ${id} eliminado`);
                    break;
                case 'factura':
                    // Eliminar factura
                    console.log(`Factura con ID: ${id} eliminada`);
                    break;
                case 'cotizacion':
                    // Eliminar cotización
                    console.log(`Cotización con ID: ${id} eliminada`);
                    break;
                default:
                    console.error(`Entidad no soportada: ${entidad}`);
            }
        }
    };

    return (
        <td>
            <button onClick={handleVer} className="btn btn-sm btn-info me-1" title="Ver">
                <i className="uil uil-eye"></i>
            </button>
            <button onClick={handleEditar} className="btn btn-sm btn-primary me-1" title="Editar">
                <i className="uil uil-pen"></i>
            </button>
            <button onClick={handleEliminar} className="btn btn-sm btn-danger" title="Eliminar">
                <i className="uil uil-trash-alt"></i>
            </button>
        </td>
    );
};

export default BotonesAccion;