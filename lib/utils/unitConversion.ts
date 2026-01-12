/**
 * Client-side unit conversion utilities
 * These mirror the server-side conversion logic for use in the editor
 */

/**
 * Extract bottle size from material description (e.g., "600 ML" or "600ML")
 */
function extractBottleSizeFromDescription(description: string): number | null {
  if (!description) return null;
  
  const patterns = [
    /(\d+(?:\.\d+)?)\s*ml/i, // "600 ML" or "600.5 ML"
    /(\d+(?:\.\d+)?)ml/i,     // "600ML"
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) {
      const size = parseFloat(match[1]);
      if (!isNaN(size) && size > 0) {
        return size;
      }
    }
  }
  
  return null;
}

/**
 * Extract length from material description for M (meters) unit
 */
function extractLengthFromDescription(description: string): number | null {
  if (!description) return null;
  
  const patterns = [
    /L\s*(\d+(?:\.\d+)?)\s*MM/i,        // "L6100MM" or "L 6100MM"
    /L\s*(\d+(?:\.\d+)?)\s*M\b/i,        // "L6100M" (meters, not mm)
    /LENGTH\s*(\d+(?:\.\d+)?)\s*MM/i,    // "LENGTH 6100MM"
    /LEN\s*(\d+(?:\.\d+)?)\s*MM/i,       // "LEN 6100MM"
    /L\s*(\d{3,})\b/i,                   // "L6100" (assume mm if 3+ digits)
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) {
      const lengthValue = parseFloat(match[1]);
      if (!isNaN(lengthValue) && lengthValue > 0) {
        // If pattern contains "MM" or is 3+ digits without unit, assume mm and convert to m
        if (pattern.source.includes('MM') || (pattern.source.includes('\\d{3,}') && !pattern.source.includes('M\\b'))) {
          return lengthValue / 1000; // Convert mm to m
        } else {
          // Already in meters
          return lengthValue;
        }
      }
    }
  }
  
  return null;
}

/**
 * Extract area from material description for M2 (square meters) unit
 */
function extractAreaFromDescription(description: string): number | null {
  if (!description) return null;
  
  const patterns = [
    /W\s*(\d+(?:\.\d+)?)\s*MM\s*H\s*(\d+(?:\.\d+)?)\s*MM/i,  // "W1000MM H2000MM"
    /WIDTH\s*(\d+(?:\.\d+)?)\s*MM\s*HEIGHT\s*(\d+(?:\.\d+)?)\s*MM/i,  // "WIDTH 1000MM HEIGHT 2000MM"
    /(\d+(?:\.\d+)?)\s*MM\s*x\s*(\d+(?:\.\d+)?)\s*MM/i,      // "1000MM x 2000MM"
    /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*MM/i,           // "1000 x 2000MM"
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match.length >= 3) {
      const width = parseFloat(match[1]);
      const height = parseFloat(match[2]);
      if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
        // Convert mm to m and calculate area
        const widthM = width / 1000;
        const heightM = height / 1000;
        return widthM * heightM; // Area in m2
      }
    }
  }
  
  return null;
}

/**
 * Convert various units to PC (pieces) based on material description
 * Client-side version of the server-side conversion logic
 */
export function convertToPCClient(
  defectiveQuantity: number,
  unitOfMeasure: string | undefined,
  materialDescription: string | undefined
): { convertedValue: number; error?: string } | null {
  if (!unitOfMeasure || defectiveQuantity <= 0) {
    return null;
  }
  
  const unit = unitOfMeasure.toUpperCase().trim();
  
  // Handle ML (milliliters) - convert to PC based on bottle size
  if (unit === 'ML') {
    const bottleSize = materialDescription ? extractBottleSizeFromDescription(materialDescription) : null;
    
    if (!bottleSize || bottleSize <= 0) {
      return {
        convertedValue: defectiveQuantity,
        error: `Could not extract bottle size from material description. Please include bottle size (e.g., "600 ML").`,
      };
    }
    
    const convertedPC = defectiveQuantity / bottleSize;
    
    return {
      convertedValue: Math.round(convertedPC * 100) / 100, // Round to 2 decimal places
    };
  }
  
  // Handle M (meters) - convert to PC based on length per piece
  if (unit === 'M' || unit === 'METER' || unit === 'METERS') {
    const lengthPerPiece = materialDescription ? extractLengthFromDescription(materialDescription) : null;
    
    if (!lengthPerPiece || lengthPerPiece <= 0) {
      return {
        convertedValue: defectiveQuantity,
        error: `Could not extract length per piece from material description. Please include length (e.g., "L6100MM").`,
      };
    }
    
    // Convert: defectiveM / lengthPerPieceM = number of pieces
    const convertedPC = defectiveQuantity / lengthPerPiece;
    
    return {
      convertedValue: Math.round(convertedPC * 100) / 100, // Round to 2 decimal places
    };
  }
  
  // Handle M2 (square meters) - convert to PC based on area per piece
  if (unit === 'M2' || unit === 'M²' || unit === 'SQ M' || unit === 'SQ M2') {
    const areaPerPiece = materialDescription ? extractAreaFromDescription(materialDescription) : null;
    
    if (!areaPerPiece || areaPerPiece <= 0) {
      return {
        convertedValue: defectiveQuantity,
        error: `Could not extract area per piece from material description. Please include dimensions (e.g., "W1000MM H2000MM").`,
      };
    }
    
    // Convert: defectiveM2 / areaPerPieceM2 = number of pieces
    const convertedPC = defectiveQuantity / areaPerPiece;
    
    return {
      convertedValue: Math.round(convertedPC * 100) / 100, // Round to 2 decimal places
    };
  }
  
  // Unit not supported for conversion
  return null;
}

