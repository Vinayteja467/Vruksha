import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Search, X, Check, AlertCircle, Upload } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/client';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const { addToast } = useToast();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      addToast('Image size should be less than 8MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize dimensions (max 1000px width/height for fast web loading)
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1000;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setEditingProduct((prev) => ({
          ...prev,
          images: [optimizedDataUrl]
        }));
        addToast('Product image uploaded successfully!', 'success');
      };
      img.onerror = () => {
        setEditingProduct((prev) => ({
          ...prev,
          images: [event.target.result]
        }));
        addToast('Product image uploaded successfully!', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const emptyProduct = {
    name: '',
    slug: '',
    category: 'Vegetable Products',
    categorySlug: 'vegetable-products',
    price: 49,
    originalPrice: 69,
    stock: 100,
    sku: '',
    shortDescription: '',
    description: '',
    ingredients: '',
    usage: '',
    storage: 'Store in an airtight container in a cool, dry place.',
    images: [],
    sizes: [
      { size: '100g', price: 49, originalPrice: 69, inStock: true }
    ]
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.get('/products');
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct({ ...emptyProduct, id: null });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    const basePrice = Number(p.price) || 49;
    const baseOriginal = Number(p.originalPrice) || Math.round(basePrice * 1.25);
    const existingSizes = (p.sizes && p.sizes.length > 0)
      ? p.sizes.map((s, idx) => ({
          size: s.size,
          price: idx === 0 ? basePrice : Number(s.price),
          originalPrice: idx === 0 ? baseOriginal : Number(s.originalPrice || s.price * 1.25),
          inStock: s.inStock !== false
        }))
      : [{ size: '100g', price: basePrice, originalPrice: baseOriginal, inStock: true }];

    setEditingProduct({
      ...p,
      price: basePrice,
      originalPrice: baseOriginal,
      sizes: existingSizes
    });
    setShowModal(true);
  };

  const handlePriceChange = (newPrice) => {
    const priceNum = Number(newPrice);
    setEditingProduct((prev) => {
      const origNum = prev.originalPrice > priceNum ? prev.originalPrice : Math.round(priceNum * 1.25);
      const updatedSizes = (prev.sizes || []).map((s, idx) => {
        if (idx === 0) {
          return { ...s, price: priceNum, originalPrice: origNum };
        }
        return s;
      });
      if (updatedSizes.length === 0) {
        updatedSizes.push({ size: '100g', price: priceNum, originalPrice: origNum, inStock: true });
      }
      return {
        ...prev,
        price: priceNum,
        originalPrice: origNum,
        sizes: updatedSizes
      };
    });
  };

  const handleOriginalPriceChange = (newOrig) => {
    const origNum = Number(newOrig);
    setEditingProduct((prev) => {
      const updatedSizes = (prev.sizes || []).map((s, idx) => {
        if (idx === 0) {
          return { ...s, originalPrice: origNum };
        }
        return s;
      });
      return {
        ...prev,
        originalPrice: origNum,
        sizes: updatedSizes
      };
    });
  };

  const handleSizeVariantChange = (index, field, value) => {
    setEditingProduct((prev) => {
      const updatedSizes = [...(prev.sizes || [])];
      const current = { ...updatedSizes[index] };
      if (field === 'price' || field === 'originalPrice') {
        current[field] = Number(value);
      } else {
        current[field] = value;
      }
      updatedSizes[index] = current;

      const updates = { sizes: updatedSizes };
      if (index === 0 && field === 'price') {
        updates.price = Number(value);
      }
      if (index === 0 && field === 'originalPrice') {
        updates.originalPrice = Number(value);
      }
      return { ...prev, ...updates };
    });
  };

  const handleAddSizeVariant = () => {
    setEditingProduct((prev) => {
      const currentSizes = prev.sizes || [];
      const defaultSizes = ['100g', '250g', '500g', '1kg'];
      const nextSize = defaultSizes.find((s) => !currentSizes.some((cs) => cs.size === s)) || `${(currentSizes.length + 1) * 100}g`;
      const multiplier = currentSizes.length + 1;
      const newPrice = Math.round(Number(prev.price) * multiplier * 0.9);
      const newOrig = Math.round(newPrice * 1.25);

      return {
        ...prev,
        sizes: [
          ...currentSizes,
          { size: nextSize, price: newPrice, originalPrice: newOrig, inStock: true }
        ]
      };
    });
  };

  const handleRemoveSizeVariant = (index) => {
    setEditingProduct((prev) => {
      if ((prev.sizes || []).length <= 1) {
        addToast('At least one size variant is required', 'error');
        return prev;
      }
      return {
        ...prev,
        sizes: prev.sizes.filter((_, idx) => idx !== index)
      };
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const priceNum = Number(editingProduct.price);
      const originalPriceNum = Number(editingProduct.originalPrice) || Math.round(priceNum * 1.25);
      const sanitizedSizes = (editingProduct.sizes && editingProduct.sizes.length > 0)
        ? editingProduct.sizes.map((s, idx) => ({
            size: s.size || (idx === 0 ? '100g' : `${(idx + 1) * 100}g`),
            price: idx === 0 ? priceNum : Number(s.price),
            originalPrice: idx === 0 ? originalPriceNum : Number(s.originalPrice || s.price * 1.25),
            inStock: s.inStock !== false
          }))
        : [{ size: '100g', price: priceNum, originalPrice: originalPriceNum, inStock: true }];

      const payload = {
        ...editingProduct,
        price: priceNum,
        originalPrice: originalPriceNum,
        sizes: sanitizedSizes
      };

      if (editingProduct.id) {
        // Update
        const res = await api.put(`/products/${editingProduct.id}`, payload);
        if (res.success) {
          addToast(`Updated product: ${editingProduct.name}`, 'success');
        }
      } else {
        // Create
        const res = await api.post('/products', payload);
        if (res.success) {
          addToast(`Created product: ${editingProduct.name}`, 'success');
        }
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      addToast(err.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.success) {
        addToast('Product removed successfully', 'info');
        setDeleteConfirmId(null);
        fetchProducts();
      }
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Product Catalog Management</h1>
          <p className="text-xs text-stone-500 mt-1">Add, update pricing, size variants, and inventory levels</p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-3 bg-forest-900 hover:bg-forest-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter products by name or category..."
          className="w-full text-xs bg-transparent focus:outline-none text-stone-900"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((p) => (
                <tr key={p.id || p.slug} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-stone-900 line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-stone-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 font-medium">{p.category}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{formatPrice(p.price)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.stock > 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">★ {p.rating}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-stone-500 hover:text-forest-800 hover:bg-stone-100 rounded-lg"
                        aria-label="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-stone-900">Delete Product?</h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to permanently delete this product from the VRUKSHA store?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 border border-stone-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="font-serif font-bold text-xl text-stone-900">
                {editingProduct.id ? `Edit: ${editingProduct.name}` : 'Create New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                      categorySlug: e.target.value.toLowerCase().replace(/ /g, '-')
                    })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  >
                    <option value="Fruit Products">Fruit Products</option>
                    <option value="Vegetable Products">Vegetable Products</option>
                    <option value="Leafy Products">Leafy Products</option>
                    <option value="Wellness Products">Wellness Products</option>
                    <option value="Popular Combos">Popular Combos</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-forest-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">MRP / Original (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => handleOriginalPriceChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              {/* Size Variants Manager */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider">Weight & Size Variants</h4>
                    <p className="text-[11px] text-stone-500">Each size has its own customer price. Base size matches Selling Price.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSizeVariant}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 text-forest-800 border border-stone-300 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Size</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingProduct.sizes?.map((sizeItem, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-stone-200">
                      <input
                        type="text"
                        placeholder="Size (e.g. 100g)"
                        value={sizeItem.size}
                        onChange={(e) => handleSizeVariantChange(idx, 'size', e.target.value)}
                        className="w-24 p-1.5 rounded-lg border border-stone-200 text-xs font-medium"
                      />
                      <div className="flex items-center gap-1 flex-1">
                        <span className="text-stone-400 text-xs">₹</span>
                        <input
                          type="number"
                          placeholder="Selling Price"
                          value={sizeItem.price}
                          onChange={(e) => handleSizeVariantChange(idx, 'price', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-900"
                        />
                      </div>
                      <div className="flex items-center gap-1 flex-1">
                        <span className="text-stone-400 text-xs">MRP ₹</span>
                        <input
                          type="number"
                          placeholder="MRP"
                          value={sizeItem.originalPrice || ''}
                          onChange={(e) => handleSizeVariantChange(idx, 'originalPrice', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-stone-200 text-xs text-stone-500"
                        />
                      </div>
                      {editingProduct.sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSizeVariant(idx)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete Size"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Image (Upload from device)</label>
                <div className="mt-1 flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/60 hover:bg-stone-50 transition-colors">
                  {editingProduct.images?.[0] ? (
                    <div className="relative group w-24 h-24 rounded-xl overflow-hidden border border-stone-200 shadow-2xs flex-shrink-0 bg-white">
                      <img
                        src={editingProduct.images[0]}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, images: [] })}
                        className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-semibold"
                        title="Remove image"
                      >
                        <Trash2 className="w-5 h-5 text-rose-300 hover:text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center text-stone-400 flex-shrink-0">
                      <Upload className="w-6 h-6 stroke-[1.5]" />
                      <span className="text-[10px] mt-1 font-medium">No Image</span>
                    </div>
                  )}

                  <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-xl text-stone-700 font-semibold cursor-pointer hover:bg-stone-100 hover:border-stone-400 transition-colors shadow-2xs">
                      <Upload className="w-4 h-4 text-forest-700" />
                      <span>{editingProduct.images?.[0] ? 'Change Image file' : 'Select Image from device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Upload from computer / mobile. Supports JPG, PNG, WEBP.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingProduct.shortDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Description</label>
                <textarea
                  rows="3"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-forest-900 text-white font-bold uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
