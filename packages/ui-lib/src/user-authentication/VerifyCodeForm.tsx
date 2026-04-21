import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
  Spinner,
} from "@procertus-ui/ui";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VerifyCodeFormProps = {
  email: string;
  code?: string;
  onCodeChange?: (value: string) => void;
  onSubmit?: (data: { code: string }) => void;
  onResendCode?: () => void;
  onBackToLogin?: () => void;
  isSubmitting?: boolean;
  isResending?: boolean;
  error?: string;
  fieldErrors?: {
    code?: string;
  };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function VerifyCodeForm({
  code = "",
  onCodeChange,
  onSubmit,
  onResendCode,
  onBackToLogin,
  isSubmitting = false,
  isResending = false,
  error,
  fieldErrors,
}: VerifyCodeFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ code });
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
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(val) => onCodeChange?.(val)}
              pattern={REGEXP_ONLY_DIGITS}
              disabled={isSubmitting}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {fieldErrors?.code && <FieldError errors={[fieldErrors.code]} />}
          {onResendCode && (
            <FieldDescription className="text-center">
              Didn't receive a code?{" "}
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={onResendCode}
                disabled={isResending}
                className="h-auto p-0"
              >
                {isResending ? "Sending..." : "Resend"}
              </Button>
            </FieldDescription>
          )}
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
            {isSubmitting ? <Spinner size="sm" className="text-current" /> : "Verify"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

export { VerifyCodeForm };
