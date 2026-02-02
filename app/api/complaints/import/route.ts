/**
 * Complaints Import API Route Handler
 * 
 * POST /api/complaints/import - Import complaints from local storage
 * 
 * Supports dry run mode via ?dryRun=true query parameter
 */

import { NextRequest, NextResponse } from "next/server";
import { getComplaintRepo } from "@/lib/repo";
import { getRequestContext } from "@/lib/api/context";
import { success, error, validationError, internalError } from "@/lib/api/response";
import { validateCreateComplaint, createComplaintSchema } from "@/lib/repo/validation";
import { z } from "zod";

/**
 * Import request body schema
 */
const importRequestSchema = z.object({
  complaints: z.array(createComplaintSchema),
});

export interface ImportResult {
  total: number;
  imported: number; // New records
  updated: number; // Existing records updated
  skipped: number; // Records skipped (validation errors, duplicates, etc.)
  errors: Array<{
    index: number;
    id?: string;
    error: string;
  }>;
}

/**
 * POST /api/complaints/import
 * 
 * Import complaints from local storage to database
 * 
 * Query params:
 * - dryRun: if "true", only validates and returns what would happen (no actual import)
 */
export async function POST(req: NextRequest) {
  try {
    const context = getRequestContext(req);
    const repo = getComplaintRepo();

    // Check for dry run mode
    const { searchParams } = new URL(req.url);
    const isDryRun = searchParams.get("dryRun") === "true";

    // Parse request body
    const body = await req.json();

    // Validate request
    const validated = importRequestSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        validationError("Invalid import request", validated.error.errors),
        { status: 400 }
      );
    }

    const { complaints } = validated.data;

    // Ensure all complaints have userId/tenantId from context
    const complaintsWithContext = complaints.map((c) => ({
      ...c,
      userId: c.userId || context.userId,
      tenantId: c.tenantId || context.tenantId,
    }));

    const result: ImportResult = {
      total: complaintsWithContext.length,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    if (isDryRun) {
      // Dry run: validate and check what would happen
      for (let i = 0; i < complaintsWithContext.length; i++) {
        const complaint = complaintsWithContext[i];
        try {
          // Validate the complaint
          validateCreateComplaint(complaint);

          // Check if it exists
          const existing = await repo.findById(complaint.id, context.userId, context.tenantId);
          if (existing) {
            result.updated++;
          } else {
            result.imported++;
          }
        } catch (err) {
          result.skipped++;
          result.errors.push({
            index: i,
            id: complaint.id,
            error: err instanceof Error ? err.message : "Validation error",
          });
        }
      }

      return NextResponse.json(
        success({
          dryRun: true,
          ...result,
          message: `Dry run complete. Would import ${result.imported} new, update ${result.updated} existing, skip ${result.skipped}.`,
        })
      );
    }

    // Actual import: upsert each complaint
    for (let i = 0; i < complaintsWithContext.length; i++) {
      const complaint = complaintsWithContext[i];
      try {
        // Validate
        validateCreateComplaint(complaint);

        // Check if exists
        const existing = await repo.findById(complaint.id, context.userId, context.tenantId);

        if (existing) {
          // Update existing
          await repo.update(complaint.id, {
            notificationNumber: complaint.notificationNumber,
            notificationType: complaint.notificationType,
            category: complaint.category,
            plant: complaint.plant,
            siteCode: complaint.siteCode,
            siteName: complaint.siteName,
            createdOn: complaint.createdOn,
            defectiveParts: complaint.defectiveParts,
            source: complaint.source,
            unitOfMeasure: complaint.unitOfMeasure,
            materialDescription: complaint.materialDescription,
            materialNumber: complaint.materialNumber,
            conversionJson: complaint.conversionJson,
          });
          result.updated++;
        } else {
          // Create new
          await repo.create(complaint);
          result.imported++;
        }
      } catch (err) {
        result.skipped++;
        result.errors.push({
          index: i,
          id: complaint.id,
          error: err instanceof Error ? err.message : "Import error",
        });
      }
    }

    return NextResponse.json(
      success({
        dryRun: false,
        ...result,
        message: `Import complete. Imported ${result.imported} new, updated ${result.updated} existing, skipped ${result.skipped}.`,
      })
    );
  } catch (err) {
    console.error("[API] POST /api/complaints/import error:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        validationError("Validation failed", err.errors),
        { status: 400 }
      );
    }

    return NextResponse.json(
      internalError("Failed to import complaints", err instanceof Error ? err.message : undefined),
      { status: 500 }
    );
  }
}
