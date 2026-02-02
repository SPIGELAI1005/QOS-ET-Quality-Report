/**
 * Zod Validation Schemas for Repository Operations
 * 
 * Validates input data before repository operations
 */

import { z } from "zod";
import type { NotificationType, NotificationCategory, DataSource } from "@/lib/domain/types";

/**
 * Notification type enum schema
 */
const notificationTypeSchema = z.enum([
  "Q1",
  "Q2",
  "Q3",
  "D1",
  "D2",
  "D3",
  "P1",
  "P2",
  "P3",
  "Other",
]);

/**
 * Notification category enum schema
 */
const notificationCategorySchema = z.enum([
  "CustomerComplaint",
  "SupplierComplaint",
  "InternalComplaint",
  "Deviation",
  "PPAP",
]);

/**
 * Data source enum schema
 */
const dataSourceSchema = z.enum(["SAP_S4", "Manual", "Import"]);

/**
 * Unit conversion schema
 */
const unitConversionSchema = z.object({
  originalValue: z.number(),
  originalUnit: z.string(),
  convertedValue: z.number(),
  bottleSize: z.number().optional(),
  materialDescription: z.string().optional(),
  wasConverted: z.boolean(),
});

/**
 * Create Complaint validation schema
 */
export const createComplaintSchema = z.object({
  id: z.string().min(1, "ID is required"),
  notificationNumber: z.string().min(1, "Notification number is required"),
  notificationType: notificationTypeSchema,
  category: notificationCategorySchema,
  plant: z.string().min(1, "Plant is required"),
  siteCode: z.string().min(1, "Site code is required"),
  siteName: z.string().optional(),
  createdOn: z.coerce.date(),
  defectiveParts: z.number().min(0, "Defective parts must be >= 0"),
  source: dataSourceSchema,
  unitOfMeasure: z.string().optional(),
  materialDescription: z.string().optional(),
  materialNumber: z.string().optional(),
  conversionJson: z.string().optional(), // JSON stringified UnitConversion
  userId: z.string().optional(),
  tenantId: z.string().optional(),
});

/**
 * Update Complaint validation schema (all fields optional)
 */
export const updateComplaintSchema = z.object({
  notificationNumber: z.string().min(1).optional(),
  notificationType: notificationTypeSchema.optional(),
  category: notificationCategorySchema.optional(),
  plant: z.string().min(1).optional(),
  siteCode: z.string().min(1).optional(),
  siteName: z.string().optional().nullable(),
  createdOn: z.coerce.date().optional(),
  defectiveParts: z.number().min(0).optional(),
  source: dataSourceSchema.optional(),
  unitOfMeasure: z.string().optional().nullable(),
  materialDescription: z.string().optional().nullable(),
  materialNumber: z.string().optional().nullable(),
  conversionJson: z.string().optional().nullable(),
});

/**
 * Validate create complaint input
 */
export function validateCreateComplaint(
  data: unknown
): z.infer<typeof createComplaintSchema> {
  return createComplaintSchema.parse(data);
}

/**
 * Validate update complaint input
 */
export function validateUpdateComplaint(
  data: unknown
): z.infer<typeof updateComplaintSchema> {
  return updateComplaintSchema.parse(data);
}
