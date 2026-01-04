"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DEMO_CREDENTIALS = {
  email: "demo@ameridea.com",
  password: "demopassword"
};

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Demo: Only allow demo credentials
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      localStorage.setItem("ameridea_session", "demo");
      router.push("/dashboard");
    } else {
      setError("Only demo credentials are allowed for signup.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <div className="flex flex-col items-center mb-4">
          <Image src="/images/ameridea-logo.png" alt="" width={180} height={60} priority />
        </div>
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
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
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
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
