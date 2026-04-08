"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/hooks/use-app-state";

/**
 * Presents a centered login card and routes to role-specific dashboards.
 */
export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login } = useAppState();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    if (currentUser.role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }

    router.replace("/user/dashboard");
  }, [currentUser, router]);

  /**
   * Authenticates with local dummy identities and redirects by role.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const result = login(email, password);
    if (!result.success) {
      setErrorMessage(result.message ?? "Unable to login.");
      return;
    }

    setErrorMessage("");
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password123"
              required
            />
          </label>

          {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

          <button type="submit" className="button primary block">
            Login
          </button>
        </form>

        <p className="login-hint">
          Demo credentials: admin@example.com, jane@example.com, john@example.com (password: password123)
        </p>
      </section>
    </main>
  );
}
