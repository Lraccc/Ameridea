"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DEMO_CREDENTIALS = {
  email: "demo@ameridea.com",
  password: "demopassword"
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: Accept only demo credentials
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      // Set a simple session (for demo)
      localStorage.setItem("ameridea_session", "demo");
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Use demo credentials below.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Login to Ameridea</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          Don&apos;t have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <div className="font-semibold mb-1">Demo Credentials</div>
          <div>Email: <span className="font-mono">demo@ameridea.com</span></div>
          <div>Password: <span className="font-mono">demopassword</span></div>
        </div>
      </div>
    </div>
  );
}
