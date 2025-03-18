import { prisma } from './prisma';
import { OrderFormData, OrderItem, DoorStyle, Finish, GlassType, SizeParameter, Manufacturer } from '@/types';
import bcrypt from 'bcryptjs';

// User Services
export async function createUser(name: string, email: string, password: string, role: string = 'user') {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

export async function validatePassword(user: any, password: string) {
  return bcrypt.compare(password, user.password);
}

// Order Services
export async function createOrder(data: OrderFormData, userId: string) {
  const { items, ...orderData } = data;
  
  return prisma.order.create({
    data: {
      ...orderData,
      totalPrice: data.totalPrice,
      userId,
      items: {
        create: items.map(item => ({
          qty: item.qty,
          width: item.width,
          height: item.height,
          centerRail: item.centerRail,
          glass: item.glass,
          glassType: item.glassType,
          notes: item.notes || ''
        }))
      }
    },
    include: {
      items: true
    }
  });
}

export async function getOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true
    },
    orderBy: {
      orderDate: 'desc'
    }
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true
    }
  });
}

export async function updateOrder(id: string, data: Partial<OrderFormData>) {
  const { items, ...orderData } = data;
  
  // Update order data
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      ...orderData,
      totalPrice: data.totalPrice
    }
  });
  
  // If items are provided, update them
  if (items) {
    // Delete existing items
    await prisma.orderItem.deleteMany({
      where: { orderId: id }
    });
    
    // Create new items
    await Promise.all(items.map(item => 
      prisma.orderItem.create({
        data: {
          qty: item.qty,
          width: item.width,
          height: item.height,
          centerRail: item.centerRail,
          glass: item.glass,
          glassType: item.glassType,
          notes: item.notes || '',
          orderId: id
        }
      })
    ));
  }
  
  return getOrderById(id);
}

export async function deleteOrder(id: string) {
  return prisma.order.delete({
    where: { id }
  });
}

// Door Style Services
export async function getAllDoorStyles() {
  return prisma.doorStyle.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export async function createDoorStyle(data: DoorStyle) {
  return prisma.doorStyle.create({
    data
  });
}

export async function updateDoorStyle(id: string, data: Partial<DoorStyle>) {
  return prisma.doorStyle.update({
    where: { id },
    data
  });
}

export async function deleteDoorStyle(id: string) {
  return prisma.doorStyle.delete({
    where: { id }
  });
}

// Finish Services
export async function getAllFinishes() {
  return prisma.finish.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export async function createFinish(data: Finish) {
  return prisma.finish.create({
    data
  });
}

export async function updateFinish(id: string, data: Partial<Finish>) {
  return prisma.finish.update({
    where: { id },
    data
  });
}

export async function deleteFinish(id: string) {
  return prisma.finish.delete({
    where: { id }
  });
}

// Glass Type Services
export async function getAllGlassTypes() {
  return prisma.glassType.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export async function createGlassType(data: GlassType) {
  return prisma.glassType.create({
    data
  });
}

export async function updateGlassType(id: string, data: Partial<GlassType>) {
  return prisma.glassType.update({
    where: { id },
    data
  });
}

export async function deleteGlassType(id: string) {
  return prisma.glassType.delete({
    where: { id }
  });
}

// Size Parameter Services
export async function getAllSizeParameters() {
  return prisma.sizeParameter.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export async function createSizeParameter(data: SizeParameter) {
  return prisma.sizeParameter.create({
    data
  });
}

// Manufacturer Services
export async function getAllManufacturers() {
  return prisma.manufacturer.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export async function createManufacturer(data: Manufacturer) {
  return prisma.manufacturer.create({
    data
  });
}

export async function updateManufacturer(id: string, data: Partial<Manufacturer>) {
  return prisma.manufacturer.update({
    where: { id },
    data
  });
}

export async function deleteManufacturer(id: string) {
  return prisma.manufacturer.delete({
    where: { id }
  });
} 