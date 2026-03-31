import * as React from "react";
import { ArrowLeftIcon, CheckCircle2Icon, CircleAlertIcon } from "lucide-react";

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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ForgotPasswordFormProps = {
  email?: string;
  onEmailChange?: (value: string) => void;
  onSubmit?: (data: { email: string }) => void;
  onBackToLogin?: () => void;
  isSubmitting?: boolean;
  error?: string;
  successMessage?: string;
  fieldErrors?: {
    email?: string;
  };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ForgotPasswordForm({
  email = "",
  onEmailChange,
  onSubmit,
  onBackToLogin,
  isSubmitting = false,
  error,
  successMessage,
  fieldErrors,
}: ForgotPasswordFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        {error && (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success">
            <CheckCircle2Icon />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        <Field>
          <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
          <Input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange?.(e.target.value)}
            disabled={isSubmitting}
            required
            autoComplete="email"
            aria-invalid={!!fieldErrors?.email}
          />
          {fieldErrors?.email && <FieldError errors={[fieldErrors.email]} />}
        </Field>
        <Field className="mt-3 gap-2">
          {onBackToLogin && (
            <Button
              type="button"
              variant="outline"
              onClick={onBackToLogin}
              className="w-full"
            >
              <ArrowLeftIcon className="size-4" />
              Back to sign in
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Spinner size="sm" /> : "Send link"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

export { ForgotPasswordForm };
