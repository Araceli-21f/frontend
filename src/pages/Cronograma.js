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
    gantt.config.columns = [
      { name: "text", label: "Tarea", width: "*", tree: true },
      { name: "start_date", label: "Inicio", align: "center" },
      { name: "duration", label: "Duración", align: "center" },
      { name: "progress", label: "Progreso", align: "center" },
    ];

    gantt.templates.task_class = (start, end, task) => {
      if (task.progress <= 0.3) return "low-progress";
      if (task.progress <= 0.6) return "medium-progress";
      if (task.progress <= 0.8) return "high-progress";
      return "completed-progress";
    };

    gantt.clearAll();
    gantt.parse({
      data: [
        { id: 1, text: "Diseño UI", start_date: "2024-03-01", duration: 5, progress: 0.6 },
        { id: 2, text: "Desarrollo Backend", start_date: "2024-03-06", duration: 7, progress: 0.4 },
        { id: 3, text: "Integración API", start_date: "2024-03-10", duration: 4, progress: 0.8 },
        { id: 4, text: "Pruebas y Correcciones", start_date: "2024-03-15", duration: 5, progress: 0.3 },
        { id: 5, text: "Entrega Final", start_date: "2024-03-20", duration: 2, progress: 1 },
      ],
    });

    setGanttScale(scale);

    return () => {
      gantt.clearAll();
    };
  }, []);

  useEffect(() => {
    setGanttScale(scale);
  }, [scale]);

  const setGanttScale = (scale) => {
    gantt.config.scales = [];

    if (scale === "dia") {
      gantt.config.scales = [{ unit: "day", step: 1, format: "%d %M" }, { unit: "hour", step: 1, format: "%H:%i" }];
    } else if (scale === "semana") {
      gantt.config.scales = [{ unit: "week", step: 1, format: "Semana %W" }, { unit: "day", step: 1, format: "%d %M" }];
    } else if (scale === "mes") {
      gantt.config.scales = [{ unit: "month", step: 1, format: "%F %Y" }, { unit: "week", step: 1, format: "Semana %W" }];
    } else if (scale === "año") {
      gantt.config.scales = [{ unit: "year", step: 1, format: "%Y" }, { unit: "month", step: 1, format: "%M" }];
    }

    gantt.render();
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Cronograma de Proyecto</h5>

              {/* Nueva barra de opciones */}
              <div className="btn-group mb-3" role="group">
                <button className={`btn ${scale === "mes" ? "btn-primary" : "btn-light"}`} onClick={() => setScale("mes")}>Month</button>
                <button className={`btn ${scale === "semana" ? "btn-primary" : "btn-light"}`} onClick={() => setScale("semana")}>Week</button>
                <button className={`btn ${scale === "dia" ? "btn-primary" : "btn-light"}`} onClick={() => setScale("dia")}>Day</button>
                <button className={`btn ${scale === "año" ? "btn-primary" : "btn-light"}`} onClick={() => setScale("año")}>Year</button>
              </div>

              {/* Contenedor del Gantt */}
              <div ref={ganttContainer} className="gantt-chart" style={{ height: "500px" }} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cronograma;
