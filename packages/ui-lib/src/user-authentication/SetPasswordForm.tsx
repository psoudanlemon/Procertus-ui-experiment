import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Spinner,
} from "@procertus-ui/ui";

import { PasswordInput } from "./PasswordInput";
import { PasswordStrength } from "./PasswordStrength";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SetPasswordFormProps = {
  newPassword?: string;
  onNewPasswordChange?: (value: string) => void;
  confirmPassword?: string;
  onConfirmPasswordChange?: (value: string) => void;
  onSubmit?: (data: {
    newPassword: string;
    confirmPassword: string;
  }) => void;
  /** Label for the submit button. Defaults to "Set password". */
  submitLabel?: string;
  /** Called when the secondary back button is clicked. Hidden when not provided. */
  onBack?: () => void;
  /** Label for the back button. Defaults to "Back to sign in". */
  backLabel?: string;
  isSubmitting?: boolean;
  error?: string;
  fieldErrors?: {
    newPassword?: string;
    confirmPassword?: string;
  };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function SetPasswordForm({
  newPassword = "",
  onNewPasswordChange,
  confirmPassword = "",
  onConfirmPasswordChange,
  onSubmit,
  submitLabel = "Set password",
  onBack,
  backLabel = "Back",
  isSubmitting = false,
  error,
  fieldErrors,
}: SetPasswordFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ newPassword, confirmPassword });
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
        <Field>
          <FieldLabel htmlFor="set-password">New password</FieldLabel>
          <PasswordInput
            id="set-password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange?.(e.target.value)}
            disabled={isSubmitting}
            required
            autoComplete="new-password"
            aria-invalid={!!fieldErrors?.newPassword}
          />
          <PasswordStrength password={newPassword} />
          {fieldErrors?.newPassword && <FieldError errors={[fieldErrors.newPassword]} />}
        </Field>
        <Field>
          <FieldLabel htmlFor="set-confirm">Confirm new password</FieldLabel>
          <PasswordInput
            id="set-confirm"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
            disabled={isSubmitting}
            required
            autoComplete="new-password"
            aria-invalid={!!fieldErrors?.confirmPassword}
          />
          {fieldErrors?.confirmPassword && (
            <FieldError errors={[fieldErrors.confirmPassword]} />
          )}
        </Field>
        <Field className="mt-section gap-section">
          <Button
            type="button"
            variant="outline"
            onClick={onBack ?? (() => window.history.back())}
            className="w-full"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            {backLabel}
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Spinner size="sm" className="text-current" /> : submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

export { SetPasswordForm };
