/**
 * Demo model: profile edits in Prosdeptis go through a change request instead of applying immediately.
 * Persisted in localStorage (see storage.ts).
 */

export type ProfileChangeRequestStatus = "submitted" | "validated" | "accepted" | "rejected" | "canceled";

export type ProfileChangeRequestKind = "user" | "organization";

export type ProfileChangeNoteAuthor = "requester" | "processor";

export type ProfileChangeNote = {
  id: string;
  at: string;
  author: ProfileChangeNoteAuthor;
  body: string;
};

/** Flat snapshot for diff / persistence (all string values). */
export type UserProfileChangePayload = Record<string, string>;

/** Flat form fields plus organization id (stored on request root too). */
export type OrganizationProfileChangePayload = Record<string, string>;

export type ProfileChangeRequest = {
  id: string;
  kind: ProfileChangeRequestKind;
  /** Mock user id (session user) for user-profile changes. */
  subjectUserId?: string;
  /** Active organization id for org-profile changes. */
  subjectOrganizationId?: string;
  status: ProfileChangeRequestStatus;
  createdAt: string;
  updatedAt: string;
  title: string;
  baseline: UserProfileChangePayload | OrganizationProfileChangePayload;
  proposed: UserProfileChangePayload | OrganizationProfileChangePayload;
  notes: ProfileChangeNote[];
};

export type ProfileChangeRequestStore = {
  requests: ProfileChangeRequest[];
};

export function isTerminalProfileChangeStatus(s: ProfileChangeRequestStatus): boolean {
  return s === "accepted" || s === "rejected" || s === "canceled";
}

export function isPendingProfileChangeStatus(s: ProfileChangeRequestStatus): boolean {
  return s === "submitted" || s === "validated";
}
