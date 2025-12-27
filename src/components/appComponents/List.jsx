import React from "react";
import Layout from "../reusableComponents/Layout";
import { Navigate } from "react-router-dom";

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      redirect: false,
      id: "",
      deletingId: null, // Track which task is being deleted
      showConfirm: false, // Show delete confirmation
      confirmId: null // ID of task to confirm delete
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = (e) => {
    if (e) e.preventDefault();

    const token = localStorage.getItem("access_token");

    fetch("http://localhost:8000/api/tasks/", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log(res.status, "error");
          if (res.status === 401) {
            window.location.href = "/login";
          }
          throw new Error("Failed to load tasks");
        }
        return res.json();
      })
      .then((data) => {
        this.setState({ tasks: data });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  onEdit = (id) => {
    this.setState({
      redirect: true,
      id: id,
    });
  };

  onDelete = (id) => {
    this.setState({
      showConfirm: true,
      confirmId: id,
    });
  };

  handleDeleteConfirm = () => {
    const { confirmId } = this.state;
    const token = localStorage.getItem("access_token");

    this.setState({ deletingId: confirmId });

    fetch(`http://localhost:8000/api/tasks/${confirmId}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/login";
          }
          throw new Error("Failed to delete task");
        }
        // Reload data after successful delete
        this.loadData();
      })
      .catch((err) => {
        console.error("Delete error:", err);
        this.setState({ deletingId: null });
      })
      .finally(() => {
        this.setState({
          showConfirm: false,
          confirmId: null,
          deletingId: null,
        });
      });
  };

  handleDeleteCancel = () => {
    this.setState({
      showConfirm: false,
      confirmId: null,
    });
  };

  render() {
    const { tasks, redirect, id, showConfirm, confirmId, deletingId } = this.state;

    if (redirect) {
      return <Navigate to={`/edit/${id}`} replace />;
    }

    return (
      <div>
        <Layout>
          <div className="container">
            <h2>Todo List</h2>

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
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            onClick={() => this.onEdit(task.id)}
                            className="btn btn-outline-secondary"
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            onClick={() => this.onDelete(task.id)}
                            className="btn btn-outline-danger"
                            title="Delete"
                            disabled={deletingId === task.id}
                          >
                            {deletingId === task.id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1"></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-trash"></i> Delete
                              </>
                            )}
                          </button>
                        </div>
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

        {/* Delete Confirmation Modal */}
        {showConfirm && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={this.handleDeleteCancel}
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this task? This action cannot be undone.
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={this.handleDeleteCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.handleDeleteConfirm}
                    disabled={deletingId !== null}
                  >
                    {deletingId ? "Deleting..." : "Delete Task"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
