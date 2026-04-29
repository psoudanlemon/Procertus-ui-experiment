import { CertificationRequestLifecycleTimeline } from "@procertus-ui/ui-certification";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
} from "@procertus-ui/ui";
import { useMemo, useState } from "react";

import { diffStringRecords } from "../../features/profile-change-requests/flatten";
import { labelForChangeField } from "../../features/profile-change-requests/field-labels";
import {
  PROFILE_CHANGE_STATUS_LABEL,
  profileChangeStatusToCertificationTimeline,
} from "../../features/profile-change-requests/lifecycle-map";
import type { ProfileChangeRequest } from "../../features/profile-change-requests/types";
import { isPendingProfileChangeStatus } from "../../features/profile-change-requests/types";

export type ProfileChangeRequestCardProps = {
  request: ProfileChangeRequest;
  onValidate: (id: string) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
  onAddNote: (id: string, author: "requester" | "processor", body: string) => void;
};

export function ProfileChangeRequestCard({
  request,
  onValidate,
  onAccept,
  onReject,
  onCancel,
  onAddNote,
}: ProfileChangeRequestCardProps) {
  const [noteRequester, setNoteRequester] = useState("");
  const [noteProcessor, setNoteProcessor] = useState("");
  const [showDiff, setShowDiff] = useState(false);

  const rows = useMemo(
    () => diffStringRecords(request.baseline as Record<string, string>, request.proposed as Record<string, string>),
    [request.baseline, request.proposed],
  );

  const pending = isPendingProfileChangeStatus(request.status);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{request.title}</CardTitle>
            <CardDescription>
              {request.kind === "user" ? "Gebruikersprofiel" : "Organisatieprofiel"} · {request.id.slice(0, 8)}… ·{" "}
              {new Date(request.createdAt).toLocaleString()}
            </CardDescription>
          </div>
          <Badge variant={pending ? "default" : "secondary"}>{PROFILE_CHANGE_STATUS_LABEL[request.status]}</Badge>
        </div>
        <CertificationRequestLifecycleTimeline
          status={profileChangeStatusToCertificationTimeline(request.status)}
          className="pt-2"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Button type="button" variant="ghost" size="sm" className="h-auto px-0" onClick={() => setShowDiff((s) => !s)}>
            {showDiff ? "Verberg" : "Toon"} gewijzigde velden ({rows.length})
          </Button>
          {showDiff ? (
            <div className="mt-2 overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 font-medium">Veld</th>
                    <th className="p-2 font-medium">Goedgekeurd (huidig)</th>
                    <th className="p-2 font-medium">Voorgesteld</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-t border-border">
                      <td className="p-2 align-top text-muted-foreground">{labelForChangeField(row.key)}</td>
                      <td className="p-2 align-top">{row.before || "—"}</td>
                      <td className="p-2 align-top font-medium">{row.after || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        {request.notes.length ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notities</p>
            <ul className="space-y-2 text-sm">
              {request.notes.map((n) => (
                <li key={n.id} className="rounded-md border border-border bg-muted/20 p-2">
                  <span className="text-xs text-muted-foreground">
                    {n.author === "requester" ? "Aanvrager" : "Verwerker"} · {new Date(n.at).toLocaleString()}
                  </span>
                  <p className="whitespace-pre-wrap pt-1">{n.body}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <p className="text-xs font-semibold text-muted-foreground">Notitie (aanvrager)</p>
            <Textarea value={noteRequester} onChange={(e) => setNoteRequester(e.target.value)} rows={2} />
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!pending}
              onClick={() => {
                onAddNote(request.id, "requester", noteRequester);
                setNoteRequester("");
              }}
            >
              Toevoegen
            </Button>
          </div>
          <div className="grid gap-2">
            <p className="text-xs font-semibold text-muted-foreground">Notitie (verwerker)</p>
            <Textarea value={noteProcessor} onChange={(e) => setNoteProcessor(e.target.value)} rows={2} />
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!pending}
              onClick={() => {
                onAddNote(request.id, "processor", noteProcessor);
                setNoteProcessor("");
              }}
            >
              Toevoegen
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          {request.status === "submitted" ? (
            <>
              <Button type="button" size="sm" onClick={() => onValidate(request.id)}>
                Valideren (verwerker)
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={() => onReject(request.id)}>
                Afwijzen
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => onCancel(request.id)}>
                Annuleren (aanvrager)
              </Button>
            </>
          ) : null}
          {request.status === "validated" ? (
            <>
              <Button type="button" size="sm" onClick={() => onAccept(request.id)}>
                Accepteren & doorvoeren
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={() => onReject(request.id)}>
                Afwijzen
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => onCancel(request.id)}>
                Annuleren (aanvrager)
              </Button>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
