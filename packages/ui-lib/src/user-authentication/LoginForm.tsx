import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Spinner,
} from "@procertus-ui/ui";

import { PasswordInput } from "./PasswordInput";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LoginFormVariant = "password" | "passwordless";

export type LoginFormProps = {
  /** `"password"` shows email + password; `"passwordless"` shows email only (e.g. magic link). */
  variant?: LoginFormVariant;
  email?: string;
  onEmailChange?: (value: string) => void;
  password?: string;
  onPasswordChange?: (value: string) => void;
  /** For `variant="password"`, `password` is always passed. For passwordless, only `email` is passed. */
  onSubmit?: (data: { email: string; password?: string }) => void;
  onForgotPassword?: () => void;
  isSubmitting?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  /** Overrides the default submit label (`Sign in` vs `Send sign-in link`). */
  submitLabel?: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function LoginForm({
  variant = "password",
  email = "",
  onEmailChange,
  password = "",
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  isSubmitting = false,
  error,
  fieldErrors,
  submitLabel,
}: LoginFormProps) {
  const isPasswordless = variant === "passwordless";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordless) {
      onSubmit?.({ email });
    } else {
      onSubmit?.({ email, password });
    }
  };

  const resolvedSubmitLabel =
    submitLabel ?? (isPasswordless ? "Send sign-in link" : "Sign in");

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        {error && (
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Field>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange?.(e.target.value)}
            disabled={isSubmitting}
            required
            autoComplete="email"
            aria-invalid={!!fieldErrors?.email}
          />
          {fieldErrors?.email && <FieldError errors={[{ message: fieldErrors.email }]} />}
        </Field>
        {!isPasswordless ? (
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              {onForgotPassword && (
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  onClick={onForgotPassword}
                  className="ml-auto h-auto p-0"
                >
                  Forgot your password?
                </Button>
              )}
            </div>
            <PasswordInput
              id="login-password"
              value={password}
              onChange={(e) => onPasswordChange?.(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="current-password"
              aria-invalid={!!fieldErrors?.password}
            />
            {fieldErrors?.password && <FieldError errors={[{ message: fieldErrors.password }]} />}
          </Field>
        ) : null}
        <Field className="mt-section">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Spinner size="sm" className="text-current" /> : resolvedSubmitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

export { LoginForm };
