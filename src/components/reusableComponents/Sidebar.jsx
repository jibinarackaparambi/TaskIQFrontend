// Sidebar.jsx
import { render } from "@testing-library/react";
import React from "react";
import { Link } from "react-router-dom";

export default class Sidebar extends React.Component {
  handleLogout = (e) => {
    // remove everything related to auth
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("client_id");
    localStorage.removeItem("client_secret");

    // then redirect (pick one)
    // SPA style (if you already use Navigate flag or navigate prop)
    // this.setState({ redirectToLogin: true });

    // or simplest:
    window.location.href = "/login";
  }

  componentDidMount() {
    console.log("Hai");
    if (!localStorage.getItem('access_token')){
      window.location.href = "/login";
    }
  }
  render(){
    return (
    <div
      className="offcanvas-md offcanvas-start bg-dark text-white vh-100"
      tabIndex="-1"
      id="sidebar"
    >
      <div className="offcanvas-header d-md-none">
        <h5 className="offcanvas-title">Menu</h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>
      <div className="offcanvas-body p-0 overflow-auto">
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/list" className="nav-link text-white ">
              To Do List
            </Link>
          </li>
          <li>
            <Link to="/create" className="nav-link text-white">
              Create tasks
            </Link>
          </li>
          <li>
            <a href="#" onClick={this.handleLogout} className="nav-link text-white">
              logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
  }
}
