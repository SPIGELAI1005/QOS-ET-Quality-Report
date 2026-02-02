"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_COMPLAINT_COLUMN_MAPPING,
  DEFAULT_DELIVERY_COLUMN_MAPPING,
  type ComplaintColumnMapping,
  type DeliveryColumnMapping,
} from "@/lib/config/columnMappings";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [complaintMapping, setComplaintMapping] = useState<ComplaintColumnMapping>(
    DEFAULT_COMPLAINT_COLUMN_MAPPING
  );
  const [deliveryMapping, setDeliveryMapping] = useState<DeliveryColumnMapping>(
    DEFAULT_DELIVERY_COLUMN_MAPPING
  );
  const [saved, setSaved] = useState(false);

  const handleSaveMappings = () => {
    // TODO: Save to localStorage or backend
    // For now, just show confirmation
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    console.log("Column mappings:", { complaintMapping, deliveryMapping });
  };

  const updateComplaintMapping = (
    field: keyof ComplaintColumnMapping,
    value: string[]
  ) => {
    setComplaintMapping((prev) => ({ ...prev, [field]: value }));
  };

  const updateDeliveryMapping = (
    field: keyof DeliveryColumnMapping,
    value: string[]
  ) => {
    setDeliveryMapping((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.settings.title}</h2>
        <p className="text-muted-foreground">
          {t.settings.subtitle}
        </p>
      </div>

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai">{t.settings.aiConfigurationTab}</TabsTrigger>
          <TabsTrigger value="mappings">{t.settings.columnMappingsTab}</TabsTrigger>
          <TabsTrigger value="data">Data Migration</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.aiConfiguration}</CardTitle>
              <CardDescription>
                {t.settings.aiConfigurationDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">{t.settings.environmentVariablesRequired}</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li><code className="bg-background px-1 rounded">AI_API_KEY</code> - {t.settings.aiApiKeyDescription}</li>
                  <li><code className="bg-background px-1 rounded">AI_PROVIDER</code> - {t.settings.aiProviderDescription}</li>
                  <li><code className="bg-background px-1 rounded">AI_MODEL</code> - {t.settings.aiModelDescription}</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  {t.settings.apiKeyNote}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mappings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.columnMappings}</CardTitle>
              <CardDescription>
                {t.settings.columnMappingsDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-3">{t.settings.complaintFileMappings}</h4>
                  <div className="space-y-3">
                    {Object.entries(complaintMapping).map(([field, values]) => (
                      <div key={field} className="space-y-1">
                        <Label className="text-xs font-medium capitalize">
                          {field.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <Input
                          value={values.join(", ")}
                          onChange={(e) => {
                            const newValues = e.target.value
                              .split(",")
                              .map((v) => v.trim())
                              .filter((v) => v.length > 0);
                            updateComplaintMapping(field as keyof ComplaintColumnMapping, newValues);
                          }}
                          placeholder={t.settings.commaSeparatedColumnNames}
                          className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          {values.length} {t.settings.mappingsConfigured}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">{t.settings.deliveryFileMappings}</h4>
                  <div className="space-y-3">
                    {Object.entries(deliveryMapping).map(([field, values]) => (
                      <div key={field} className="space-y-1">
                        <Label className="text-xs font-medium capitalize">
                          {field.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <Input
                          value={Array.isArray(values) ? values.join(", ") : ""}
                          onChange={(e) => {
                            const newValues = e.target.value
                              .split(",")
                              .map((v) => v.trim())
                              .filter((v) => v.length > 0);
                            updateDeliveryMapping(field as keyof DeliveryColumnMapping, newValues);
                          }}
                          placeholder={t.settings.commaSeparatedColumnNames}
                          className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          {Array.isArray(values) ? values.length : 0} {t.settings.mappingsConfigured}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button onClick={handleSaveMappings}>
                    {saved ? t.settings.saved : t.settings.saveMappings}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setComplaintMapping(DEFAULT_COMPLAINT_COLUMN_MAPPING);
                      setDeliveryMapping(DEFAULT_DELIVERY_COLUMN_MAPPING);
                    }}
                  >
                    {t.settings.resetToDefaults}
                  </Button>
                  {saved && (
                    <span className="text-sm text-success">{t.settings.mappingsSaved}</span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {t.settings.mappingsNote}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <DataMigrationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Data Migration Tab Component
 * 
 * Allows importing local data (IndexedDB/localStorage) to server database
 */
function DataMigrationTab() {
  const [importing, setImporting] = useState(false);
  const [dryRunning, setDryRunning] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    imported: number;
    updated: number;
    skipped: number;
    errors: Array<{ index: number; id?: string; error: string }>;
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localCount, setLocalCount] = useState<number | null>(null);

  // Load local data count on mount
  useEffect(() => {
    async function loadLocalCount() {
      try {
        const { getAllComplaints } = await import("@/lib/data/datasets-idb");
        const complaints = await getAllComplaints();
        setLocalCount(complaints.length);
      } catch (err) {
        console.error("Failed to load local count:", err);
        setLocalCount(0);
      }
    }
    loadLocalCount();
  }, []);

  const handleDryRun = async () => {
    setDryRunning(true);
    setError(null);
    setResult(null);

    try {
      // Read from local storage (API route uses getComplaintRepo on the server)
      const { getAllComplaints } = await import("@/lib/data/datasets-idb");
      const { importComplaints } = await import("@/lib/api/complaints-import");

      const localComplaints = await getAllComplaints();
      
      if (localComplaints.length === 0) {
        setError("No local data found to import.");
        setDryRunning(false);
        return;
      }

      // Convert to CreateComplaintInput format
      const complaintInputs = localComplaints.map((c) => ({
        id: c.id,
        notificationNumber: c.notificationNumber,
        notificationType: c.notificationType,
        category: c.category,
        plant: c.plant,
        siteCode: c.siteCode,
        siteName: c.siteName,
        createdOn: c.createdOn,
        defectiveParts: c.defectiveParts,
        source: c.source,
        unitOfMeasure: c.unitOfMeasure,
        materialDescription: c.materialDescription,
        materialNumber: c.materialNumber,
        conversionJson: c.conversion ? JSON.stringify(c.conversion) : undefined,
      }));

      // Run dry run
      const dryRunResult = await importComplaints(complaintInputs, true);
      setResult(dryRunResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run dry run");
      console.error("Dry run error:", err);
    } finally {
      setDryRunning(false);
    }
  };

  const handleImport = async () => {
    if (!confirm("Are you sure you want to import local data to the server? This will upsert all local complaints.")) {
      return;
    }

    setImporting(true);
    setError(null);
    setResult(null);

    try {
      // Read from local storage
      const { getAllComplaints } = await import("@/lib/data/datasets-idb");
      const { importComplaints } = await import("@/lib/api/complaints-import");
      
      const localComplaints = await getAllComplaints();
      
      if (localComplaints.length === 0) {
        setError("No local data found to import.");
        setImporting(false);
        return;
      }

      // Convert to CreateComplaintInput format
      const complaintInputs = localComplaints.map((c) => ({
        id: c.id,
        notificationNumber: c.notificationNumber,
        notificationType: c.notificationType,
        category: c.category,
        plant: c.plant,
        siteCode: c.siteCode,
        siteName: c.siteName,
        createdOn: c.createdOn,
        defectiveParts: c.defectiveParts,
        source: c.source,
        unitOfMeasure: c.unitOfMeasure,
        materialDescription: c.materialDescription,
        materialNumber: c.materialNumber,
        conversionJson: c.conversion ? JSON.stringify(c.conversion) : undefined,
      }));

      // Import
      const importResult = await importComplaints(complaintInputs, false);
      setResult(importResult);
      
      // Refresh local count
      setLocalCount(localComplaints.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import data");
      console.error("Import error:", err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Migration</CardTitle>
        <CardDescription>
          Import existing local data (IndexedDB) to the server database. This is a one-time migration operation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Local Complaints:</span>
              <span className="text-sm">
                {localCount !== null ? localCount : "Loading..."}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {localCount !== null && localCount > 0
                ? `${localCount} complaint(s) found in local storage (IndexedDB)`
                : "No local data found"}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive font-medium">Error</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="rounded-lg border p-4 space-y-2">
            <p className="text-sm font-medium">
              {result.message || "Import completed"}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total:</span>{" "}
                <span className="font-medium">{result.total}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Imported:</span>{" "}
                <span className="font-medium text-green-600">{result.imported}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Updated:</span>{" "}
                <span className="font-medium text-blue-600">{result.updated}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Skipped:</span>{" "}
                <span className="font-medium text-orange-600">{result.skipped}</span>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">Errors:</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {result.errors.slice(0, 10).map((err, i) => (
                    <p key={i} className="text-xs text-destructive">
                      {err.id ? `ID ${err.id}: ` : `Index ${err.index}: `}
                      {err.error}
                    </p>
                  ))}
                  {result.errors.length > 10 && (
                    <p className="text-xs text-muted-foreground">
                      ... and {result.errors.length - 10} more errors
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button
            onClick={handleDryRun}
            disabled={dryRunning || importing || localCount === 0}
            variant="outline"
          >
            {dryRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Dry Run...
              </>
            ) : (
              "Dry Run (Preview)"
            )}
          </Button>
          <Button
            onClick={handleImport}
            disabled={importing || dryRunning || localCount === 0}
          >
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import to Server"
            )}
          </Button>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-900">
            <strong>Note:</strong> This operation will upsert complaints by ID. Existing records
            with the same ID will be updated. This is a one-time migration - you can run it
            multiple times safely (it will update existing records).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
