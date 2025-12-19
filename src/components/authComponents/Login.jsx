import React from "react";
import { Link,Navigate  } from "react-router-dom";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      redirect: false,
    };
  }

  getClientDetails = async (e) => {
    e.preventDefault();
    try {
      console.log("client details call");
      const res = await fetch(
        "http://localhost:8000/api/auth/client_details/",
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.log("client details error:", err);
        throw new Error("API failed");
      }

      const data = await res.json();
      // FIX: store both keys correctly
      localStorage.setItem("client_id", data.client_id);
      localStorage.setItem("client_secret", data.client_secret);
      
    } catch (err) {
      console.error(err);
      alert("Error fetching client details");
    }
  };

  changeValue = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  submitForm = async (e) => {
    e.preventDefault();
    // const navigate = useNavigate();   
    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ error: "Fields are empty" });
      return;
    }

    const clientId = localStorage.getItem("client_id");
    const clientSecret = localStorage.getItem("client_secret");

    if (!clientId || !clientSecret) {
      this.setState({ error: "Client credentials missing. Click login again." });
      return;
    }

    try {
      // DOT expects application/x-www-form-urlencoded for /o/token/ by default
      const body = new URLSearchParams({
        username: email,
        password: password,
        grant_type: "password",
        client_id: clientId,
        client_secret: clientSecret,
      });

      const res = await fetch("http://localhost:8000/o/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.log("token error:", err);
        throw new Error("API failed");
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      this.setState({ redirect: true });
      // navigate("/list");  
      // e.g. localStorage.setItem("access_token", data.access_token);
    } catch (err) {
      console.error(err);
      this.setState({ error: "Login failed" });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/list" replace />;   // ✅ redirect component
    }
    return (
      <div className="container" style={{ margin: "4%" }}>
        <div className="card p-4 shadow-sm">
          <h2 className="title mb-4">Log in to your account</h2>
          {this.state.error && (
            <div className="alert alert-danger">{this.state.error}</div>
          )}

          {/* call getClientDetails inside submitForm or onClick before submit */}
          <form
            onSubmit={(e) => {
              // first get client details, then submit token request
              this.getClientDetails(e);
              this.submitForm(e);
            }}
          >
            <div className="mb-3">
              <label
                htmlFor="emailControlGroup"
                className="form-label"
              >
                Email
              </label>
              <input
                type="email"
                id="emailControlGroup"
                name="email"
                className="form-control"
                placeholder="email"
                onChange={this.changeValue}
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="passwordControlGroup"
                className="form-label"
              >
                Password
              </label>
              <input
                type="password"
                id="passwordControlGroup"
                name="password"
                className="form-control"
                placeholder="***"
                onChange={this.changeValue}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Log in
            </button>
            <p className="text-center mt-3 mb-0">
              Don't have an account yet? <Link to="/">Register here</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}
