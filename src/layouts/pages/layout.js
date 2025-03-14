// src/components/Layout.js
import React, { useState, useEffect } from "react";
import TopBar from "../TopBar";
import Sidebar from "../Siderbar";
import RightSidebar from "../Right-siderbar";
import Footer from "../Footer";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
            <RightSidebar />
        </div>
    );
};

export default Layout;
