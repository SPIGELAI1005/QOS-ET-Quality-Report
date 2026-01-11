/**
 * I AM Q Knowledge Base
 * 
 * Extracted from the FAQ/Glossary to ensure consistent definitions across the app.
 * This is the single source of truth for key terms used by I AM Q.
 */

/**
 * Core quality management definitions
 * These match the exact wording from the Glossary page
 */
export const KNOWLEDGE_BASE = {
  ppm: {
    term: "PPM (Parts Per Million)",
    definition: "Quality metric: (Defective Parts / Total Deliveries) × 1,000,000. Lower is better.",
  },
  customerPpm: {
    term: "Customer PPM",
    definition: "PPM computed from Q1 defective parts and customer deliveries (Outbound).",
  },
  supplierPpm: {
    term: "Supplier PPM",
    definition: "PPM computed from Q2 defective parts and supplier deliveries (Inbound).",
  },
  q1: {
    term: "Q1 (Customer Complaint)",
    definition: "Customer-originated quality notifications; contributes to customer complaints and Customer PPM.",
  },
  q2: {
    term: "Q2 (Supplier Complaint)",
    definition: "Supplier-related quality notifications; contributes to supplier complaints and Supplier PPM.",
  },
  q3: {
    term: "Q3 (Internal Complaint)",
    definition: "Internal quality notifications; used in internal complaint reporting (e.g., Poor Quality Costs placeholders).",
  },
  defectiveParts: {
    term: "Defective Parts",
    definition: "Quantity of non-conforming parts recorded in a notification. Used in PPM.",
  },
  deliveries: {
    term: "Deliveries",
    definition: "Total delivered quantity used as PPM denominator (customer outbound / supplier inbound).",
  },
  plant: {
    term: "Site / Plant Code",
    definition: "3-digit code identifying a manufacturing site (e.g., 145, 235, 410). Displayed with city/location when available.",
  },
  datasetHealth: {
    term: "Dataset Health",
    definition: "Live status from Upload History. A dataset is considered stale after a period of inactivity. Missing uploads can cause charts/metrics to show zero or placeholder values.",
  },
} as const;

/**
 * Get a condensed knowledge block for the system prompt
 * Only includes the most essential "load-bearing" definitions
 */
export function getKnowledgeBlock(): string {
  return `KNOWLEDGE BASE (use these exact definitions when answering questions):

- PPM (Parts Per Million): Quality metric: (Defective Parts / Total Deliveries) × 1,000,000. Lower is better.
- Customer PPM: PPM computed from Q1 defective parts and customer deliveries (Outbound).
- Supplier PPM: PPM computed from Q2 defective parts and supplier deliveries (Inbound).
- Q1 (Customer Complaint): Customer-originated quality notifications; contributes to customer complaints and Customer PPM.
- Q2 (Supplier Complaint): Supplier-related quality notifications; contributes to supplier complaints and Supplier PPM.
- Q3 (Internal Complaint): Internal quality notifications; used in internal complaint reporting.
- Defective Parts: Quantity of non-conforming parts recorded in a notification. Used in PPM.
- Deliveries: Total delivered quantity used as PPM denominator (customer outbound / supplier inbound).
- Plant/Site Code: 3-digit code identifying a manufacturing site (e.g., 145, 235, 410). Displayed with city/location when available.
- Dataset Health: Missing uploads can cause charts/metrics to show zero or placeholder values. Check Upload History for data freshness.`;
}

