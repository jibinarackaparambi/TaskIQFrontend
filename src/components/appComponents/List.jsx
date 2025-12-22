import React from "react";
import Layout from "../reusableComponents/Layout";
import { Link,Navigate  } from "react-router-dom";

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      redirect:false,
      id: ""
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = (e) => {
    if (e) e.preventDefault();

    const token = localStorage.getItem("access_token"); // if you use auth

    fetch("http://localhost:8000/api/tasks/", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        // Uncomment if your endpoint requires OAuth2:
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log(res.status, "error")
          if (res.status == 401){
            window.location.href = "/login";
          }
          throw new Error("Failed to load tasks");
        }
        return res.json();
      })
      .then((data) => {
        // data should be an array of tasks from your DRF TaskViewSet
        this.setState({ tasks: data });
      })
      .catch((err) => {

        console.error(err);
      });
  };

  onEdit = (e) => {
    e.preventDefault();
    this.setState({ redirect: true });
    this.setState({ id: e.taget.value });
    
  }

  render() {
    const { tasks } = this.state;

    if (this.state.redirect) {
      return <Navigate to="/edit{this.state.id}" replace />;   // ✅ redirect component
    }

    return (
      <div>
        <Layout>
          <div className="container">
            <h2>Todo List</h2>

            {/* Optional: manual reload button */}
            {/* <button className="btn btn-sm btn-primary mb-3" onClick={this.loadData}>
              Reload
            </button> */}

            <div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task Name</th>
                    <th>Task Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={task.id || index}>
                      <td>{index + 1}</td>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{task.status}</td>
                      <td>
                        {/* action buttons later */}
                        <button onClick={this.onEdit} className="btn btn-sm btn-outline-secondary">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}

                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}
