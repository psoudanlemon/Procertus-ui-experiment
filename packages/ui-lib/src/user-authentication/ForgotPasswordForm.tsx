import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, ArrowLeft01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

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
            <HugeiconsIcon icon={AlertCircleIcon} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} />
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
          {fieldErrors?.email && <FieldError errors={[{ message: fieldErrors.email }]} />}
        </Field>
        <Field className="mt-section gap-section">
          <Button
            type="button"
            variant="outline"
            onClick={onBackToLogin ?? (() => window.history.back())}
            className="w-full"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Spinner size="sm" className="text-current" /> : "Send link"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

export { ForgotPasswordForm };
