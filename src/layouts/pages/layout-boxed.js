import React from "react";
import TopBar from "../TopBar";
import Sidebar from "../Siderbar";
import RightSidebar from "../Right-siderbar";
import Footer from "../Footer";

const Layout_boxed = ({ children }) => {
  return (
    <>
      
      <body data-keep-enlarged="true" className="vertical-collpsed" data-layout-size="boxed">
        <div id="layout-wrapper">
          <Sidebar />
          <TopBar />
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
      </body>
    </>
  );
};

export default Layout_boxed;