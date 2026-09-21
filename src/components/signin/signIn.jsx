// import { useRef, useState } from "react";
import { useState } from "react";
import "./signIn.css";
import { signIn } from "../../api/auth";

export default function SignIn({ setCookie, setIsAuthenticated, setIsRegister, setLoading, setUser }) {

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitted credentials:", credentials);
    console.log("Username:", credentials.username);
    console.log("Password:", credentials.password);
    signIn(credentials.username, credentials.password)
      .then((data) => {
        console.log("Sign-in successful:", data);
        setCookie('userTk', data.accessToken, { path: '/', maxAge: data.expire});
        setCookie('userProfile', data.user, { path: '/', maxAge: data.expire }); // Example of setting a cookie with the user token
        setIsAuthenticated(true);
        setUser(data.user);
      })
      .catch((error) => {
        console.error("Sign-in failed:", error);
      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="sign-in rounded-2 border border-1 border-dark">
      <div className="m-3 p-3">
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
          <h3 className="text-center mt-2 ">Sign In</h3>
        </div>

        <form className="d-flex flex-column" autoComplete="false" onSubmit={handleSubmit}>
          <div className="form-floating mt-5">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="text"
              style={{ border: "1px solid #767a7e" }}
              value={credentials.username}
              onChange={handleChange}
              name="username"
            />
            <label htmlFor="floatingInput">Username</label>
          </div>
          <div className="form-floating mt-2">
            <input
              type="password"
              className="form-control"
              id="floatingInput1"
              placeholder="text"
              style={{ border: "1px solid #767a7e" }}
              value={credentials.password}
              onChange={handleChange}
              name="password"
            />
            <label htmlFor="floatingInput1">Password</label>
          </div>

          {/* <div className="otp-container d-flex gap-2 mt-4 aspect-ratio-1">
            {otpSent.map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="form-control"
                onChange={(e) => {
                  const { value } = e.target;

                  // Only allow single digit input
                  if (value.match(/^\d$/)) {
                    const newOtp = [...otpSent];
                    newOtp[index] = value;
                    setOtpSent(newOtp);

                    // Move focus to the next input
                    if (index < 6 - 1) {
                      input.current[index + 1].focus();
                    }
                  }

                  // Move focus to previous input on backspace
                  if (value === "" && index > 0) {
                    input.current[index - 1].focus();
                  }
                }}

                handleKeyDown={(e) => {
                  if (e.key === "Backspace" && otpSent[index] === "" && index > 0) {
                    input.current[index - 1].focus();
                  }
                }}

                ref={(el) => (input.current[index] = el)}
              />
            ))}
          </div> */}

          <div className="input-group mt-2 mx-3">
            Don't have an account?
            <button className="btn btn-link p-0 m-0 mx-2" onClick={() => setIsRegister(true)}>
              Register
            </button>
          </div>

          <button className="btn p-3 btn-primary mt-5">Sign In</button>
        </form>
      </div>
    </div>
  );
}
