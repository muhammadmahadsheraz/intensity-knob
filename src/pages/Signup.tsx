import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { CreateUser } from "../types/user";
import "./Auth.css";

export default function Signup() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<CreateUser>({
        name: "",
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await createUser(form);
            login(user);
            navigate("/meetings");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>Sign Up</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
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
                    <button type="submit">Sign Up</button>
                    <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </div>
    );
}
