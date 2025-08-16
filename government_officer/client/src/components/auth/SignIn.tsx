import { useState } from "react";
import { Api } from "@/lib/api";
import * as apiEndpoints from "@/lib/api-endpoints";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignInFormProps {
  onLogin: (userData: { name: string; role: string }) => void;
}

export const SignInForm = ({ onLogin }: SignInFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      type LoginResponse = {
        accessToken?: string;
        token?: string;
        user?: { name: string; role: string };
        fullName?: string;
        name?: string;
        role?: string;
      };
      const res = await Api.post<LoginResponse>(
        apiEndpoints.API_AUTH_LOGIN,
        { username, password }
      );
      const token = res.accessToken || res.token;
      if (token) {
        Cookies.set("token", token, { expires: 7 });
      } else {
        setError("No token received from server");
        setLoading(false);
        return;
      }

      if (res.user && res.user.name && res.user.role) {
        onLogin(res.user);
      } else if (res.fullName || res.name || username) {
        onLogin({ name: res.fullName || res.name || username, role: res.role || "User" });
      } else {
        setError("Login succeeded but user info missing");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Login failed";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-0">
      <div className="space-y-2">
        <Label htmlFor="username-signin">Username</Label>
        <Input
          id="username-signin"
          type="text"
          placeholder="Enter your username"
          className="h-12"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-signin">Password</Label>
        <Input
          id="password-signin"
          type="password"
          placeholder="At least 8 characters"
          className="h-12"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button
        onClick={handleSignIn}
        className="w-full h-12 bg-government-primary hover:bg-government-primary-light text-white font-medium"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </div>
  );
};
