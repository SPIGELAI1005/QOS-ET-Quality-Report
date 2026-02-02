/**
 * Complaint by ID API Route Handler
 * 
 * GET /api/complaints/[id] - Get single complaint
 * PATCH /api/complaints/[id] - Update complaint
 * DELETE /api/complaints/[id] - Delete complaint
 */

import { NextRequest, NextResponse } from "next/server";
import { getComplaintRepo } from "@/lib/repo";
import { getRequestContext } from "@/lib/api/context";
import { success, error, validationError, notFoundError, internalError } from "@/lib/api/response";
import { validateUpdateComplaint } from "@/lib/repo/validation";
import { z } from "zod";

/**
 * GET /api/complaints/[id]
 * 
 * Get a single complaint by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = getRequestContext(req);
    const repo = getComplaintRepo();
    const { id } = await params;

    const complaint = await repo.findById(id, context.userId, context.tenantId);

    if (!complaint) {
      return NextResponse.json(notFoundError("Complaint", id), { status: 404 });
    }

    // Security check: ensure user owns this complaint
    // Note: In a real implementation, the repository would filter by userId
    // This is a safety check
    // For now, we'll trust the repository scoping

    return NextResponse.json(success(complaint));
  } catch (err) {
    console.error("[API] GET /api/complaints/[id] error:", err);
    return NextResponse.json(
      internalError("Failed to fetch complaint", err instanceof Error ? err.message : undefined),
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/complaints/[id]
 * 
 * Update a complaint
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = getRequestContext(req);
    const repo = getComplaintRepo();
    const { id } = await params;

    // Check if complaint exists
    const existing = await repo.findById(id, context.userId, context.tenantId);
    if (!existing) {
      return NextResponse.json(notFoundError("Complaint", id), { status: 404 });
    }

    // Parse request body
    const body = await req.json();

    // Validate update input
    let validated;
    try {
      validated = validateUpdateComplaint(body);
    } catch (validationErr) {
      if (validationErr instanceof z.ZodError) {
        return NextResponse.json(
          validationError("Validation failed", validationErr.errors),
          { status: 400 }
        );
      }
      throw validationErr;
    }

    // Update complaint
    const updated = await repo.update(id, validated);

    return NextResponse.json(success(updated));
  } catch (err) {
    console.error("[API] PATCH /api/complaints/[id] error:", err);
    
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        validationError("Validation failed", err.errors),
        { status: 400 }
      );
    }

    return NextResponse.json(
      internalError("Failed to update complaint", err instanceof Error ? err.message : undefined),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/complaints/[id]
 * 
 * Delete a complaint
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = getRequestContext(req);
    const repo = getComplaintRepo();
    const { id } = await params;

    // Check if complaint exists
    const existing = await repo.findById(id, context.userId, context.tenantId);
    if (!existing) {
      return NextResponse.json(notFoundError("Complaint", id), { status: 404 });
    }

    // Delete complaint
    await repo.delete(id);

    return NextResponse.json(success({ id, deleted: true }), { status: 200 });
  } catch (err) {
    console.error("[API] DELETE /api/complaints/[id] error:", err);
    
    // Handle delete not implemented error (local backend)
    if (err instanceof Error && err.message.includes("not yet implemented")) {
      return NextResponse.json(
        error(
          "NOT_IMPLEMENTED",
          "Delete operation not supported with local backend. Use Postgres backend for full CRUD support.",
          { backend: "local" }
        ),
        { status: 501 }
      );
    }

    return NextResponse.json(
      internalError("Failed to delete complaint", err instanceof Error ? err.message : undefined),
      { status: 500 }
    );
  }
}
