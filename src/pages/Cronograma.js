import React, { useEffect, useRef, useState } from "react";
import Layout from "../layouts/pages/layout";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";

const Cronograma = () => {
  const ganttContainer = useRef(null);
  const [scale, setScale] = useState("mes"); // Estado inicial de la escala
  const [showDropdown, setShowDropdown] = useState(false); // Estado del menú desplegable
  const dropdownRef = useRef(null); // Referencia para detectar clics fuera del dropdown

  useEffect(() => {
    if (!ganttContainer.current) return;

    gantt.init(ganttContainer.current); // Inicializa Gantt en el contenedor

    // Configurar columnas
    gantt.config.columns = [
      { name: "text", label: "Tarea", width: "*", tree: true },
      { name: "start_date", label: "Inicio", align: "center" },
      { name: "duration", label: "Duración", align: "center" },
      { name: "progress", label: "Progreso", align: "center" },
    ];

    // Configurar clases dinámicas para tareas según progreso
    gantt.templates.task_class = (start, end, task) => {
      if (task.progress <= 0.3) return "low-progress"; // Rojo
      if (task.progress <= 0.6) return "medium-progress"; // Naranja
      if (task.progress <= 0.8) return "high-progress"; // Amarillo
      return "completed-progress"; // Verde
    };

    // Cargar datos
    gantt.clearAll(); // Limpiar antes de agregar datos nuevos
    gantt.parse({
      data: [
        { id: 1, text: "Diseño UI", start_date: "2024-03-01", duration: 5, progress: 0.6 },
        { id: 2, text: "Desarrollo Backend", start_date: "2024-03-06", duration: 7, progress: 0.4 },
        { id: 3, text: "Integración API", start_date: "2024-03-10", duration: 4, progress: 0.8 },
        { id: 4, text: "Pruebas y Correcciones", start_date: "2024-03-15", duration: 5, progress: 0.3 },
        { id: 5, text: "Entrega Final", start_date: "2024-03-20", duration: 2, progress: 1 },
      ],
    });

    setGanttScale(scale); // Aplicar escala inicial

    return () => {
      gantt.clearAll(); // Limpieza al desmontar el componente
    };
  }, []);

  useEffect(() => {
    console.log("Escala cambiada a:", scale);
    setGanttScale(scale);
  }, [scale]); 
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Función para cambiar la escala del diagrama de Gantt
  const setGanttScale = (scale) => {
    gantt.config.scales = [];
  
    if (scale === "dia") {
      gantt.config.scales = [
        { unit: "day", step: 1, format: "%d %M" },
        { unit: "hour", step: 1, format: "%H:%i" },
      ];
    } else if (scale === "semana") {
      gantt.config.scales = [
        { unit: "week", step: 1, format: "Semana %W" },
        { unit: "day", step: 1, format: "%d %M" },
      ];
    } else if (scale === "mes") {
      gantt.config.scales = [
        { unit: "month", step: 1, format: "%F %Y" },
        { unit: "week", step: 1, format: "Semana %W" },
      ];
    } else if (scale === "año") {
      gantt.config.scales = [
        { unit: "year", step: 1, format: "%Y" },
        { unit: "month", step: 1, format: "%M" },
      ];
    }
  
    gantt.render();  // ✅ Asegura que el Gantt se redibuje
  };
  

  return (
    <Layout>
      <div className="cronograma-container">
        <h1 className="cronograma-title">📅 Cronograma de Proyecto</h1>

        {/* Botón Dropdown para cambiar la escala */}
       {/* Controles de escala con botones individuales */}
<div className="gantt-controls">
  <button onClick={() => setScale("dia")}>Día</button>
  <button onClick={() => setScale("semana")}>Semana</button>
  <button onClick={() => setScale("mes")}>Mes</button>
  <button onClick={() => setScale("año")}>Año</button>
</div>


        {/* Contenedor del Gantt */}
        <div className="gantt-container">
          <div ref={ganttContainer} className="gantt-chart" />
        </div>
      </div>
    </Layout>
  );
};

export default Cronograma;
