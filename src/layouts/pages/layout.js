// src/components/Layout.js
import React, { useState } from "react";
import TopBar from "../TopBar";
import Sidebar from "../Siderbar";
import RightSidebar from "../Right-siderbar";
import Footer from "../Footer";


const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  //Función para alterar el estado de siderbar
  const toggleSidebar = () => {
    console.log("Sidebar toggled!");
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div id="layout-wrapper">
      {/*Este layout se encarga de organizar cada uno de los pages con layouts y dar estructura a la pagina */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <TopBar toggleSidebar={toggleSidebar}/>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
        
            {children}
            </div>
        </div>
        <Footer/>
      </div>
     { /*<RightSidebar/>*/}
     <RightSidebar/>
    </div>
  );
};

export default Layout;
