// src/components/layout/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <>
      {/* Top bar with toggle for mobile */}
      <nav className="navbar navbar-light bg-light border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            TaskInteli
          </a>
          <button
            className="btn btn-outline-secondary d-md-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebar"
            aria-controls="sidebar"
          >
            ☰
          </button>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 p-0">
            <Sidebar />
          </div>

          <main className="col-md-9 col-lg-10 ms-sm-auto px-3 py-3">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
