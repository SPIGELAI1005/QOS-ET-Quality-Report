export type RoleKey = "reader" | "editor" | "admin";

export interface RoleOption {
  value: RoleKey;
  label: string;
  requiresPassword: boolean;
}

export const ROLE_OPTIONS: RoleOption[] = [
  { value: "reader", label: "Reader", requiresPassword: false },
  { value: "editor", label: "Editor", requiresPassword: true },
  { value: "admin", label: "Admin", requiresPassword: true },
];

export function getRoleLabel(role: RoleKey): string {
  if (role === "admin") return "Admin";
  if (role === "editor") return "Editor";
  return "Reader";
}

export function verifyRolePassword(role: RoleKey, password: string): boolean {
  if (role === "reader") return true;
  if (role === "admin") return password === "QOSET";
  if (role === "editor") return password === "Edit";
  return false;
}

export const ROLE_STORAGE_KEY = "qos-et-role";
export const ROLE_CHANGED_EVENT = "qos-et-role-changed";


