import React, { useState } from 'react';
import { useCatalog, productKey } from '../contexts/CatalogContext';

const emptyForm = {
  name: '',
  price: '',
  image: '',
  section: 'bestsellers',
  description: ''
};

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Please choose an image'));
      return;
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please upload an image file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 900;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error('Could not read that image'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Could not read that image'));
    reader.readAsDataURL(file);
  });

const EmployeeInventory = () => {
  const { products, setAvailability, addProduct, updateProduct, removeProduct } = useCatalog();
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', image: '' });
  const [editError, setEditError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageUpload = async (file, target) => {
    try {
      setUploading(true);
      setError('');
      setEditError('');
      const image = await readImageFile(file);
      if (target === 'add') {
        setForm((current) => ({ ...current, image }));
      } else {
        setEditForm((current) => ({ ...current, image }));
      }
    } catch (e) {
      const notice = e.message || 'Could not upload that image';
      if (target === 'add') setError(notice);
      else setEditError(notice);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (product) => {
    setEditingKey(productKey(product));
    setEditError('');
    setEditForm({
      name: product.name,
      price: String(product.price),
      image: product.images?.[0] || ''
    });
  };

  const handleSaveEdit = (product) => {
    const result = updateProduct(product, editForm);
    if (!result.success) {
      setEditError(result.message);
      return;
    }
    setEditingKey(null);
    setEditError('');
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!form.image) {
      setError('Please upload an image');
      return;
    }
    const result = addProduct(form);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setForm(emptyForm);
    setShowAddForm(false);
    setMessage(`${result.product.name} added to the shop`);
  };

  return (
    <section className="mt-10 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Shop Inventory</h2>
          <p className="text-sm text-gray-600">
            Edit image, title, and price, or mark items unavailable.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowAddForm((open) => !open);
            setError('');
            setMessage('');
            setForm(emptyForm);
          }}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 self-start"
        >
          {showAddForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {message && !showAddForm && (
        <p className="text-sm text-green-700 mb-4">{message}</p>
      )}

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item name"
            className="p-2 border rounded"
            required
          />
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="p-2 border rounded"
            required
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Product image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0], 'add')}
              className="w-full p-2 border rounded bg-white"
              required={!form.image}
            />
            {form.image && (
              <img src={form.image} alt="New item preview" className="mt-2 h-32 w-full object-cover rounded" />
            )}
          </div>
          <select
            name="section"
            value={form.section}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="bestsellers">Bestsellers</option>
            <option value="specialOffers">Special Offers</option>
          </select>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description (optional)"
            className="p-2 border rounded"
          />
          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Save Item'}
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const key = productKey(product);
          const isEditing = editingKey === key;
          return (
            <div key={key} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <img
                  src={isEditing ? (editForm.image || product.images?.[0]) : product.images?.[0]}
                  alt={product.name}
                  className={`w-full h-40 object-cover ${product.available === false ? 'opacity-50' : ''}`}
                />
                {product.available === false && (
                  <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Unavailable
                  </span>
                )}
              </div>
              <div className="p-3 space-y-2">
                {isEditing ? (
                  <>
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm((current) => ({ ...current, name: e.target.value }))}
                      className="w-full p-2 border rounded font-medium"
                      placeholder="Title"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm((current) => ({ ...current, price: e.target.value }))}
                      className="w-full p-2 border rounded text-pink-600"
                      placeholder="Price"
                    />
                    <label className="block text-sm font-medium">Replace image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files?.[0], 'edit')}
                      className="w-full p-2 border rounded bg-white text-sm"
                    />
                    {editError && <p className="text-xs text-red-600">{editError}</p>}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(product)}
                        disabled={uploading}
                        className="flex-1 bg-pink-600 text-white py-2 rounded text-sm hover:bg-pink-700 disabled:opacity-50"
                      >
                        {uploading ? 'Uploading...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingKey(null);
                          setEditError('');
                        }}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 rounded text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-pink-600">${Number(product.price).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {product.section === 'specialOffers' ? 'Special Offers' : 'Bestsellers'}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="flex-1 border border-gray-300 py-2 rounded text-sm hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvailability(product, product.available === false)}
                        className={`flex-1 py-2 rounded text-sm ${
                          product.available === false
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {product.available === false ? 'Put back on sale' : 'Mark unavailable'}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(product)}
                      className="w-full bg-red-500 text-white py-2 rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EmployeeInventory;
