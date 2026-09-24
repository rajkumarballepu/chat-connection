// import { useRef, useState } from "react";
import { useState } from "react";
import "./signIn.css";
import { signIn } from "../../api/auth";

export default function SignIn({
    setCookie,
    setIsAuthenticated,
    setIsRegister,
    setLoading,
    setUser,
}) {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Submitted credentials:", credentials);
        console.log("Username:", credentials.username);
        console.log("Password:", credentials.password);
        signIn(credentials.username, credentials.password)
            .then((data) => {
                console.log("Sign-in successful:", data);
                setCookie("userTk", data.accessToken, {
                    path: "/",
                    maxAge: data.expire,
                });
                setCookie("userProfile", data.user, {
                    path: "/",
                    maxAge: data.expire,
                }); // Example of setting a cookie with the user token
                setIsAuthenticated(true);
                setUser(data.user);
            })
            .catch((error) => {
                console.error("Sign-in failed:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="sign-in rounded-2 border border-1 border-dark">
            
        </div>
    );
}
