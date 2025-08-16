import { useState } from "react";
import { Api } from "@/lib/api";
import * as apiEndpoints from "@/lib/api-endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateAccountFormProps {
  onLogin: (userData: { name: string; role: string }) => void;
}

export const CreateAccountForm = ({ onLogin }: CreateAccountFormProps) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    setCreateLoading(true);
    setCreateError(null);
    if (createPassword !== confirmPassword) {
      setCreateError("Passwords do not match");
      setCreateLoading(false);
      return;
    }
    try {
      type RegisterResponse = {
        fullName?: string;
        username?: string;
        role?: string;
      };
      const res = await Api.post<RegisterResponse>(
        apiEndpoints.API_AUTH_REGISTER,
        {
          fullName,
          username,
          email,
          password: createPassword,
          role: "ADMIN"
        }
      );
      onLogin({ name: res.fullName || res.username || username, role: res.role || "ADMIN" });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Registration failed";
      setCreateError(errorMsg);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-0">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullname">Full name</Label>
          <Input
            id="fullname"
            placeholder="Rohan Perera"
            className="h-12"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="rohan"
            className="h-12"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-create">Work email</Label>
        <Input
          id="email-create"
          type="email"
          placeholder="name@sltourism.gov.lk"
          className="h-12"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password-create">Password</Label>
          <Input
            id="password-create"
            type="password"
            placeholder="At least 8 characters"
            className="h-12 pr-12"
            value={createPassword}
            onChange={e => setCreatePassword(e.target.value)}
          />
          <p className="text-sm text-government-500">Weak</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Repeat password"
            className="h-12 pr-12"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="text-sm">
          I agree to the <span className="text-government-primary underline">Terms</span> and <span className="text-government-primary underline">Privacy</span>
        </Label>
      </div>

      {createError && <div className="text-red-500 text-sm">{createError}</div>}
      <Button
        onClick={handleCreateAccount}
        className="w-full h-12 bg-government-primary hover:bg-government-primary-light text-white font-medium"
        disabled={createLoading}
      >
        {createLoading ? "Creating..." : "Create account"}
      </Button>
      <p className="text-sm text-government-500 text-center">You'll be signed in automatically after creating your account</p>
    </div>
  );
};
