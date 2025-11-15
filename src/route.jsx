import React from "react";
import { BrowserRouter as Router, Route, Routes,Outlet } from "react-router-dom";
import Certisearch from "./components/certisearch";
import Certiupload from "./components/certiupload";
import Certilist from "./components/certilist";
import BulkUpload from "./components/fileupload";
import Header from "./components/nav";
import NotFound from "./notfound";
import AdminLayout from "./adlayout"; // Import AdminLayout
import LoginPage from "./components/adminlog"; // Import LoginPage
import ProtectedRoute from "./proutes";
import BulkDelete from "./components/delecert";

function RouteComponent() {
  return (
    <Router>
      <div className="min-h-screen ">
        <Routes>
          
           <Route path="/" element={<Certisearch />} />

           <Route path="admin" 
  element={
    <>
      <Header />
      <Outlet />
    </>
  }
>
  <Route path="upload" element={<Certiupload />} />
  <Route path="list" element={<Certilist />} />
  <Route path="file" element={<BulkUpload />} />
  <Route path="delete" element={<BulkDelete />} />

</Route>
            {/* Protected Admin routes wrapped with AdminLayout */}
          {/* <Route 
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="upload" element={<Certiupload />} />
            <Route path="list" element={<Certilist />} />
            <Route path="file" element={<BulkUpload />} />
            <Route path="/loadin" element={<LoginPage />} />npm
          </Route> */}
          
          
          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      
      </div>
    </Router>
  );
}

export default RouteComponent;
