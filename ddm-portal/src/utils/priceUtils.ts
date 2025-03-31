import { OrderItem, Finish, GlassType } from '@/types';

/**
 * Check if an order item has valid dimensions
 */
export const isValidItem = (item: OrderItem): boolean => {
  return item.width > 0 && item.height > 0 && item.qty > 0;
};

/**
 * Calculate the price of a single order item
 */
export const calculateItemPrice = (
  item: OrderItem, 
  finishes: Finish[], 
  glassTypes: GlassType[],
  selectedColor: string,
  manufacturer?: string
): number => {
  if (!isValidItem(item)) return 0;
  
  const itemSqFt = (item.width * item.height * item.qty) / 144;
  if (isNaN(itemSqFt) || itemSqFt <= 0) return 0;

  // Debug logging for price calculation
  console.log('Price Calculation Debug:', {
    item,
    selectedColor,
    manufacturer,
    availableFinishes: finishes,
    itemSqFt
  });

  // Filter finish by both name and manufacturer if manufacturer is provided
  const selectedFinish = manufacturer 
    ? finishes.find(finish => finish.name === selectedColor && finish.manufacturer === manufacturer)
    : finishes.find(finish => finish.name === selectedColor);
  
  // Debug logging for finish selection
  console.log('Selected Finish:', selectedFinish);
  
  if (!selectedFinish && selectedColor) {
    console.warn(
      `No finish found for color "${selectedColor}"${manufacturer ? ` and manufacturer "${manufacturer}"` : ''}. Available finishes:`, 
      finishes
    );
  }
  
  const finishPrice = selectedFinish?.sqftPrice || 0;
  let totalPricePerSqFt = finishPrice;

  // Add glass price if glass is selected
  if (item.glass && item.glassType) {
    const selectedGlassType = glassTypes.find(glass => glass.name === item.glassType);
    const glassPrice = selectedGlassType?.sqftPrice || 0;
    totalPricePerSqFt += glassPrice;
    
    // Debug logging for glass price
    console.log('Glass Price:', {
      glassType: item.glassType,
      selectedGlassType,
      glassPrice
    });
  }

  const totalPrice = itemSqFt * totalPricePerSqFt;
  
  // Debug logging for final price
  console.log('Final Price Calculation:', {
    itemSqFt,
    totalPricePerSqFt,
    totalPrice
  });

  return totalPrice;
};

/**
 * Calculate the total price of all order items
 */
export const calculateTotalPrice = (
  items: OrderItem[], 
  finishes: Finish[], 
  glassTypes: GlassType[],
  selectedColor: string,
  manufacturer?: string
): number => {
  const validItems = items.filter(isValidItem);
  return validItems.reduce((total, item) => {
    return total + calculateItemPrice(item, finishes, glassTypes, selectedColor, manufacturer);
  }, 0);
};

/**
 * Calculate the total square footage of all order items
 */
export const calculateTotalSqFt = (items: OrderItem[]): number => {
  const validItems = items.filter(isValidItem);
  return validItems.reduce((total, item) => {
    const itemSqFt = (item.width * item.height * item.qty) / 144;
    return total + (isNaN(itemSqFt) ? 0 : itemSqFt);
  }, 0);
};

/**
 * Calculate the total number of items
 */
export const calculateTotalItems = (items: OrderItem[]): number => {
  const validItems = items.filter(isValidItem);
  return validItems.reduce((total, item) => total + item.qty, 0);
}; 