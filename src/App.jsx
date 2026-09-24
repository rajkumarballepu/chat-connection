import { useCookies } from "react-cookie";
import "./App.css";
import { SignIn, ChatWindow, Register, Authentication } from "./components";
import { useEffect, useState } from "react";
import { validateToken } from "./api/auth";
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
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    const [cookie, setCookie, removeCookie] = useCookies(["user"]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log(theme);
        if (cookie.userTk) {
            validateToken(cookie.userTk)
                .then((data) => {
                    if (data) {
                        console.log("User from token ", data);
                        setUser(data);
                        setLoading(false)
                    }
                })
                .catch((error) => {
                    setLoading(false);  
                });
        } else {
            setLoading(false);
        }
    }, []);

    if(loading) {
        return "Loading"
    } else {
        return (
            <div className="App" data-theme={theme}>
                {
                    user ? <ChatWindow removeCookie={removeCookie} user={user} cookie={cookie} /> : <Authentication setUser={setUser} data-theme={theme} setCookie={setCookie} />
                }
                <button className="btn switch-theme" onClick={switchTheme}>
                    <i className="fa-solid fa-circle-half-stroke"></i>
                </button>
            </div>
        );
    }

}
