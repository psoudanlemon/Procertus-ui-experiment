import * as React from "react";
import { CircleAlertIcon } from "lucide-react";

import {
  Alert,
  AlertDescription,
  Button,
  Checkbox,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Label,
  Spinner,
} from "@procertus-ui/ui";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AccountDetailsFormProps = {
  invitedEmail: string;
  firstName?: string;
  onFirstNameChange?: (value: string) => void;
  lastName?: string;
  onLastNameChange?: (value: string) => void;
  termsAccepted?: boolean;
  onTermsAcceptedChange?: (accepted: boolean) => void;
  showTermsCheckbox?: boolean;
  onSubmit?: (data: {
    firstName: string;
    lastName: string;
    termsAccepted: boolean;
  }) => void;
  isSubmitting?: boolean;
  error?: string;
  fieldErrors?: {
    firstName?: string;
    lastName?: string;
  };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function AccountDetailsForm({
  invitedEmail,
  firstName = "",
  onFirstNameChange,
  lastName = "",
  onLastNameChange,
  termsAccepted = false,
  onTermsAcceptedChange,
  showTermsCheckbox = true,
  onSubmit,
  isSubmitting = false,
  error,
  fieldErrors,
}: AccountDetailsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ firstName, lastName, termsAccepted });
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
        <Field>
          <FieldLabel htmlFor="invite-email">Email</FieldLabel>
          <Input
            id="invite-email"
            type="email"
            value={invitedEmail}
            disabled
            autoComplete="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="invite-first-name">First name</FieldLabel>
          <Input
            id="invite-first-name"
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => onFirstNameChange?.(e.target.value)}
            disabled={isSubmitting}
            required
            autoComplete="given-name"
            aria-invalid={!!fieldErrors?.firstName}
          />
          {fieldErrors?.firstName && <FieldError errors={[fieldErrors.firstName]} />}
        </Field>
        <Field>
          <FieldLabel htmlFor="invite-last-name">Last name</FieldLabel>
          <Input
            id="invite-last-name"
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => onLastNameChange?.(e.target.value)}
            disabled={isSubmitting}
            required
            autoComplete="family-name"
            aria-invalid={!!fieldErrors?.lastName}
          />
          {fieldErrors?.lastName && <FieldError errors={[fieldErrors.lastName]} />}
        </Field>
        {showTermsCheckbox && (
          <Field>
            <div className="flex items-start gap-2">
              <Checkbox
                id="invite-terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => onTermsAcceptedChange?.(checked === true)}
                disabled={isSubmitting}
              />
              <Label htmlFor="invite-terms" className="inline text-sm leading-normal font-normal">
                I agree to the{" "}
                <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">Privacy Policy</a>
              </Label>
            </div>
          </Field>
        )}
        <Field className="mt-3">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Spinner size="sm" /> : "Continue"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

export { AccountDetailsForm };
