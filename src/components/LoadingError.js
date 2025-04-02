import React from 'react';
import Layout from '../layouts/pages/layout';

const LoadingError = ({ loading, error, loadingMessage, errorMessage, children }) => {
  if (loading) {
    return (
      <Layout>
        <div className="container">
          <h2>{loadingMessage || "Cargando..."}</h2>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container">
          <h2>Error al cargar datos.</h2>
          <p>{errorMessage || error.message || "Ha ocurrido un error inesperado."}</p>
          <button onClick={() => window.location.reload()}>Recargar Página</button>
        </div>
      </Layout>
    );
  }

  return children;
};

export default LoadingError;
