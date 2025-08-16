import React, { useState, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showStrength?: boolean;
  label?: string;
}

export const PasswordField = ({
  id,
  value,
  onChange,
  placeholder,
  className,
  showStrength = false,
  label,
  ...rest
}: PasswordFieldProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      {label && <label htmlFor={id} className="text-sm font-medium">{label}</label>}
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={className || "h-12 pr-12"}
          value={value}
          onChange={onChange}
          {...rest}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {showStrength && <p className="text-sm text-government-500">Weak</p>}
    </div>
  );
};
