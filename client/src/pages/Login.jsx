import { useState } from "react";
import api from "@/services/api.js";
import { Button } from "@/components/ui/button";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Login</h2>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
        <input 
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
        <input 
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>
      <Button onClick={submit}>Login</Button>
      <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
        Don't have an account?{' '}
        <a href="/register" style={{ color: '#0066cc', textDecoration: 'none' }}>
          Register
        </a>
      </div>
    </div>
  );
}
