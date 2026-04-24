import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";

/** Picker state for which mock user will receive the next `login()` call. */
export function useMockPrototypeUserSelection() {
  const { selectedUserId, setSelectedUserId, users } = useMockPrototypeAuthContext();
  const selectedUser =
    selectedUserId === null ? null : (users.find((u) => u.id === selectedUserId) ?? null);
  return { selectedUserId, setSelectedUserId, selectedUser };
}
