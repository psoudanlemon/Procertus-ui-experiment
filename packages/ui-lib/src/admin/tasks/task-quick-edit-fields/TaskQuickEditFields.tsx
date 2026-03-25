/**
 * Presentational quick-edit fields for a task — UI only (form-field template).
 * Controlled title, description, optional status select. Submit/validation live in the parent.
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
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@procertus-ui/ui";

export type TaskStatusOption = { value: string; label: string };

export type TaskQuickEditFieldsProps = {
  className?: string;
  title: string;
  description?: string;
  taskTitleLabel: string;
  taskTitleId: string;
  taskTitleName: string;
  taskTitleValue: string;
  onTaskTitleChange: (value: string) => void;
  onTaskTitleBlur?: () => void;
  taskTitlePlaceholder?: string;
  taskTitleError?: string;
  taskTitleHelperText?: string;
  taskDescriptionLabel: string;
  taskDescriptionId: string;
  taskDescriptionName: string;
  taskDescriptionValue: string;
  onTaskDescriptionChange: (value: string) => void;
  taskDescriptionPlaceholder?: string;
  taskDescriptionError?: string;
  taskDescriptionHelperText?: string;
  statusLabel?: string;
  statusId?: string;
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: readonly TaskStatusOption[];
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export function TaskQuickEditFields({
  className,
  title,
  description,
  taskTitleLabel,
  taskTitleId,
  taskTitleName,
  taskTitleValue,
  onTaskTitleChange,
  onTaskTitleBlur,
  taskTitlePlaceholder,
  taskTitleError,
  taskTitleHelperText,
  taskDescriptionLabel,
  taskDescriptionId,
  taskDescriptionName,
  taskDescriptionValue,
  onTaskDescriptionChange,
  taskDescriptionPlaceholder,
  taskDescriptionError,
  taskDescriptionHelperText,
  statusLabel,
  statusId,
  statusValue,
  onStatusChange,
  statusOptions,
  submitLabel = "Save",
  cancelLabel,
  onSubmit,
  onCancel,
}: TaskQuickEditFieldsProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <Card className={cn("mx-auto w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={taskTitleId}>{taskTitleLabel}</Label>
            <Input
              id={taskTitleId}
              name={taskTitleName}
              type="text"
              placeholder={taskTitlePlaceholder}
              value={taskTitleValue}
              onChange={(e) => onTaskTitleChange(e.target.value)}
              onBlur={onTaskTitleBlur}
              aria-invalid={!!taskTitleError}
              aria-describedby={
                taskTitleError
                  ? `${taskTitleId}-error`
                  : taskTitleHelperText
                    ? `${taskTitleId}-helper`
                    : undefined
              }
            />
            {taskTitleError ? (
              <p id={`${taskTitleId}-error`} className="text-sm text-destructive" role="alert">
                {taskTitleError}
              </p>
            ) : taskTitleHelperText ? (
              <p id={`${taskTitleId}-helper`} className="text-sm text-muted-foreground">
                {taskTitleHelperText}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={taskDescriptionId}>{taskDescriptionLabel}</Label>
            <Textarea
              id={taskDescriptionId}
              name={taskDescriptionName}
              placeholder={taskDescriptionPlaceholder}
              value={taskDescriptionValue}
              onChange={(e) => onTaskDescriptionChange(e.target.value)}
              rows={4}
              aria-invalid={!!taskDescriptionError}
              aria-describedby={
                taskDescriptionError
                  ? `${taskDescriptionId}-error`
                  : taskDescriptionHelperText
                    ? `${taskDescriptionId}-helper`
                    : undefined
              }
            />
            {taskDescriptionError ? (
              <p
                id={`${taskDescriptionId}-error`}
                className="text-sm text-destructive"
                role="alert"
              >
                {taskDescriptionError}
              </p>
            ) : taskDescriptionHelperText ? (
              <p id={`${taskDescriptionId}-helper`} className="text-sm text-muted-foreground">
                {taskDescriptionHelperText}
              </p>
            ) : null}
          </div>

          {statusLabel &&
          statusId &&
          onStatusChange &&
          statusOptions &&
          statusOptions.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor={statusId}>{statusLabel}</Label>
              <Select value={statusValue} onValueChange={onStatusChange}>
                <SelectTrigger id={statusId} className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
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
