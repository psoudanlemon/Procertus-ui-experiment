import * as React from "react";

// ---------------------------------------------------------------------------
// Strength calculation
// ---------------------------------------------------------------------------

export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export function calculateStrength(password: string): StrengthLevel {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return 1;
  if (score === 2) return 2;
  if (score === 3) return 3;
  return 4;
}

const strengthText: Record<StrengthLevel, { label: string; text: string }> = {
  0: { label: "", text: "" },
  1: { label: "Weak", text: "text-[var(--sys-destructive-500)]" },
  2: { label: "Fair", text: "text-[var(--sys-warning-600)]" },
  3: { label: "Good", text: "text-[var(--sys-info-600)]" },
  4: { label: "Strong", text: "text-[var(--sys-success-600)]" },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PasswordStrengthProps = {
  password: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function PasswordStrength({ password }: PasswordStrengthProps) {
  const level = calculateStrength(password);
  const { label, text } = strengthText[level];

  return (
    <p className="text-left text-xs leading-normal text-muted-foreground">
      {level === 0 ? (
        "Must be at least 8 characters"
      ) : (
        <>
          Password strength: <span className={`font-medium ${text}`}>{label}</span>
        </>
      )}
    </p>
  );
}

export { PasswordStrength };
