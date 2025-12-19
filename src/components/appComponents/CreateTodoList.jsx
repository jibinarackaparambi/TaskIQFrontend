import React from "react";
import Layout from "../reusableComponents/Layout";

export default class CreateTodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            status: "",
            };
        this.handleSumbit = this.handleSumbit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSumbit(e) {
        e.preventDefault();
        console.log("formdata", this.state);
        fetch("http://localhost:8000/api/tasks/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify(this.state),   // {task_name, description, status}
        }).then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        }).then((data) => {
            console.log("Created task:", data);
            // optional: clear form
            this.setState({ task_name: "", description: "", status: "" });
        }).catch((err) => {
            console.error("Error creating task:", err);
        });
    }

    handleChange(e) {
        this.setState({[e.target.name]:e.target.value})
    }
    render(){
        return (
            <div>
                <Layout>
                    <div className="container">
                        <h2>Creat Todo Task</h2>
                        <div className=" p-4 " style={{maxWidth: '520px'}}>
                            <form onSubmit={this.handleSumbit}>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Task Name</label>
                                    <input id='task-name'
                                    name="title"  
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Task Name" 
                                    value={this.state.title}
                                    onChange={this.handleChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Task Description</label>
                                    <textarea name="description" id="description" className="form-control"  rows="3" value={this.state.description} onChange={this.handleChange}></textarea>
                                </div> 
                                {/* Status as dropdown */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="status"
                                        className="form-label"
                                    >
                                        Status
                                    </label>
                                    <select
                                        id="sWtatus"
                                        name="status"
                                        className="form-select"
                                        value={this.state.status}
                                        onChange={this.handleChange}
                                    >
                                        <option value="">Select status</option>
                                        <option value="TODO">To Do</option>
                                        <option value="INPROGRES">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="PENDING">Pending</option>
                                    </select>
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-success">Save</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </Layout>

            </div>
        );
    }
}