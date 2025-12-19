import React from "react";
import './auth.css'
import { Link } from "react-router-dom";

export default class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password1:"",
            password2:"",
            error: ""
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { email, password1, password2 } = this.state;

        // 1) all fields required
        if (!email || !password1 || !password2) {
            this.setState({ error: "All fields are required." });
            return;
        }

        // 2) email format
        if (!/\S+@\S+\.\S+/.test(email)) {
            this.setState({ error: "Invalid email format." });
            return;
        }

        // 3) password length
        if (password1.length < 6) {
            this.setState({ error: "Password must be at least 6 characters." });
            return;
        }

        // 4) passwords match
        if (password1 !== password2) {
            this.setState({ error: "Passwords do not match." });
            return;
        }

        const res = fetch("http://localhost:8000/api/auth/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password1, password2 }),
        }).then((res)=>{
            if (!res.ok) {
            const err = res.json();
            console.log(err)
            throw new Error("API failed");
            }
        }).then((data)=>{
            alert("Success");
        }).catch((err)=>{
            alert("Error")
        });

        


    };

    valueChange = (e)=> {
        this.setState({[e.target.name]:e.target.value,error: ""});
    }
    render(){
        return(
            <div className="container" style={{ marginTop: "4%" }}>
                <div className="card p-4 shadow-sm">
                    <h2 className="title mb-4">Create account</h2>
                    <form onSubmit={this.handleSubmit}>
                        {this.state.error && (
                            <div className="alert alert-danger">{this.state.error}</div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={this.state.email} 
                                className="form-control" 
                                id="exampleFormControlInput1" 
                                placeholder="name@example.com"
                                onChange={this.valueChange}>
                                </input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password1" className="form-label">Password</label>
                            <input 
                                type="password" 
                                name="password1" 
                                value={this.state.password1} 
                                className="form-control" 
                                id="password1" 
                                placeholder="*****"
                                onChange={this.valueChange}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password2" className="form-label">Confirm Password</label>
                            <input 
                                type="password" 
                                name="password2" 
                                className="form-control" 
                                id="password2" 
                                value={this.state.password2}
                                placeholder="*****"
                                onChange={this.valueChange}></input>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Create my account</button>
                        <p className="text-center mt-3 mb-0">
                        Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}