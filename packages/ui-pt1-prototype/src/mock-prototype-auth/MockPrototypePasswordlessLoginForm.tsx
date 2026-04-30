import * as React from "react";

import { Field, FieldDescription } from "@procertus-ui/ui";
import { LoginForm } from "@procertus-ui/ui-lib";

import { cn } from "../lib/utils";

import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";
import { MockPrototypeUserSelect } from "./MockPrototypeUserSelect";
import { PrototypeCard } from "./PrototypeCard";

export type MockPrototypePasswordlessLoginFormProps = {
  /** Called after the prototype session is established (`login` succeeded). */
  onLoggedIn?: () => void;
  /** Submit button label (passwordless). */
  submitLabel?: string;
  /** Optional wrapper class for spacing/layout. */
  className?: string;
  /**
   * Message when submit runs without a selected prototype user.
   * @default Dutch copy for the extranet prototype.
   */
  pickerRequiredMessage?: string;
  isSubmitting?: boolean;
};

/**
 * Passwordless-style login form plus the prototype user dropdown.
 * The email field stays in sync with the selected user; sign-in uses the picker selection.
 */
export function MockPrototypePasswordlessLoginForm({
  onLoggedIn,
  submitLabel,
  className,
  pickerRequiredMessage = "Kies een prototypegebruiker om verder te gaan.",
  isSubmitting = false,
}: MockPrototypePasswordlessLoginFormProps) {
  const { login, users, selectedUserId } = useMockPrototypeAuthContext();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (selectedUserId === null) {
      setEmail("");
      return;
    }
    const user = users.find((u) => u.id === selectedUserId);
    setEmail(user?.email ?? "");
  }, [selectedUserId, users]);

  return (
    <div className={cn("flex flex-col gap-section", className)}>
      <PrototypeCard title="Prototypegebruiker">
        <Field>
          <FieldDescription>
            Kies een demo-account; het e-mailveld hieronder wordt automatisch ingevuld.
          </FieldDescription>
          <MockPrototypeUserSelect
            id="mock-prototype-user-select"
            className="w-full"
            aria-label="Prototypegebruiker"
          />
        </Field>
      </PrototypeCard>

      <LoginForm
        variant="passwordless"
        submitLabel={submitLabel}
        email={email}
        onEmailChange={(value) => {
          setEmail(value);
          setError(undefined);
        }}
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={() => {
          if (selectedUserId === null) {
            setError(pickerRequiredMessage);
            return;
          }
          setError(undefined);
          login(selectedUserId);
          onLoggedIn?.();
        }}
      />
    </div>
  );
}
