import { useCallback, useMemo, useState } from "react";

import { applyOrganizationProfileChange } from "./apply-organization-profile-change";
import { applyUserProfileChange } from "./apply-user-profile-change";
import {
  findPendingProfileChangeRequestForOrganization,
  findPendingProfileChangeRequestForUser,
} from "./profile-change-request-queries";
import {
  newChangeNoteId,
  newChangeRequestId,
  readProfileChangeRequestStore,
  writeProfileChangeRequestStore,
} from "./storage";
import type { ProfileChangeNoteAuthor, ProfileChangeRequest, ProfileChangeRequestStatus } from "./types";

export type CreateProfileChangeRequestInput = Omit<
  ProfileChangeRequest,
  "id" | "createdAt" | "updatedAt" | "status" | "notes"
> & {
  notes?: ProfileChangeRequest["notes"];
};

export type CreateProfileChangeRequestResult =
  | { ok: true; id: string }
  | { ok: false; reason: string };

const DUPLICATE_PENDING_REASON =
  "Er is al een openstaande wijzigingsaanvraag voor dit profiel. Wacht op validatie en acceptatie, of annuleer / wijs af voordat u een nieuwe indient.";

function nowIso(): string {
  return new Date().toISOString();
}

export function useProfileChangeRequests() {
  const [version, setVersion] = useState(0);
  const requests = useMemo(() => readProfileChangeRequestStore().requests, [version]);

  const persist = useCallback((next: ProfileChangeRequest[]) => {
    writeProfileChangeRequestStore({ requests: next });
    setVersion((v) => v + 1);
  }, []);

  const createRequest = useCallback(
    (input: CreateProfileChangeRequestInput): CreateProfileChangeRequestResult => {
      const current = readProfileChangeRequestStore().requests;
      if (input.kind === "user") {
        const uid = input.subjectUserId;
        if (!uid) return { ok: false, reason: DUPLICATE_PENDING_REASON };
        if (findPendingProfileChangeRequestForUser(current, uid)) {
          return { ok: false, reason: DUPLICATE_PENDING_REASON };
        }
      } else if (input.kind === "organization") {
        const oid = input.subjectOrganizationId;
        if (!oid) return { ok: false, reason: DUPLICATE_PENDING_REASON };
        if (findPendingProfileChangeRequestForOrganization(current, oid)) {
          return { ok: false, reason: DUPLICATE_PENDING_REASON };
        }
      }
      const ts = nowIso();
      const req: ProfileChangeRequest = {
        ...input,
        id: newChangeRequestId(),
        status: "submitted",
        createdAt: ts,
        updatedAt: ts,
        notes: input.notes ?? [],
      };
      persist([...current, req]);
      return { ok: true, id: req.id };
    },
    [persist],
  );

  const updateRequest = useCallback(
    (id: string, updater: (r: ProfileChangeRequest) => ProfileChangeRequest) => {
      const current = readProfileChangeRequestStore().requests;
      const next = current.map((r) => (r.id === id ? updater({ ...r, updatedAt: nowIso() }) : r));
      persist(next);
    },
    [persist],
  );

  const setStatus = useCallback(
    (id: string, status: ProfileChangeRequestStatus) => {
      if (status === "rejected" || status === "canceled") {
        const next = readProfileChangeRequestStore().requests.filter((r) => r.id !== id);
        persist(next);
        return;
      }
      updateRequest(id, (r) => ({ ...r, status }));
    },
    [persist, updateRequest],
  );

  const appendNote = useCallback(
    (id: string, author: ProfileChangeNoteAuthor, body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      updateRequest(id, (r) => ({
        ...r,
        notes: [...r.notes, { id: newChangeNoteId(), at: nowIso(), author, body: trimmed }],
      }));
    },
    [updateRequest],
  );

  const acceptAndApply = useCallback(
    (
      id: string,
      deps:
        | {
            kind: "user";
            patchProfile: Parameters<typeof applyUserProfileChange>[1]["patchProfile"];
            homeOrganizationId: string;
            representedOrganizationId: string;
          }
        | {
            kind: "organization";
            patchProfile: Parameters<typeof applyOrganizationProfileChange>[1]["patchProfile"];
            setOrgDemoAddressOverride: (organizationId: string, address: string) => void;
            organizationId: string;
          },
    ) => {
      const req = readProfileChangeRequestStore().requests.find((r) => r.id === id);
      if (!req || req.status !== "validated") return;
      if (req.kind === "user" && deps.kind === "user") {
        applyUserProfileChange(req.proposed as import("./types").UserProfileChangePayload, {
          patchProfile: deps.patchProfile,
          homeOrganizationId: deps.homeOrganizationId,
          representedOrganizationId: deps.representedOrganizationId,
        });
      } else if (req.kind === "organization" && deps.kind === "organization") {
        applyOrganizationProfileChange(req.proposed as import("./types").OrganizationProfileChangePayload, {
          organizationId: deps.organizationId,
          patchProfile: deps.patchProfile,
          setOrgDemoAddressOverride: deps.setOrgDemoAddressOverride,
        });
      } else {
        return;
      }
      const next = readProfileChangeRequestStore().requests.filter((r) => r.id !== id);
      persist(next);
    },
    [persist],
  );

  return {
    requests,
    createRequest,
    setStatus,
    appendNote,
    acceptAndApply,
  };
}
