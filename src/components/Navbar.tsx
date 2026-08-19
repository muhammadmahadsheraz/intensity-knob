import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const links = [
        { to: "/meetings", label: "Meetings" },
        { to: "/schedules", label: "Schedules" },
        { to: "/availabilities", label: "Availability" },
    ];

    return (
        <nav>
            <span className="nav-brand">Meeting Scheduler</span>
            <div className="nav-links">
                {links.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={location.pathname === link.to ? "active" : ""}
                    >
                        {link.label}
                    </Link>
                ))}
                <span style={{ color: "#999", fontSize: "13px" }}>{user.name}</span>
                <button
                    onClick={logout}
                    style={{
                        background: "none",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "13px",
                        cursor: "pointer",
                        color: "#555"
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
