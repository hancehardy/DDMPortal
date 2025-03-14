import { DoorStyle, Finish, GlassType, SizeParameter } from '@/types';

// Function to fetch data from our JSON file
export async function fetchExcelData() {
  try {
    const response = await fetch('/data/all_sheets_structure.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Extract door styles from the DATA sheet
export function extractDoorStyles(data: any): DoorStyle[] {
  if (!data || !data.DATA || !data.DATA.sample_data) {
    return [];
  }

  const doorStyles: DoorStyle[] = [];
  const doorStylesSet = new Set<string>();

  // Extract unique door styles from the DATA sheet
  data.DATA.sample_data.forEach((row: any) => {
    if (row['Door Style'] && !doorStylesSet.has(row['Door Style'])) {
      doorStylesSet.add(row['Door Style']);
      doorStyles.push({
        name: row['Door Style'],
        available: true
      });
    }
  });

  return doorStyles;
}

// Extract finishes from the Finishes sheet
export function extractFinishes(data: any): Finish[] {
  if (!data || !data.Finishes || !data.Finishes.sample_data) {
    return [];
  }

  const finishes: Finish[] = [];
  const finishesSet = new Set<string>();

  // Extract unique finishes
  data.Finishes.sample_data.forEach((row: any) => {
    if (row['Unnamed: 0'] && !finishesSet.has(row['Unnamed: 0'])) {
      finishesSet.add(row['Unnamed: 0']);
      finishes.push({
        name: row['Unnamed: 0'],
        manufacturer: 'Unknown' // Default value, update if manufacturer info is available
      });
    }
  });

  return finishes;
}

// Extract glass types from the DATA sheet
export function extractGlassTypes(data: any): GlassType[] {
  if (!data || !data.DATA || !data.DATA.sample_data) {
    return [];
  }

  const glassTypes: GlassType[] = [];
  const glassTypesSet = new Set<string>();

  // Extract unique glass types
  data.DATA.sample_data.forEach((row: any) => {
    if (row['Door Glass Types'] && !glassTypesSet.has(row['Door Glass Types'])) {
      glassTypesSet.add(row['Door Glass Types']);
      glassTypes.push({
        name: row['Door Glass Types'],
        sqftPrice: parseFloat(row['sqft price']) || 0,
        sqftMinimum: parseFloat(row['sqft minimum']) || 0
      });
    }
  });

  return glassTypes;
}

// Extract size parameters from the Size Parameters sheet
export function extractSizeParameters(data: any): SizeParameter[] {
  if (!data || !data['Size Parameters'] || !data['Size Parameters'].sample_data) {
    return [];
  }

  const sizeParameters: SizeParameter[] = [];

  // Extract size parameters
  data['Size Parameters'].sample_data.forEach((row: any) => {
    if (row['Size Parameters']) {
      sizeParameters.push({
        name: row['Size Parameters'],
        inches: parseFloat(row['Inches']) || 0,
        mm: parseFloat(row['MM']) || 0
      });
    }
  });

  return sizeParameters;
} 