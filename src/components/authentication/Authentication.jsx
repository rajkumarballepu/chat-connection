import React, { useEffect, useRef, useState } from "react";
import "./authentication.css";
import { checkUsernameAvailability, signIn, signUp } from "../../api/auth";

export default function Authentication({ setUser, setCookie }) {
    const btnBackgroundRef = useRef();
    const [mode, setMode] = useState("signIn");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [successMessage, setSuccessMessage] = useState("");

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        console.log(loading);
    }, [loading]);

    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

    const [step, setStep] = useState(0);

    const [avatarPreview, setAvatarPreview] = useState(null);
    const handleAvatar = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setForm((f) => ({ ...f, image: file }));
        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result);
        console.log(reader.result);
        reader.readAsDataURL(file);
    };

    const canAdvance = () => {
        if (step === 0)
            return (
                form.name?.trim() &&
                form.email?.trim() &&
                form.email?.includes("@")
            );
        if (step === 1) return form.username?.trim() && form.password?.trim();
        return true;
    };

    const next = () => {
        if (!canAdvance()) return;
        if (step < 2) setStep(step + 1);
    };

    const back = () => step > 0 && setStep(step - 1);

    const requestIdRef = useRef(0);
    const debounceRef = useRef(null);
    const [isChecking, setIsChecking] = useState(false);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        if (mode === "signIn") {
            setForm((prev) => ({ ...prev, [name]: value }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
            if (name === "username") {
                // clear pending debounce timer
                if (debounceRef.current) clearTimeout(debounceRef.current);

                if (value.length > 4) {
                    setIsUsernameAvailable(null);
                    setIsChecking(true);

                    const currentRequestId = ++requestIdRef.current;

                    debounceRef.current = setTimeout(async () => {
                        try {
                            const available =
                                await checkUsernameAvailability(value);
                            // ignore this result if a newer keystroke has fired since
                            if (currentRequestId === requestIdRef.current) {
                                setIsUsernameAvailable(available);
                                setIsChecking(false);
                            }
                        } catch (err) {
                            if (currentRequestId === requestIdRef.current) {
                                setIsChecking(false);
                            }
                        }
                    }, 1000); // adjust debounce delay as needed
                } else {
                    setIsUsernameAvailable(null);
                    setIsChecking(false);
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form:", form);
        setLoading(true);
        try {
            if (mode === "signIn") {
                const res = await signIn(form.username, form.password);
                if (res) {
                    setCookie("userTk", res.accessToken, {
                        path: "/",
                        maxAge: res.expire,
                    });
                }
                setUser(res.user);
            } else if (mode === "register") {
                const res = await signUp(form);
                console.log("User registered: ", res);
                setSuccessMessage(res);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
        }
        setStep(0);
        setForm({});
        setAvatarPreview(null);
        setLoading(false);
        setMode("signIn");
    };

    const onChangeView = (event) => {
        setMode(event.target.value);
        setErrorMessage("");
        setStep(0);
        if (mode === "signIn") {
            setForm({
                username: "",
                password: "",
            });
        } else if (mode === "register") {
            setForm({
                username: "",
                password: "",
                email: "",
                name: "",
                image: "",
            });
        }
        btnBackgroundRef.current.style.left = `${event.target.offsetLeft}px`;
    };

    const navRef = useRef();

    useEffect(() => {
        if (navRef.current) {
            console.log(
                navRef.current.querySelector(".cbtn.active").offsetLeft,
            );
            btnBackgroundRef.current.style.left = `${navRef.current.querySelector(".cbtn.active").offsetLeft}px`;
        }
    }, []);

    return (
        <div className="container d-flex align-items-center justify-content-center flex-column">
            <nav className="cta-nav mb-2" ref={navRef}>
                <div className="btn-background" ref={btnBackgroundRef}></div>
                <button
                    value={`signIn`}
                    onClick={onChangeView}
                    className={`cbtn ${mode === "signIn" ? "active" : ""}`}
                >
                    Sign In
                </button>
                <button
                    value={`register`}
                    onClick={onChangeView}
                    className={`cbtn ${mode === "signIn" ? "" : "active"}`}
                >
                    Register
                </button>
            </nav>
            <div className="auth-container mt-2">
                <div
                    className={`sign-in-container ${mode === "signIn" && "active"} p-5`}
                >
                    <h5>Sign In</h5>
                    <form
                        className="form-container mt-5"
                        autoComplete={"off"}
                        onSubmit={handleSubmit}
                    >
                        <div className="input-group">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={form.username || ""}
                                placeholder="Username"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password || ""}
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <button type="submit">Sign In</button>
                        </div>
                        <p>Or Sign In with</p>
                        <div className="input-group sign-in-with">
                            <button>
                                <i className="fa-brands fa-google icon"></i>
                            </button>
                        </div>
                    </form>
                </div>
                <div
                    className={`register-container-1 ${mode === "register" && "active"} p-5`}
                >
                    <h5>Register</h5>
                    <form
                        className="form-container mt-5"
                        autoComplete={"off"}
                        onSubmit={handleSubmit}
                    >
                        <div className="track-viewport">
                            <div
                                className="track"
                                style={{
                                    transform: `translateX(-${step * (100 / 3)}%)`,
                                }}
                            >
                                <div className="slide">
                                    <div
                                        className="input-group"
                                        title="Atleast 3 characters"
                                    >
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Enter your name"
                                            value={form.name || ""}
                                            onChange={handleChange}
                                            minLength={3}
                                        />
                                    </div>
                                    <div className="input-group" data-title="Please enter a valid email address (e.g., name@example.com)">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            value={form.email || ""}
                                            onChange={handleChange}
                                            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                            title="Please enter a valid email address (e.g., name@example.com)"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <button
                                            type="button"
                                            disabled={!canAdvance()}
                                            onClick={next}
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                </div>
                                <div className="slide">
                                    <div
                                        className="input-group username-input"
                                        data-title="Atleast 5 characters. Only letters and underscores are allowed."
                                    >
                                        <input
                                            type="text"
                                            name="username"
                                            value={form.username || ""}
                                            id="username"
                                            onChange={handleChange}
                                            placeholder="Enter your username"
                                            minLength={5}
                                            pattern="[A-Za-z_]+"
                                        />
                                        {form.username?.length > 4 && (
                                            <span
                                                className={`username-validate-container ${isUsernameAvailable !== null ? (isUsernameAvailable ? "available" : "unavailable") : ""}`}
                                            >
                                                {isChecking ? (
                                                    <span className="username-loader"></span>
                                                ) : isUsernameAvailable ? (
                                                    "✓"
                                                ) : (
                                                    "x"
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        className="input-group"
                                        data-title="Must include at least one alphabet, one number, and one special character. Must be greater than 8 characters"
                                    >
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={form.password || ""}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+"
                                            minLength={8}
                                        />
                                    </div>
                                    <div className="input-group btn-group">
                                        <button type="button" onClick={back}>
                                            {" "}
                                            &lt;{" "}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={!canAdvance()}
                                            onClick={next}
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                </div>
                                <div className="slide">
                                    <div className="input-group image-picker">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Profile preview"
                                                className="profile-image"
                                            />
                                        ) : (
                                            <>
                                                <label htmlFor="image">
                                                    <i className="fa-solid fa-image"></i>
                                                </label>
                                                <p>Pick profile image</p>
                                                <input
                                                    type="file"
                                                    name="image"
                                                    id="image"
                                                    placeholder="Select image"
                                                    accept="image/*"
                                                    onChange={handleAvatar}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div className="input-group"></div>
                                    <div className="input-group btn-group">
                                        <button type="button" onClick={back}>
                                            {" "}
                                            &lt;{" "}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!isUsernameAvailable}
                                        >
                                            Register
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <p>Or Sign In with</p>
                    <div className="input-group sign-in-with">
                        <button>
                            <i className="fa-brands fa-google icon"></i>
                        </button>
                    </div>
                </div>
                <p className="error-message">{errorMessage}</p>
                <p className="success-message">{successMessage}</p>
                {loading && (
                    <div className="loading-container ">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
