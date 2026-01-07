"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  getRoleLabel,
  ROLE_CHANGED_EVENT,
  ROLE_OPTIONS,
  ROLE_STORAGE_KEY,
  type RoleKey,
  verifyRolePassword,
} from "@/lib/auth/roles";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface RoleAccessDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  /**
   * When true, the user cannot dismiss the dialog without confirming a role.
   */
  forceChoice?: boolean;
  /**
   * Optional role to preset in the dialog (e.g., when chosen from a menu).
   */
  initialRole?: RoleKey;
  onClose?: () => void;
  onAuthenticated?: (role: RoleKey) => void;
}

export function RoleAccessDialog({
  open,
  title,
  description,
  forceChoice = true,
  initialRole,
  onClose,
  onAuthenticated,
}: RoleAccessDialogProps) {
  const { t } = useTranslation();
  const effectiveTitle = title ?? t.roleAccess.selectRole;
  const effectiveDescription = description ?? t.roleAccess.chooseRole;
  const [role, setRole] = useState<RoleKey>("reader");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedStoredRole, setHasLoadedStoredRole] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const requiresPassword = useMemo(() => role !== "reader", [role]);

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const storedRole = (localStorage.getItem(ROLE_STORAGE_KEY) as RoleKey | null) || "reader";
    setRole(initialRole ?? storedRole);
    setPassword("");
    setError(null);
    setHasLoadedStoredRole(true);
  }, [open, initialRole]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setPassword("");
  }, [role, open]);

  if (!open || !hasMounted) return null;

  const canClose = !forceChoice;
  const displayDescription = hasLoadedStoredRole
    ? effectiveDescription
    : t.common.loading;

  const handleConfirm = () => {
    setError(null);

    const isOk = verifyRolePassword(role, password);
    if (!isOk) {
      setError(t.roleAccess.wrongPassword);
      return;
    }

    localStorage.setItem(ROLE_STORAGE_KEY, role);
    window.dispatchEvent(new Event(ROLE_CHANGED_EVENT));
    onAuthenticated?.(role);
  };

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[1000] flex items-center justify-center",
        "bg-black/55 backdrop-blur-lg"
      )}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={() => {
        if (!canClose) return;
        onClose?.();
      }}
    >
      <div
        className="w-[92vw] max-w-md max-h-[85vh] overflow-auto"
        onMouseDown={(e) => {
          // prevent closing when clicking inside the dialog
          e.stopPropagation();
        }}
      >
        <Card className="border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">{effectiveTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">{displayDescription}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-select">{t.common.role}</Label>
              <Select value={role} onValueChange={(v: RoleKey) => setRole(v)}>
                <SelectTrigger id="role-select" className="h-10">
                  <SelectValue placeholder={t.common.reader} />
                </SelectTrigger>
                <SelectContent className="z-[2001]">
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {t.common[opt.value as "reader" | "editor" | "admin"]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t.common.select}: <span className="font-medium text-foreground">{t.common[role as "reader" | "editor" | "admin"]}</span>
              </p>
            </div>

            {requiresPassword && (
              <div className="space-y-2">
                <Label htmlFor="role-password">{t.roleAccess.requiresPassword}</Label>
                <Input
                  id="role-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={role === "admin" ? `${t.roleAccess.requiresPassword} (Admin)` : `${t.roleAccess.requiresPassword} (${t.common.editor})`}
                  autoFocus
                />
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              {canClose && (
                <Button variant="ghost" onClick={onClose}>
                  {t.common.cancel}
                </Button>
              )}
              <Button onClick={handleConfirm}>{t.common.continue}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>,
    document.body
  );
}


