/**
 * Postgres Complaint Repository
 * 
 * Prisma-based implementation of IComplaintRepository
 */

import { prisma } from "@/lib/db/prisma";
import type {
  IComplaintRepository,
  CreateComplaintInput,
  UpdateComplaintInput,
} from "../types";
import type { Complaint as PrismaComplaint } from "@prisma/client";
import type { Complaint } from "@/lib/domain/types";
import { NotificationCategory } from "@/lib/domain/types";

/**
 * Convert Prisma model to domain Complaint
 */
function toComplaint(entity: PrismaComplaint): Complaint {
  return {
    id: entity.id,
    notificationNumber: entity.notificationNumber,
    notificationType: entity.notificationType as any,
    category: entity.category as NotificationCategory,
    plant: entity.plant,
    siteCode: entity.siteCode,
    siteName: entity.siteName ?? undefined,
    createdOn: entity.createdOn,
    defectiveParts: entity.defectiveParts,
    source: entity.source as any,
    unitOfMeasure: entity.unitOfMeasure ?? undefined,
    materialDescription: entity.materialDescription ?? undefined,
    materialNumber: entity.materialNumber ?? undefined,
    conversion: entity.conversionJson
      ? (JSON.parse(entity.conversionJson) as any)
      : undefined,
  };
}

/**
 * Postgres Complaint Repository Implementation
 */
export class PostgresComplaintRepository implements IComplaintRepository {
  async findAll(filters?: Record<string, any>): Promise<Complaint[]> {
    const where: any = {};
    
    // Security: Always scope by userId (required)
    if (filters?.userId) {
      where.userId = filters.userId;
    } else {
      // If no userId provided, return empty (security: no global access)
      return [];
    }
    
    // Scope by tenantId if provided
    if (filters?.tenantId) {
      where.tenantId = filters.tenantId;
    }
    
    // Apply additional filters
    if (filters?.plant) where.plant = filters.plant;
    if (filters?.siteCode) where.siteCode = filters.siteCode;
    if (filters?.notificationType) where.notificationType = filters.notificationType;
    if (filters?.category) where.category = filters.category;

    const entities = await prisma.complaint.findMany({
      where,
      orderBy: { createdOn: "desc" },
    });

    return entities.map(toComplaint);
  }

  async findById(id: string, userId?: string, tenantId?: string): Promise<Complaint | null> {
    const where: any = { id };
    
    // Security: Scope by userId if provided
    if (userId) {
      where.userId = userId;
    }
    if (tenantId) {
      where.tenantId = tenantId;
    }
    
    const entity = await prisma.complaint.findFirst({
      where,
    });

    return entity ? toComplaint(entity) : null;
  }

  async create(data: CreateComplaintInput): Promise<Complaint> {
    const entity = await prisma.complaint.create({
      data: {
        id: data.id,
        notificationNumber: data.notificationNumber,
        notificationType: data.notificationType,
        category: data.category,
        plant: data.plant,
        siteCode: data.siteCode,
        siteName: data.siteName,
        createdOn: data.createdOn,
        defectiveParts: data.defectiveParts,
        source: data.source,
        unitOfMeasure: data.unitOfMeasure,
        materialDescription: data.materialDescription,
        materialNumber: data.materialNumber,
        conversionJson: data.conversionJson,
        userId: data.userId,
        tenantId: data.tenantId,
      },
    });

    return toComplaint(entity);
  }

  async createMany(data: CreateComplaintInput[]): Promise<number> {
    if (data.length === 0) return 0;

    const result = await prisma.complaint.createMany({
      data: data.map((d) => ({
        id: d.id,
        notificationNumber: d.notificationNumber,
        notificationType: d.notificationType,
        category: d.category,
        plant: d.plant,
        siteCode: d.siteCode,
        siteName: d.siteName,
        createdOn: d.createdOn,
        defectiveParts: d.defectiveParts,
        source: d.source,
        unitOfMeasure: d.unitOfMeasure,
        materialDescription: d.materialDescription,
        materialNumber: d.materialNumber,
        conversionJson: d.conversionJson,
        userId: d.userId,
        tenantId: d.tenantId,
      })),
      skipDuplicates: true,
    });

    return result.count;
  }

