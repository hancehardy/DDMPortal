'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

interface Product {
  id: string;
  name: string;
  type: 'doorStyle' | 'finish' | 'glassType' | 'manufacturer';
  active: boolean;
  description?: string;
  imageUrl?: string;
}

export default function AdminProductsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productType, setProductType] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    type: 'doorStyle',
    active: true,
    description: '',
    imageUrl: ''
  });

  // Debug auth state
  useEffect(() => {
    console.log('Auth Debug - Product Management:');
    console.log('User:', user);
    console.log('Is Admin:', isAdmin);
  }, [user, isAdmin]);

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/'); // Redirect non-admin users
    }
  }, [isAdmin, router]);
  
  // Load products (mock data for demo)
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        
        // In a real app, fetch from API:
        // const doorStyles = await fetch('/api/door-styles').then(res => res.json());
        // etc.
        
        // Mock data for demo
        const mockProducts: Product[] = [
          { id: '1', name: 'Shaker', type: 'doorStyle', active: true, description: 'Classic shaker style door' },
          { id: '2', name: 'Raised Panel', type: 'doorStyle', active: true, description: 'Traditional raised panel door' },
          { id: '3', name: 'Flat Panel', type: 'doorStyle', active: true, description: 'Modern flat panel door' },
          { id: '4', name: 'White', type: 'finish', active: true, description: 'Bright white finish' },
          { id: '5', name: 'Natural Oak', type: 'finish', active: true, description: 'Natural oak wood finish' },
          { id: '6', name: 'Ebony', type: 'finish', active: true, description: 'Dark black finish' },
          { id: '7', name: 'Clear', type: 'glassType', active: true, description: 'Standard clear glass' },
          { id: '8', name: 'Frosted', type: 'glassType', active: true, description: 'Privacy frosted glass' },
          { id: '9', name: 'Tinted', type: 'glassType', active: true, description: 'Lightly tinted glass' },
          { id: '10', name: 'DDM Cabinets', type: 'manufacturer', active: true, description: 'Our main supplier' },
          { id: '11', name: 'Quality Doors Inc', type: 'manufacturer', active: true, description: 'Premium cabinet door supplier' },
        ];
        
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);
  
  // Filter products based on search and type
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.description && product.description.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (productType) {
      result = result.filter(product => product.type === productType);
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, productType]);
  
  const handleToggleActive = (id: string) => {
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        return { ...product, active: !product.active };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    // In real app: await fetch(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify({ active: !currentActive }) })
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };
  
  const handleSaveEdit = () => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(product => {
      if (product.id === editingProduct.id) {
        return editingProduct;
      }
      return product;
    });
    
    setProducts(updatedProducts);
    setEditingProduct(null);
    // In real app: await fetch(`/api/products/${editingProduct.id}`, { method: 'PUT', body: JSON.stringify(editingProduct) })
  };
  
  const handleAddProduct = () => {
    const newId = (Math.max(...products.map(p => parseInt(p.id))) + 1).toString();
    const productToAdd = { ...newProduct, id: newId };
    
    setProducts([...products, productToAdd]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      type: 'doorStyle',
      active: true,
      description: '',
      imageUrl: ''
    });
    // In real app: await fetch('/api/products', { method: 'POST', body: JSON.stringify(newProduct) })
  };
  
  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>Debug info:</p>
            <p>User: {user ? JSON.stringify(user) : 'Not logged in'}</p>
            <p>isAdmin: {isAdmin ? 'true' : 'false'}</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Product Management</h1>
        
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Search</label>
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Product Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
            >
              <option value="">All Types</option>
              <option value="doorStyle">Door Styles</option>
              <option value="finish">Finishes</option>
              <option value="glassType">Glass Types</option>
              <option value="manufacturer">Manufacturers</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium"
            >
              Add New Product
            </button>
          </div>
        </div>
        
        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-xl text-gray-800">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-800">Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-800">Type</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-800">Description</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-800">Status</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {product.type === 'doorStyle' && 'Door Style'}
                      {product.type === 'finish' && 'Finish'}
                      {product.type === 'glassType' && 'Glass Type'}
                      {product.type === 'manufacturer' && 'Manufacturer'}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {product.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-sm font-medium
                        ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-700 hover:text-blue-900 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(product.id)}
                          className={product.active ? "text-red-600 hover:text-red-800 font-medium" : "text-green-600 hover:text-green-800 font-medium"}
                        >
                          {product.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Product</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full p-2 border rounded text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Type</label>
                  <select
                    value={editingProduct.type}
                    onChange={(e) => setEditingProduct({...editingProduct, type: e.target.value as any})}
                    className="w-full p-2 border rounded text-gray-800"
                    disabled
                  >
                    <option value="doorStyle">Door Style</option>
                    <option value="finish">Finish</option>
                    <option value="glassType">Glass Type</option>
                    <option value="manufacturer">Manufacturer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Description</label>
                  <textarea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="w-full p-2 border rounded text-gray-800"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Status</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.active}
                      onChange={(e) => setEditingProduct({...editingProduct, active: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-800">Active</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Product</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full p-2 border rounded text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Type</label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({...newProduct, type: e.target.value as any})}
                    className="w-full p-2 border rounded text-gray-800"
                  >
                    <option value="doorStyle">Door Style</option>
                    <option value="finish">Finish</option>
                    <option value="glassType">Glass Type</option>
                    <option value="manufacturer">Manufacturer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Description</label>
                  <textarea
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full p-2 border rounded text-gray-800"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Status</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newProduct.active}
                      onChange={(e) => setNewProduct({...newProduct, active: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-800">Active</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  disabled={!newProduct.name}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 