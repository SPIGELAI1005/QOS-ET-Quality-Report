/**
 * Local Complaint Repository
 * 
 * Wraps existing IndexedDB logic as fallback backend.
 * Used when DATA_BACKEND=local or when Postgres is not configured.
 */

import type {
  IComplaintRepository,
  CreateComplaintInput,
  UpdateComplaintInput,
} from "../types";
import type { Complaint } from "@/lib/domain/types";
import { upsertComplaints, getAllComplaints } from "@/lib/data/datasets-idb";

/**
 * Convert domain Complaint to CreateComplaintInput
 */
function complaintToInput(complaint: Complaint): CreateComplaintInput {
  return {
    id: complaint.id,
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
    conversionJson: complaint.conversion
      ? JSON.stringify(complaint.conversion)
      : undefined,
  };
}

/**
 * Convert CreateComplaintInput to domain Complaint
 */
function inputToComplaint(input: CreateComplaintInput): Complaint {
  return {
    id: input.id,
    notificationNumber: input.notificationNumber,
    notificationType: input.notificationType as any,
    category: input.category as any,
    plant: input.plant,
    siteCode: input.siteCode,
    siteName: input.siteName,
    createdOn: input.createdOn,
    defectiveParts: input.defectiveParts,
    source: input.source as any,
    unitOfMeasure: input.unitOfMeasure,
    materialDescription: input.materialDescription,
    materialNumber: input.materialNumber,
    conversion: input.conversionJson
      ? JSON.parse(input.conversionJson)
      : undefined,
  };
}

/**
 * Local Complaint Repository Implementation
 * 
 * Wraps IndexedDB operations. Note: IndexedDB is async but doesn't support
 * all operations (like update/delete by ID easily), so we implement workarounds.
 */
export class LocalComplaintRepository implements IComplaintRepository {
  async findAll(filters?: Record<string, any>): Promise<Complaint[]> {
    const all = await getAllComplaints();

    if (!filters) return all;

    return all.filter((complaint) => {
      if (filters.plant && complaint.plant !== filters.plant) return false;
      if (filters.siteCode && complaint.siteCode !== filters.siteCode) return false;
      if (filters.notificationType && complaint.notificationType !== filters.notificationType) return false;
      if (filters.category && complaint.category !== filters.category) return false;
      return true;
    });
  }

  async findById(id: string, userId?: string, tenantId?: string): Promise<Complaint | null> {
    const all = await getAllComplaints();
    const found = all.find((c) => c.id === id) ?? null;
    
    // Note: Local backend doesn't have userId/tenantId in Complaint type
    // In a real migration, we'd need to add these fields to the domain type
    // For now, we return the complaint if found (local backend is less secure)
    return found;
  }

  async create(data: CreateComplaintInput): Promise<Complaint> {
    const complaint = inputToComplaint(data);
    await upsertComplaints([complaint]);
    return complaint;
  }

  async createMany(data: CreateComplaintInput[]): Promise<number> {
    if (data.length === 0) return 0;
    const complaints = data.map(inputToComplaint);
    await upsertComplaints(complaints);
    return complaints.length;
  }

  async update(id: string, data: UpdateComplaintInput): Promise<Complaint> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Complaint with id ${id} not found`);
    }

    const updated: Complaint = {
      ...existing,
      ...(data.notificationNumber !== undefined && { notificationNumber: data.notificationNumber }),
      ...(data.notificationType !== undefined && { notificationType: data.notificationType as any }),
      ...(data.category !== undefined && { category: data.category as any }),
      ...(data.plant !== undefined && { plant: data.plant }),
      ...(data.siteCode !== undefined && { siteCode: data.siteCode }),
      ...(data.siteName !== undefined && { siteName: data.siteName }),
      ...(data.createdOn !== undefined && { createdOn: data.createdOn }),
      ...(data.defectiveParts !== undefined && { defectiveParts: data.defectiveParts }),
      ...(data.source !== undefined && { source: data.source as any }),
      ...(data.unitOfMeasure !== undefined && { unitOfMeasure: data.unitOfMeasure }),
      ...(data.materialDescription !== undefined && { materialDescription: data.materialDescription }),
      ...(data.materialNumber !== undefined && { materialNumber: data.materialNumber }),
      ...(data.conversionJson !== undefined && {
        conversion: data.conversionJson ? JSON.parse(data.conversionJson) : undefined,
      }),
    };

    await upsertComplaints([updated]);
    return updated;
  }

  async upsert(id: string, data: CreateComplaintInput): Promise<Complaint> {
    // IndexedDB upsert is handled by put() operation
    const complaint = inputToComplaint({ ...data, id });
    await upsertComplaints([complaint]);
    return complaint;
  }

  async upsertMany(data: CreateComplaintInput[]): Promise<number> {
    if (data.length === 0) return 0;
    const complaints = data.map((d) => inputToComplaint(d));
    await upsertComplaints(complaints);
    return complaints.length;
  }

  async delete(id: string): Promise<void> {
    // IndexedDB doesn't have a direct delete in our current implementation
    // We'd need to add a delete function to datasets-idb.ts
    // For now, this is a limitation of the local backend
    throw new Error("Delete not yet implemented for local backend. Use Postgres backend for full CRUD support.");
  }

  async count(filters?: Record<string, any>): Promise<number> {
    const all = await this.findAll(filters);
    return all.length;
  }

  async findByNotificationNumber(
    notificationNumber: string,
    plant?: string,
    userId?: string,
    tenantId?: string
  ): Promise<Complaint[]> {
    const all = await getAllComplaints();
    return all.filter(
      (c) =>
        c.notificationNumber === notificationNumber &&
        (!plant || c.plant === plant)
    );
    // Note: Local backend doesn't have userId/tenantId in Complaint type
    // In a real migration, we'd need to add these fields
  }

  async findBySite(siteCode: string, userId?: string, tenantId?: string): Promise<Complaint[]> {
    return this.findAll({ siteCode });
    // Note: Local backend doesn't scope by userId/tenantId
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string,
    tenantId?: string
  ): Promise<Complaint[]> {
    const all = await getAllComplaints();
    return all.filter((c) => {
      const created = new Date(c.createdOn);
      return created >= startDate && created <= endDate;
    });
    // Note: Local backend doesn't scope by userId/tenantId
  }
}
