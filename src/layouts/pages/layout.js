// src/components/Layout.js
import React, { useState, useEffect } from "react";
import TopBar from "../TopBar";
import Sidebar from "../Siderbar";
import RightSidebar from "../Right-siderbar";
import Footer from "../Footer";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showRightSidebar, setShowRightSidebar] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const toggleRightSidebar = () => {
        setShowRightSidebar(!showRightSidebar);
    };

    useEffect(() => {
      if (isSidebarOpen) {
          document.body.removeAttribute("data-sidebar-size");
      } else {
          document.body.setAttribute("data-sidebar-size", "sm", "small");
      }
  }, [isSidebarOpen]);

    return (
        <div id="layout-wrapper">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <TopBar toggleSidebar={toggleSidebar} />
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        {children}
                    </div>
                </div>
                <Footer />
            </div>
             {/* Mostrar RightSidebar solo si showRightSidebar es true */}
                  {showRightSidebar && <RightSidebar />}
            
                  {/* Cerrar el sidebar al hacer clic fuera */}
                  {showRightSidebar && (
                    <div className="rightbar-overlay" onClick={toggleRightSidebar}></div>
                  )}
        </div>
    );
};

export default Layout;
