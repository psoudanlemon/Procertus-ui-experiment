import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@procertus-ui/ui";

import { useMockPrototypeUsers } from "./useMockPrototypeUsers";
import { useMockPrototypeUserSelection } from "./useMockPrototypeUserSelection";

export type MockPrototypeUserSelectProps = {
  className?: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
};

/**
 * Dropdown of app-defined prototype users. Updates picker state consumed by `useMockPrototypeLogin`.
 */
export function MockPrototypeUserSelect({
  className,
  disabled,
  id,
  "aria-label": ariaLabel = "Prototype user",
}: MockPrototypeUserSelectProps) {
  const users = useMockPrototypeUsers();
  const { selectedUserId, setSelectedUserId } = useMockPrototypeUserSelection();

  return (
    <Select
      value={selectedUserId ?? undefined}
      onValueChange={(value) => setSelectedUserId(value)}
      disabled={disabled ?? users.length === 0}
    >
      <SelectTrigger id={id} className={className} aria-label={ariaLabel}>
        <SelectValue placeholder="Choose a prototype user" />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.displayName} — {user.homeOrganization.name} / {user.representedOrganization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
