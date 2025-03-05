import React, { useEffect } from "react";
import AppRoutes from "./router/routes";

function App() {

  //Evita manipular el DOM directamente
  useEffect(() => {
    const checkbox = document.getElementById("miCheckbox"); 
    if (checkbox) {
      checkbox.checked = true; 
    }
  }, []); // Se ejecuta solo una vez cuando se monta el componente

  return <AppRoutes />;
}

export default App;
