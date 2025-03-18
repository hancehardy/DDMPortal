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
  selectedColor: string
): number => {
  if (!isValidItem(item)) return 0;
  
  const itemSqFt = (item.width * item.height * item.qty) / 144;
  if (isNaN(itemSqFt) || itemSqFt <= 0) return 0;

  const selectedFinish = finishes.find(finish => finish.name === selectedColor);
  const finishPrice = selectedFinish?.sqftPrice || 0;
  let totalPricePerSqFt = finishPrice;

  // Add glass price if glass is selected
  if (item.glass && item.glassType) {
    const selectedGlassType = glassTypes.find(glass => glass.name === item.glassType);
    const glassPrice = selectedGlassType?.sqftPrice || 0;
    totalPricePerSqFt += glassPrice;
  }

  return itemSqFt * totalPricePerSqFt;
};

/**
 * Calculate the total price of all order items
 */
export const calculateTotalPrice = (
  items: OrderItem[], 
  finishes: Finish[], 
  glassTypes: GlassType[],
  selectedColor: string
): number => {
  const validItems = items.filter(isValidItem);
  return validItems.reduce((total, item) => {
    return total + calculateItemPrice(item, finishes, glassTypes, selectedColor);
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