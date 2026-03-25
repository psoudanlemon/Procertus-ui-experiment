/**
 * Controlled fields for creating or editing a meeting — no validation beyond `aria-invalid`.
 */
import type { FormEvent } from "react";

import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Textarea,
} from "@procertus-ui/ui";

export type MeetingComposerFieldsProps = {
  className?: string;
  title: string;
  description?: string;
  titleFieldId: string;
  titleLabel: string;
  titleValue: string;
  onTitleChange: (value: string) => void;
  locationFieldId: string;
  locationLabel: string;
  locationValue: string;
  onLocationChange: (value: string) => void;
  startFieldId: string;
  startLabel: string;
  startValue: string;
  onStartChange: (value: string) => void;
  endFieldId: string;
  endLabel: string;
  endValue: string;
  onEndChange: (value: string) => void;
  allDayId: string;
  allDayLabel: string;
  allDay: boolean;
  onAllDayChange: (checked: boolean) => void;
  notesFieldId: string;
  notesLabel: string;
  notesValue: string;
  onNotesChange: (value: string) => void;
  notesPlaceholder?: string;
  titleError?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export function MeetingComposerFields({
  className,
  title,
  description,
  titleFieldId,
  titleLabel,
  titleValue,
  onTitleChange,
  locationFieldId,
  locationLabel,
  locationValue,
  onLocationChange,
  startFieldId,
  startLabel,
  startValue,
  onStartChange,
  endFieldId,
  endLabel,
  endValue,
  onEndChange,
  allDayId,
  allDayLabel,
  allDay,
  onAllDayChange,
  notesFieldId,
  notesLabel,
  notesValue,
  onNotesChange,
  notesPlaceholder,
  titleError,
  submitLabel = "Save meeting",
  cancelLabel,
  onSubmit,
  onCancel,
}: MeetingComposerFieldsProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <Card className={cn("mx-auto w-full max-w-lg", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={titleFieldId}>{titleLabel}</Label>
            <Input
              id={titleFieldId}
              name={titleFieldId}
              value={titleValue}
              onChange={(e) => onTitleChange(e.target.value)}
              aria-invalid={!!titleError}
              aria-describedby={titleError ? `${titleFieldId}-error` : undefined}
            />
            {titleError ? (
              <p id={`${titleFieldId}-error`} className="text-sm text-destructive" role="alert">
                {titleError}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor={locationFieldId}>{locationLabel}</Label>
            <Input
              id={locationFieldId}
              name={locationFieldId}
              value={locationValue}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Room, address, or video link"
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor={startFieldId}>{startLabel}</Label>
              <Input
                id={startFieldId}
                name={startFieldId}
                type="datetime-local"
                value={startValue}
                onChange={(e) => onStartChange(e.target.value)}
                disabled={allDay}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor={endFieldId}>{endLabel}</Label>
              <Input
                id={endFieldId}
                name={endFieldId}
                type="datetime-local"
                value={endValue}
                onChange={(e) => onEndChange(e.target.value)}
                disabled={allDay}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id={allDayId}
              checked={allDay}
              onCheckedChange={(v) => onAllDayChange(v === true)}
            />
            <Label htmlFor={allDayId} className="font-normal">
              {allDayLabel}
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor={notesFieldId}>{notesLabel}</Label>
            <Textarea
              id={notesFieldId}
              name={notesFieldId}
              value={notesValue}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder={notesPlaceholder}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-2 border-t bg-muted/20">
          {cancelLabel && onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
          ) : null}
          <Button type="submit">{submitLabel}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
