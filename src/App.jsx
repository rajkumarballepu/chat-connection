import { useCookies } from "react-cookie";
import "./App.css";
import { SignIn, ChatWindow, Register } from "./components";
import { useEffect, useState } from "react";
import { validateToken } from "./api/auth";
import Loader from "./components/Loader/loader";
import { ToastContainer, toast } from "react-toastify";
import useLocalStorage from "use-local-storage";

export default function App() {
    const defaultDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
    ).matches;
    const [theme, setTheme] = useLocalStorage(
        "theme",
        defaultDark ? "dark" : "light",
    );

    const switchTheme = () => {
        console.log("----------------")
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    const [cookie, setCookie, removeCookie] = useCookies(["user"]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isRegister, setIsRegister] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log(theme);
        if (cookie.userTk) {
            validateToken(cookie.userTk)
                .then((data) => {
                    if (data) {
                        console.log("User from token ", data);
                        setUser(data);
                        setIsAuthenticated(true);
                    }
                })
                .catch((error) => {
                    setIsAuthenticated(false);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div className="App" data-theme={theme}>
            {loading && <Loader />}
            <button className="btn switch-theme" onClick={switchTheme}>
                <i class={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            {isAuthenticated ? (
                <ChatWindow
                    cookie={cookie}
                    setIsAuthenticated={setIsAuthenticated}
                    removeCookie={removeCookie}
                    setLoading={setLoading}
                    user={user}
                    toast={toast}
                />
            ) : !isRegister ? (
                <SignIn
                    setCookie={setCookie}
                    removeCookie={removeCookie}
                    setIsAuthenticated={setIsAuthenticated}
                    setIsRegister={setIsRegister}
                    setLoading={setLoading}
                    setUser={setUser}
                />
            ) : (
                <Register setIsRegister={setIsRegister} />
            )}
            <div class="mesh" aria-hidden="true">
                {/* <div class="blob blob-1"></div>
                <div class="blob blob-2"></div>
                <div class="blob blob-3"></div> */}
            </div>
            <ToastContainer />
        </div>
    );
}
