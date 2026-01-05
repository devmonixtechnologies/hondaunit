import React, { useState, useEffect } from 'react';
import { Image, Plus, Edit, Trash2, Search, Eye, EyeOff, X, Save } from 'lucide-react';
import { adminApiService, GalleryItem } from '../../services/adminApi';
import useConfirmDialog from '../../hooks/useConfirmDialog';

const GalleryManagement: React.FC = () => {
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    isFeatured: false
  });

  useEffect(() => {
    fetchItems();
  }, [currentPage, searchQuery]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await adminApiService.getGalleryItems(currentPage, searchQuery);
      setItems(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch gallery items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await adminApiService.createGalleryItem(formData);
      setShowCreateModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Failed to create gallery item:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    
    try {
      await adminApiService.updateGalleryItem(editingItem._id, formData);
      setEditingItem(null);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Failed to update gallery item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete gallery item?',
      message: 'This gallery entry and its metadata will be removed immediately.',
      confirmLabel: 'Delete Item',
      tone: 'danger'
    });

    if (!confirmed) return;

    try {
      await adminApiService.deleteGalleryItem(id);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete gallery item:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: '',
      isFeatured: false
    });
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      category: item.category || '',
      isFeatured: item.isFeatured
    });
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingItem(null);
    resetForm();
  };

  return (
    <>
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Gallery Management</h2>
          <p className="text-gray-400">Manage gallery items and featured content</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-honda-red text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/20 via-amber-500/5 to-transparent p-5 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center text-amber-200">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 2a10 10 0 11-7.07 2.93A10 10 0 0112 2zm.75 5h-1.5v6h6v-1.5h-4.5V7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Coming Soon</p>
              <h3 className="text-lg font-semibold">Gallery uploads are in flight.</h3>
            </div>
          </div>
          <p className="text-sm text-amber-200/80 md:max-w-md">
            We’re finalizing the media pipeline so you can drag-and-drop builds directly from the admin. Expect this feature shortly—thank you for your patience.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search gallery items..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
        />
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-zinc-800"></div>
              <div className="p-4">
                <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                <div className="h-3 bg-zinc-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden group">
              <div className="relative aspect-square">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.isFeatured && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-honda-red text-xs text-white rounded-full">
                    Featured
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                )}
                {item.category && (
                  <span className="inline-block mt-2 px-2 py-1 bg-zinc-800 text-xs rounded-full">
                    {item.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full transition-colors ${
                currentPage === page
                  ? 'bg-honda-red text-white'
                  : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingItem) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-2xl border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold">
                {editingItem ? 'Edit Gallery Item' : 'Create Gallery Item'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                  placeholder="Item title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none resize-none"
                  placeholder="Item description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Image URL *</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                  placeholder="e.g., Events, Builds, Community"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 bg-zinc-800 border border-white/10 rounded focus:border-honda-red"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium">
                  Feature this item
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-white/10">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdate : handleCreate}
                className="flex items-center gap-2 px-4 py-2 bg-honda-red text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Save size={16} />
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {ConfirmDialogComponent}
    </>
  );
};

export default GalleryManagement;
