import React from "react";
import Sidebar from "../layouts/Siderbar";

const Home = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "20px" }}>
        <h1>Bienvenido a Home</h1>
        <p>Contenido de la página principal</p>
      </main>
    </div>
  );
};

export default Home;
