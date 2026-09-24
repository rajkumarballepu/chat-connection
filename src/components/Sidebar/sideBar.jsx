import { useState } from "react";
import "./sideBar.css";

export default function Sidebar({
    setCurrentView,
    setSideActive,
    sideActive,
    setIsAuthenticated,
    removeCookie,
    setLoading,
    user,
}) {
    const [toggle, setToggle] = useState(false);
    const handleToggle = (e) => {
        console.log(e.target);
        console.log("toggled:", toggle);
        setToggle(!toggle);
        setSideActive(!sideActive);
    };

    return (
        <div className="sidebar">
            <div className="nav-ctl">
                <div className="user-container">
                    <div className="user-image">
                        {user.image ? (
                            <img
                                src={`http://localhost:8080/api/v1/auth/files/image/${user.image.id}`}
                                alt=""
                            />
                        ) : (
                            <i className="fa-solid fa-circle-user"></i>
                        )}
                    </div>
                    <div className="user-details mt-2">
                        <h6>{user?.name || "User"}</h6>
                        <p className="email text mt-0">
                            {user?.email || "No email provided"}
                        </p>
                    </div>
                </div>
                <div className="chat-cta">
                    <div
                        className="icon"
                        onClick={(event) => {
                            setCurrentView("home/chat-list");
                        }}
                    >
                        <i className="fa-solid fa-message"></i>
                    </div>
                </div>
                <div className="search-cta">
                    <div
                        className="icon"
                        onClick={(event) => {
                            setCurrentView("home/search");
                        }}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
                <div className="requests-cta">
                    <div
                        className="icon"
                        onClick={(event) => {
                            setCurrentView("home/requests");
                        }}
                    >
                        <i className="fa-solid fa-user-plus"></i>
                    </div>
                </div>
            </div>
            <div className="bottom-ctl-nav">
                <div
                    className="cta cta-settings"
                    onClick={() => {
                        setCurrentView("home/settings");
                    }}
                >
                    <div className="icon">
                        <i className="fa-solid fa-gear"></i>
                    </div>
                </div>
                <div className="cta cta-options" onClick={handleToggle}>
                    <div className="icon">
                        <i
                            className={
                                toggle
                                    ? "fa-solid fa-xmark"
                                    : "fa-solid fa-bars"
                            }
                        ></i>
                    </div>
                </div>
                <div
                    className="cta cta-logout"
                    onClick={() => {
                        console.log("Logging out...", removeCookie);
                        setLoading(true);
                        removeCookie("userTk", { path: "/" });
                        removeCookie("userProfile", { path: "/" });
                        setIsAuthenticated(false);
                        setLoading(false);
                    }}
                >
                    <div className="icon">
                        <i className="fa-solid fa-power-off"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}
