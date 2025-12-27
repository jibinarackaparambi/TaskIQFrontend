import React, { useState, useEffect } from "react";
import Layout from "../reusableComponents/Layout";
import { useNavigate } from "react-router-dom";

const CreateTodoList = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks(); // Load tasks on mount (optional for create form)
  }, []);

  const loadTasks = () => {
    const token = localStorage.getItem("access_token");
    fetch("http://localhost:8000/api/tasks/", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!res.ok) throw new Error("Failed to load tasks");
        return res.json();
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem("access_token");
    
    fetch("http://localhost:8000/api/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Created task:", data);
        // Clear form and navigate
        setFormData({ title: "", description: "", status: "" });
        navigate("/list"); // ✅ Correct navigation
      })
      .catch((err) => {
        console.error("Error creating task:", err);
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Layout>
        <div className="container">
          <h2>Create Todo Task</h2> {/* ✅ Fixed typo */}
          <div className="p-4" style={{ maxWidth: '520px' }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Task Name</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-control"
                  placeholder="Task Name"
                  value={formData.title}
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
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status" // ✅ Fixed typo "sWtatus"
                  name="status"
                  className="form-select"
                  value={formData.status}
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
                <button 
                  type="submit" 
                  className="btn btn-success" 
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Task"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/list")}
                  disabled={loading}
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

export default CreateTodoList;
