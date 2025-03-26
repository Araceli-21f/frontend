import React, { useEffect, useRef, useState } from "react";
import Layout from "../layouts/pages/layout";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";

const Cronograma = () => {
  const ganttContainer = useRef(null);
  const [scale, setScale] = useState("mes");

  useEffect(() => {
    if (!ganttContainer.current) return;

    gantt.init(ganttContainer.current);

    // Configuración para limitar el scroll horizontal
    gantt.config.scroll_size = 0; // Deshabilitar scroll nativo
    gantt.config.prevent_scroll = true; // Prevenir scroll automático

    // Configuración de columnas
    gantt.config.columns = [
      { 
        name: "text", 
        label: "Tarea", 
        width: "*", 
        tree: true,
        align: "left"
      },
      { 
        name: "start_date", 
        label: "Inicio", 
        align: "center",
        width: 100,
        template: (obj) => gantt.templates.date_grid(obj.start_date)
      },
      { 
        name: "duration", 
        label: "Duración", 
        align: "center",
        width: 120,
        template: (obj) => `${obj.duration} días`
      },
      { 
        name: "progress", 
        label: "Progreso", 
        align: "center",
        width: 150,
        template: (obj) => `
          <div class="progress" style="height: 20px;">
            <div class="progress-bar" role="progressbar" 
                 style="width: ${Math.round(obj.progress * 100)}%;" 
                 aria-valuenow="${Math.round(obj.progress * 100)}">
              ${Math.round(obj.progress * 100)}%
            </div>
          </div>
        `
      },
    ];

    // Estilos para las tareas
    gantt.templates.task_class = (start, end, task) => {
      if (task.progress <= 0.3) return "gantt-task-danger";
      if (task.progress <= 0.6) return "gantt-task-warning";
      if (task.progress <= 0.8) return "gantt-task-info";
      return "gantt-task-success";
    };


    // Configuración de la cuadrícula
    gantt.config.grid_width = 400;
    gantt.config.row_height = 40;
    gantt.config.bar_height = 30;

    // Datos de ejemplo
    const tasks = [
      { id: 1, text: "Diseño UI", start_date: "2024-03-01", duration: 5, progress: 0.6 },
      { id: 2, text: "Desarrollo Backend", start_date: "2024-03-06", duration: 7, progress: 0.4 },
      { id: 3, text: "Integración API", start_date: "2024-03-10", duration: 4, progress: 0.8 },
      { id: 4, text: "Pruebas y Correcciones", start_date: "2024-03-15", duration: 5, progress: 0.3 },
      { id: 5, text: "Entrega Final", start_date: "2024-03-20", duration: 2, progress: 1 },
    ];

    gantt.clearAll();
    gantt.parse({
      data: tasks,
      links: [
        { id: 1, source: 1, target: 2, type: "0" },
        { id: 2, source: 2, target: 3, type: "0" },
        { id: 3, source: 3, target: 4, type: "0" },
        { id: 4, source: 4, target: 5, type: "0" }
      ]
    });

    // Personalizar el scroll horizontal con manejo seguro
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.gantt_hor_scroll');
      const dataContainer = document.querySelector('.gantt_data_area');
      
      if (!scrollContainer || !dataContainer) return;
      
      const maxScroll = dataContainer.scrollWidth - dataContainer.clientWidth;
      if (maxScroll <= 0) return;

      // Obtener la última tarea con progreso válido
      const lastTaskWithProgress = tasks
        .filter(task => task.progress > 0)
        .sort((a, b) => b.id - a.id)[0];

      if (!lastTaskWithProgress) return;

      // Calcular posición límite basada en el progreso
      const progressLimit = lastTaskWithProgress.progress;
      const limitPosition = maxScroll * progressLimit;
      
      if (scrollContainer.scrollLeft > limitPosition) {
        scrollContainer.scrollLeft = limitPosition;
      }
    };

    // Añadir event listener para el scroll
    const scrollElement = document.querySelector('.gantt_hor_scroll');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }

    // Forzar redimensionamiento inicial
    gantt.render();

    return () => {
      gantt.clearAll();
      const scrollElement = document.querySelector('.gantt_hor_scroll');
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    setGanttScale(scale);
  }, [scale]);

  const setGanttScale = (scale) => {
    gantt.config.scales = [];
    gantt.config.subscales = [];

    if (scale === "dia") {
      gantt.config.scales = [
        { unit: "day", step: 1, format: "%d %M" }
      ];
      gantt.config.subscales = [
        { unit: "hour", step: 3, date: "%H:%i" }
      ];
    } else if (scale === "semana") {
      gantt.config.scales = [
        { unit: "week", step: 1, format: "Semana %W" }
      ];
      gantt.config.subscales = [
        { unit: "day", step: 1, format: "%d %M" }
      ];
    } else if (scale === "mes") {
      gantt.config.scales = [
        { unit: "month", step: 1, format: "%F %Y" }
      ];
      gantt.config.subscales = [
        { unit: "week", step: 1, format: "Semana %W" }
      ];
    } else if (scale === "año") {
      gantt.config.scales = [
        { unit: "year", step: 1, format: "%Y" }
      ];
      gantt.config.subscales = [
        { unit: "month", step: 1, format: "%M" }
      ];
    }

    gantt.render();
  };
  

  return (
    <Layout>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Cronograma del Proyecto</h4>
              <p className="card-title-desc">
                Visualización interactiva del cronograma con scroll limitado al progreso actual.
              </p>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="btn-group" role="group">
                    <button 
                      type="button" 
                      className={`btn btn-outline-primary ${scale === "dia" ? "active" : ""}`}
                      onClick={() => setScale("dia")}
                    >
                      Día
                    </button>
                    <button 
                      type="button" 
                      className={`btn btn-outline-primary ${scale === "semana" ? "active" : ""}`}
                      onClick={() => setScale("semana")}
                    >
                      Semana
                    </button>
                    <button 
                      type="button" 
                      className={`btn btn-outline-primary ${scale === "mes" ? "active" : ""}`}
                      onClick={() => setScale("mes")}
                    >
                      Mes
                    </button>
                    <button 
                      type="button" 
                      className={`btn btn-outline-primary ${scale === "año" ? "active" : ""}`}
                      onClick={() => setScale("año")}
                    >
                      Año
                    </button>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <div className="d-inline-flex align-items-center">
                    <span className="me-2">Progreso:</span>
                    <span className="badge bg-danger me-2">0-30%</span>
                    <span className="badge bg-warning me-2">31-60%</span>
                    <span className="badge bg-info me-2">61-80%</span>
                    <span className="badge bg-success">81-100%</span>
                  </div>
                </div>
              </div>

              <div 
              ref={ganttContainer} 
              className="gantt-chart-container"
              // Estilos dinámicos si son necesarios
            />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cronograma;