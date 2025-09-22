import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const res = await fetch("http://localhost:8000/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, new_password: password }),
    });
    if (res.ok) {
      alert("Password reset successful!");
    } else {
      alert("Reset failed.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Submit</button>
    </div>
  );
}
