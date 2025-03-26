document.addEventListener("DOMContentLoaded", function () {
  // Configuración inicial
  let sidebarSize = "lg";
  let theme = "light";
  let isFullscreen = false;
  let isRightBarEnabled = false;

  // Selección de elementos del DOM
  const sidebarMenu = document.getElementById("sidebar-menu");
  const body = document.body;
  const sidebarBtn = document.querySelector(".vertical-menu-btn");
  const fullscreenBtn = document.querySelector('[data-bs-toggle="fullscreen"]');
  const themeToggleBtn = document.getElementById("mode-setting-btn");
  const rightBarToggleBtn = document.querySelector(".right-bar-toggle");
  const topnavMenuContent = document.getElementById("topnav-menu-content");

  // Cambiar el tamaño del sidebar
  const toggleSidebarSize = () => {
      if (sidebarSize === "lg") {
          sidebarSize = "sm";
      } else if (sidebarSize === "sm") {
          sidebarSize = "md";
      } else {
          sidebarSize = "lg";
      }
      body.setAttribute("data-sidebar-size", sidebarSize);
  };

  // Cambiar el tema (light/dark)
  const toggleTheme = () => {
      if (theme === "dark") {
          theme = "light";
          body.setAttribute("data-bs-theme", "light");
      } else {
          theme = "dark";
          body.setAttribute("data-bs-theme", "dark");
      }
  };

  // Activar o desactivar el modo fullscreen
  const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
      } else {
          document.exitFullscreen();
      }
  };

  // Toggle Right Bar
  const toggleRightBar = () => {
      isRightBarEnabled = !isRightBarEnabled;
      body.classList.toggle("right-bar-enabled", isRightBarEnabled);
  };

  // Añadir clases 'active' a los elementos de menú correspondientes
  const activateMenuItems = () => {
      const menuLinks = sidebarMenu.getElementsByTagName("a");
      const currentUrl = window.location.href.split(/[?#]/)[0];

      Array.from(menuLinks).forEach((link) => {
          if (link.href === currentUrl) {
              link.classList.add("active");
              link.closest("li").classList.add("mm-active");
          }
      });
  };

  // Cambiar tamaño del sidebar dependiendo del tamaño de la ventana
  const handleResize = () => {
      if (window.innerWidth >= 1024 && window.innerWidth <= 1366) {
          sidebarSize = "sm";
          body.setAttribute("data-sidebar-size", "sm");
      }
  };

  // Activar o desactivar el contenido del menú desplegable
  const handleMenuToggle = () => {
      const menuItems = topnavMenuContent.getElementsByTagName("a");

      Array.from(menuItems).forEach((item) => {
          item.addEventListener("click", (e) => {
              if (e.target.getAttribute("href") === "#") {
                  const parent = e.target.parentElement;
                  parent.classList.toggle("active");
                  parent.nextElementSibling.classList.toggle("show");
              }
          });
      });
  };

  // Funciones de eventos
  sidebarBtn.addEventListener("click", toggleSidebarSize);
  fullscreenBtn.addEventListener("click", toggleFullscreen);
  themeToggleBtn.addEventListener("click", toggleTheme);
  rightBarToggleBtn.addEventListener("click", toggleRightBar);

  // Eventos de cambio de tamaño de ventana
  window.addEventListener("resize", handleResize);
  window.addEventListener("load", () => {
      activateMenuItems();
      handleMenuToggle();
  });

  // Inicializar tooltips y popovers
  const initializeTooltipsAndPopovers = () => {
      const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');

      tooltips.forEach((tooltip) => new bootstrap.Tooltip(tooltip));
      popovers.forEach((popover) => new bootstrap.Popover(popover));
  };

  initializeTooltipsAndPopovers();
});