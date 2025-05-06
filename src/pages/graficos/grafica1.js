import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Chart } from 'chart.js/auto';
import TareaService from '../../services/TareaService';

const Grafica1 = () => {
  const [stats, setStats] = useState({
    total: 0,
    completadas: 0,
    pendientes: 0,
    enProgreso: 0,
    porcentaje: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRefs = useRef({});
  const { obtenerTareas } = TareaService();
  const [Tareas, setTareas] = useState([]);
    
  

   useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await obtenerTareas();
          setTareas(data);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
      fetchData();
    }, [obtenerTareas]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
         
        const total = Tareas.length;
        const completadas = Tareas.filter(t => t.estado === 'completada').length;
        const pendientes = Tareas.filter(t => t.estado === 'pendiente').length;
        const enProgreso = Tareas.filter(t => t.estado === 'en progreso').length;
        
        setStats({
          total,
          completadas,
          pendientes,
          enProgreso,
          porcentaje: total > 0 ? Math.round((completadas / total) * 100) : 0
        });

        initMiniCharts();
      } catch (error) {
        console.error("Error cargando tareas:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      Object.values(chartRefs.current).forEach(chart => chart && chart.destroy());
    };
  }, []);

  const initMiniCharts = () => {
    const charts = [
      { id: 'total-tareas-chart', color: '--bs-primary', value: stats.total },
      { id: 'pendientes-chart', color: '--bs-warning', value: stats.pendientes },
      { id: 'completadas-chart', color: '--bs-success', value: stats.completadas },
      { id: 'progreso-chart', color: '--bs-info', value: stats.enProgreso }
    ];

    charts.forEach(chart => {
      const ctx = document.getElementById(chart.id);
      if (!ctx || chartRefs.current[chart.id]) return;

      const baseValue = chart.value || 10;
      const weeklyData = Array(7).fill(0).map((_, i) => 
        Math.max(1, Math.round(baseValue * (0.7 + Math.random() * 0.6)))
      );

      chartRefs.current[chart.id] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            data: weeklyData,
            borderColor: `var(${chart.color})`,
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
    });
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error al cargar las tareas: {error}
      </Alert>
    );
  }

  return (
    <Row>
      {/* Card 1: Total Tareas */}
      <Col md={6} xl={3}>
        <Card>
          <Card.Body>
            <div className="float-end mt-2">
              <div id="total-tareas-chart" style={{ height: '40px', width: '70px' }}></div>
            </div>
            <div>
              <h4 className="mb-1 mt-1">{stats.total}</h4>
              <p className="text-muted mb-0">Total Tareas</p>
            </div>
            <p className="text-muted mt-3 mb-0">
              <span className="text-success me-1">
                <i className="mdi mdi-arrow-up-bold me-1"></i>
                {stats.porcentaje}%
              </span> completadas
            </p>
          </Card.Body>
        </Card>
      </Col>

      {/* Card 2: Tareas Pendientes */}
      <Col md={6} xl={3}>
        <Card>
          <Card.Body>
            <div className="float-end mt-2">
              <div id="pendientes-chart" style={{ height: '40px', width: '70px' }}></div>
            </div>
            <div>
              <h4 className="mb-1 mt-1">{stats.pendientes}</h4>
              <p className="text-muted mb-0">Pendientes</p>
            </div>
            <p className="text-muted mt-3 mb-0">
              <span className="text-warning me-1">
                <i className="mdi mdi-alert-circle me-1"></i>
                {stats.total > 0 ? Math.round((stats.pendientes / stats.total) * 100) : 0}%
              </span> del total
            </p>
          </Card.Body>
        </Card>
      </Col>

      {/* Card 3: Tareas Completadas */}
      <Col md={6} xl={3}>
        <Card>
          <Card.Body>
            <div className="float-end mt-2">
              <div id="completadas-chart" style={{ height: '40px', width: '70px' }}></div>
            </div>
            <div>
              <h4 className="mb-1 mt-1">{stats.completadas}</h4>
              <p className="text-muted mb-0">Completadas</p>
            </div>
            <p className="text-muted mt-3 mb-0">
              <span className="text-success me-1">
                <i className="mdi mdi-check-circle me-1"></i>
                {stats.porcentaje}%
              </span> del total
            </p>
          </Card.Body>
        </Card>
      </Col>

      {/* Card 4: En Progreso */}
      <Col md={6} xl={3}>
        <Card>
          <Card.Body>
            <div className="float-end mt-2">
              <div id="progreso-chart" style={{ height: '40px', width: '70px' }}></div>
            </div>
            <div>
              <h4 className="mb-1 mt-1">{stats.enProgreso}</h4>
              <p className="text-muted mb-0">En Progreso</p>
            </div>
            <p className="text-muted mt-3 mb-0">
              <span className="text-info me-1">
                <i className="mdi mdi-progress-clock me-1"></i>
                {stats.total > 0 ? Math.round((stats.enProgreso / stats.total) * 100) : 0}%
              </span> del total
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Grafica1;