  async update(id: string, data: UpdateComplaintInput): Promise<Complaint> {
    const updateData: any = {};

    if (data.notificationNumber !== undefined) updateData.notificationNumber = data.notificationNumber;
    if (data.notificationType !== undefined) updateData.notificationType = data.notificationType;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.plant !== undefined) updateData.plant = data.plant;
    if (data.siteCode !== undefined) updateData.siteCode = data.siteCode;
    if (data.siteName !== undefined) updateData.siteName = data.siteName;
    if (data.createdOn !== undefined) updateData.createdOn = data.createdOn;
    if (data.defectiveParts !== undefined) updateData.defectiveParts = data.defectiveParts;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.unitOfMeasure !== undefined) updateData.unitOfMeasure = data.unitOfMeasure;
    if (data.materialDescription !== undefined) updateData.materialDescription = data.materialDescription;
    if (data.materialNumber !== undefined) updateData.materialNumber = data.materialNumber;
    if (data.conversionJson !== undefined) updateData.conversionJson = data.conversionJson;

    updateData.updatedAt = new Date();

    const entity = await prisma.complaint.update({
      where: { id },
      data: updateData,
    });

    return toComplaint(entity);
  }

  async upsert(id: string, data: CreateComplaintInput): Promise<Complaint> {
    const entity = await prisma.complaint.upsert({
      where: { id },
      create: {
        id: data.id,
        notificationNumber: data.notificationNumber,
        notificationType: data.notificationType,
        category: data.category,
        plant: data.plant,
        siteCode: data.siteCode,
        siteName: data.siteName,
        createdOn: data.createdOn,
        defectiveParts: data.defectiveParts,
        source: data.source,
        unitOfMeasure: data.unitOfMeasure,
        materialDescription: data.materialDescription,
        materialNumber: data.materialNumber,
        conversionJson: data.conversionJson,
        userId: data.userId,
        tenantId: data.tenantId,
      },
      update: {
        notificationNumber: data.notificationNumber,
        notificationType: data.notificationType,
        category: data.category,
        plant: data.plant,
        siteCode: data.siteCode,
        siteName: data.siteName,
        createdOn: data.createdOn,
        defectiveParts: data.defectiveParts,
        source: data.source,
        unitOfMeasure: data.unitOfMeasure,
        materialDescription: data.materialDescription,
        materialNumber: data.materialNumber,
        conversionJson: data.conversionJson,
        updatedAt: new Date(),
      },
    });

    return toComplaint(entity);
  }

  async upsertMany(data: CreateComplaintInput[]): Promise<number> {
    if (data.length === 0) return 0;

    // Use transaction for batch upsert
    const results = await Promise.all(
      data.map((d) => this.upsert(d.id, d))
    );

    return results.length;
  }

  async delete(id: string): Promise<void> {
    await prisma.complaint.delete({
      where: { id },
    });
  }

  async count(filters?: Record<string, any>): Promise<number> {
    const where: any = {};

    // Security: Always scope by userId (required)
    if (filters?.userId) {
      where.userId = filters.userId;
    } else {
      // If no userId provided, return 0 (security: no global access)
      return 0;
    }
    
    // Scope by tenantId if provided
    if (filters?.tenantId) {
      where.tenantId = filters.tenantId;
    }
    
    // Apply additional filters
    if (filters?.plant) where.plant = filters.plant;
    if (filters?.siteCode) where.siteCode = filters.siteCode;
    if (filters?.notificationType) where.notificationType = filters.notificationType;
    if (filters?.category) where.category = filters.category;

    return prisma.complaint.count({ where });
  }

  async findByNotificationNumber(
    notificationNumber: string,
    plant?: string,
    userId?: string,
    tenantId?: string
  ): Promise<Complaint[]> {
    const where: any = { notificationNumber };
    if (plant) where.plant = plant;
    
    // Security: Scope by userId if provided
    if (userId) {
      where.userId = userId;
    } else {
      // If no userId provided, return empty (security: no global access)
      return [];
    }
    if (tenantId) {
      where.tenantId = tenantId;
    }

    const entities = await prisma.complaint.findMany({
      where,
      orderBy: { createdOn: "desc" },
    });

    return entities.map(toComplaint);
  }

  async findBySite(siteCode: string, userId?: string, tenantId?: string): Promise<Complaint[]> {
    const where: any = { siteCode };
    
    // Security: Scope by userId if provided
    if (userId) {
      where.userId = userId;
    } else {
      // If no userId provided, return empty (security: no global access)
      return [];
    }
    if (tenantId) {
      where.tenantId = tenantId;
    }
    
    const entities = await prisma.complaint.findMany({
      where,
      orderBy: { createdOn: "desc" },
    });

    return entities.map(toComplaint);
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string,
    tenantId?: string
  ): Promise<Complaint[]> {
    const where: any = {
      createdOn: {
        gte: startDate,
        lte: endDate,
      },
    };
    
    // Security: Scope by userId if provided
    if (userId) {
      where.userId = userId;
    } else {
      // If no userId provided, return empty (security: no global access)
      return [];
    }
    if (tenantId) {
      where.tenantId = tenantId;
    }
    
    const entities = await prisma.complaint.findMany({
      where,
      orderBy: { createdOn: "desc" },
    });

    return entities.map(toComplaint);
  }
}
