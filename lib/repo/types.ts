/**
 * Repository Interface Types
 * 
 * Defines common interfaces for repository pattern.
 * Allows switching between storage backends (Postgres, Local, etc.)
 */

import type { Complaint } from "@/lib/domain/types";

/**
 * Base repository interface for CRUD operations
 */
export interface IRepository<T, TCreate, TUpdate> {
  /**
   * Find all records (with optional filters)
   * Note: filters should include userId for security scoping
   */
  findAll(filters?: Record<string, any>): Promise<T[]>;

  /**
   * Find a single record by ID
   * Note: Should be scoped by userId for security
   */
  findById(id: string, userId?: string, tenantId?: string): Promise<T | null>;

  /**
   * Create a new record
   */
  create(data: TCreate): Promise<T>;

  /**
   * Create multiple records
   */
  createMany(data: TCreate[]): Promise<number>;

  /**
   * Update an existing record
   */
  update(id: string, data: TUpdate): Promise<T>;

  /**
   * Upsert (insert or update) a record
   */
  upsert(id: string, data: TCreate): Promise<T>;

  /**
   * Upsert multiple records
   */
  upsertMany(data: TCreate[]): Promise<number>;

  /**
   * Delete a record by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Count total records
   */
  count(filters?: Record<string, any>): Promise<number>;
}

/**
 * Complaint-specific repository interface
 */
export interface IComplaintRepository extends IRepository<
  Complaint,
  CreateComplaintInput,
  UpdateComplaintInput
> {
  /**
   * Find complaints by notification number
   * Note: Should be scoped by userId for security
   */
  findByNotificationNumber(
    notificationNumber: string,
    plant?: string,
    userId?: string,
    tenantId?: string
  ): Promise<Complaint[]>;

  /**
   * Find complaints by plant/site
   * Note: Should be scoped by userId for security
   */
  findBySite(siteCode: string, userId?: string, tenantId?: string): Promise<Complaint[]>;

  /**
   * Find complaints by date range
   * Note: Should be scoped by userId for security
   */
  findByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string,
    tenantId?: string
  ): Promise<Complaint[]>;
}

/**
 * Input types for Complaint operations
 */
export interface CreateComplaintInput {
  id: string;
  notificationNumber: string;
  notificationType: string;
  category: string;
  plant: string;
  siteCode: string;
  siteName?: string;
  createdOn: Date;
  defectiveParts: number;
  source: string;
  unitOfMeasure?: string;
  materialDescription?: string;
  materialNumber?: string;
  conversionJson?: string; // JSON stringified UnitConversion
  userId?: string; // For future multi-user support
  tenantId?: string; // For future multi-tenant support
}

export interface UpdateComplaintInput {
  notificationNumber?: string;
  notificationType?: string;
  category?: string;
  plant?: string;
  siteCode?: string;
  siteName?: string;
  createdOn?: Date;
  defectiveParts?: number;
  source?: string;
  unitOfMeasure?: string;
  materialDescription?: string;
  materialNumber?: string;
  conversionJson?: string;
}

/**
 * Database-backed Complaint entity (includes metadata)
 */
export interface ComplaintEntity extends Complaint {
  userId?: string;
  tenantId?: string;
  conversionJson?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
