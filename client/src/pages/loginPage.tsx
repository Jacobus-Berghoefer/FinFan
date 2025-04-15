import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setUser({
          id: data.id,
          username: data.username,
          display_name: data.display_name,
          avatar: data.avatar || null,
          sleeper_id: data.sleeper_id || null,
          sleeper_linked: data.sleeper_linked || false,
        });
        navigate("/dashboard");
      } else {
        setMessage(data.error || "Invalid login");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-[#1f1f22] p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Log In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#2c2d31] text-white border border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#2c2d31] text-white border border-gray-600"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm text-center text-gray-300">{message}</p>
      )}
    </div>
  );
}