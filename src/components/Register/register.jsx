import { useRef, useState } from "react";
import "./register.css";
import { signUp } from "../../api/auth";

export default function Register({ setIsRegister }) {

    const formRef = useRef(null);

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user.password !== user.confirmPassword) {
            alert("Passwords do not match!");
            setUser({ ...user, password: "", confirmPassword: "" });
            return;
        }
        signUp(user.username, user.email, user.password)
            .then((data) => {
                console.log("User registered:", data);
                setIsRegister(false); // Switch back to SignIn after registration
            })
            .catch((error) => {
                console.error("Error during registration:", error);
                alert("Registration failed. Please try again.");
            });
        console.log("User registered:", user);
        // You can add your registration logic here, such as sending the data to a server.
        setIsRegister(false); // Switch back to SignIn after registration
        // Handle registration logic here
    };

  return (
    <div className="register-container border-1">
      <div className="register-form">
        <div className="head">
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 128 128"
            >
              <circle cx="64" cy="64" r="20" fill="#0f1011" />
              <path
                fill="#0f1011cb"
                d="M99.572 10.788c1.999 1.34 2.17 4.156.468 5.858L85.424 31.262c-1.32 1.32-3.37 1.53-5.033.678A35.846 35.846 0 0 0 64 28c-19.882 0-36 16.118-36 36a35.846 35.846 0 0 0 3.94 16.391c.851 1.663.643 3.712-.678 5.033L16.646 100.04c-1.702 1.702-4.519 1.531-5.858-.468C3.974 89.399 0 77.163 0 64 0 28.654 28.654 0 64 0c13.163 0 25.399 3.974 35.572 10.788Z"
              />
              <path
                fill="#0f101157"
                d="M100.04 111.354c1.702 1.702 1.531 4.519-.468 5.858C89.399 124.026 77.164 128 64 128c-13.164 0-25.399-3.974-35.572-10.788-2-1.339-2.17-4.156-.468-5.858l14.615-14.616c1.322-1.32 3.37-1.53 5.033-.678A35.847 35.847 0 0 0 64 100a35.846 35.846 0 0 0 16.392-3.94c1.662-.852 3.712-.643 5.032.678l14.616 14.616Z"
              />
            </svg>
          </div>
          <h3 className="text-center mt-2 ">Register</h3>
        </div>
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInput1"
              placeholder="Username"
              name="username"
              value={user.username}
              onChange={handleChange}
            />
            <label htmlFor="floatingInput1">Username</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput2"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            <label htmlFor="floatingInput2">Email</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingInput3"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
            <label htmlFor="floatingInput3">Password</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingInput4"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
            />
            <label htmlFor="floatingInput4">Confirm Password</label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>

          <div className="input-group mt-2 mx-3">
            Already have an account?
            <button
              className="btn btn-link p-0 m-0 mx-2"
              onClick={() => setIsRegister(false)}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}