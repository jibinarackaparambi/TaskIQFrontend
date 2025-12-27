import React, { useState, useEffect } from "react";
import Layout from "../reusableComponents/Layout";
import { useParams, useNavigate } from "react-router-dom";

const Edit = () => {
  const { id } = useParams();  // ✅ v6 way
  const navigate = useNavigate();
  const [state, setState] = useState({
    id: "",
    title: "",
    description: "",
    status: "",
    loading: true
  });

  useEffect(() => {
    if (id) {
      loadTask(id);
    }
  }, [id]);

  const loadTask = (id) => {
    const token = localStorage.getItem("access_token");
    fetch(`http://localhost:8000/api/tasks/${id}/`, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load task");
        return res.json();
      })
      .then((data) => {
        setState({ 
          id,
          title: data.title || "",
          description: data.description || "",
          status: data.status || "",
          loading: false 
        });
      })
      .catch((err) => {
        console.error(err);
        setState(prev => ({ ...prev, loading: false }));
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, title, description, status } = state;
    
    const token = localStorage.getItem("access_token");
    
    fetch(`http://localhost:8000/api/tasks/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task");
        return res.json();
      })
      .then(() => {
        navigate("/list");  // ✅ v6 way
      })
      .catch((err) => console.error("Error updating task:", err));
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const { title, description, status, loading } = state;

  if (loading) return <div className="container mt-5">Loading task details...</div>;

  return (
    <div>
      <Layout>
        <div className="container">
          <h2>Edit Todo Task</h2>
          <div className="p-4" style={{ maxWidth: '520px' }}>
            <form onSubmit={handleSubmit}>
              {/* Same form JSX as before */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Task Name</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-control"
                  placeholder="Task Name"
                  value={title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Task Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="TODO">To Do</option>
                  <option value="INPROGRES">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">Update Task</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Edit;
