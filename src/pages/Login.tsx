import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { LoginUser } from "../types/user";
import "./Auth.css";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState<LoginUser>({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await loginUser(form);
            login(user);
            navigate("/meetings")
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>Login</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                    <button type="submit">Login</button>
                    <p className="auth-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </form>
            </div>
        </div>
    );
}
