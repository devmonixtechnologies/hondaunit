import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Target,
  Compass,
  Save,
} from 'lucide-react';
import L from 'leaflet';
import { adminApiService, AdminBranch } from '../../services/adminApi';
import useConfirmDialog from '../../hooks/useConfirmDialog';

interface BranchForm {
  name: string;
  est: string;
  members: string;
  description: string;
  lat: number;
  lng: number;
}

const DEFAULT_COORDINATES: [number, number] = [20, 0];

const BranchesManagement: React.FC = () => {
  const [branches, setBranches] = useState<AdminBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<AdminBranch | null>(null);
  const [mapKey, setMapKey] = useState(0);
  const [formData, setFormData] = useState<BranchForm>({
    name: '',
    est: '2024',
    members: '',
    description: '',
    lat: DEFAULT_COORDINATES[0],
    lng: DEFAULT_COORDINATES[1],
  });

  const { confirm, ConfirmDialogComponent } = useConfirmDialog();

  const fetchBranches = async (query?: string) => {
    setIsLoading(true);
    try {
      const data = await adminApiService.getBranches(query);
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filteredBranches = useMemo(() => {
    if (!search.trim()) {
      return branches;
    }
    return branches.filter((branch) =>
      branch.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [branches, search]);

  const openModal = (branch?: AdminBranch) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        est: branch.est,
        members: branch.members,
        description: branch.description,
        lat: branch.lat,
        lng: branch.lng,
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: '',
        est: '2024',
        members: '',
        description: '',
        lat: DEFAULT_COORDINATES[0],
        lng: DEFAULT_COORDINATES[1],
      });
    }
    setMapKey((prev) => prev + 1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBranch(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      if (editingBranch) {
        await adminApiService.updateBranch(editingBranch._id, formData);
      } else {
        await adminApiService.createBranch(formData);
      }
      await fetchBranches();
      closeModal();
    } catch (error) {
      console.error('Failed to save branch:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (branch: AdminBranch) => {
    const confirmed = await confirm({
      title: 'Delete branch?',
      message: `${branch.name} will be removed from the map.`,
      confirmLabel: 'Delete Branch',
      tone: 'danger',
    });

    if (!confirmed) {
      return;
    }

    try {
      await adminApiService.deleteBranch(branch._id);
      fetchBranches();
    } catch (error) {
      console.error('Failed to delete branch:', error);
    }
  };

  return (
    <>
      <div>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Global Branches</h2>
            <p className="text-gray-400">
              Manage official HondaUnit locations across the map.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search branches..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
              />
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-honda-red text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Plus size={16} />
              Add Branch
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 animate-pulse"
              >
                <div className="h-6 bg-zinc-800 rounded mb-4"></div>
                <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                <div className="h-4 bg-zinc-800 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-zinc-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-zinc-900/30">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
              <Target size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-300 font-medium">No branches found</p>
            <p className="text-sm text-gray-500">
              Add your first branch to begin populating the map.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBranches.map((branch) => (
              <div
                key={branch._id}
                className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{branch.name}</h3>
                    <p className="text-gray-400 text-sm">
                      Est. {branch.est} • {branch.members}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(branch)}
                      className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(branch)}
                      className="p-2 bg-red-900/40 rounded-lg hover:bg-red-900/60 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {branch.description}
                </p>

                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gray-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {branch.lat.toFixed(2)}, {branch.lng.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Compass size={14} />
                    Node Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-3xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  {editingBranch ? 'Update Branch' : 'Create Branch'}
                </p>
                <h3 className="text-2xl font-bold text-white">
                  {editingBranch ? editingBranch.name : 'New Branch'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Trash2 size={20} className="opacity-0 pointer-events-none" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-gray-500">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                    placeholder="Hondaunit Tokyo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-gray-500">
                    Established
                  </label>
                  <input
                    type="text"
                    value={formData.est}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        est: event.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                    placeholder="2024"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-gray-500">
                    Members
                  </label>
                  <input
                    type="text"
                    value={formData.members}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        members: event.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                    placeholder="120+"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-gray-500">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors resize-none"
                    placeholder="Share highlights about this branch..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-gray-500">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        lat: parseFloat(event.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-gray-500">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        lng: parseFloat(event.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <LocationPicker
                key={mapKey}
                lat={formData.lat}
                lng={formData.lng}
                onSelect={(lat, lng) =>
                  setFormData((prev) => ({
                    ...prev,
                    lat,
                    lng,
                  }))
                }
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-honda-red text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingBranch ? 'Update Branch' : 'Create Branch'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {ConfirmDialogComponent}
    </>
  );
};

interface LocationPickerProps {
  lat: number;
  lng: number;
  onSelect: (lat: number, lng: number) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ lat, lng, onSelect }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const marker = L.marker([lat, lng], {
      draggable: true
    }).addTo(map);

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onSelect(position.lat, position.lng);
    });

    map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = event.latlng;
      marker.setLatLng([clickLat, clickLng]);
      onSelect(clickLat, clickLng);
    });

    markerRef.current = marker;
    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) {
      return;
    }

    mapRef.current.setView([lat, lng], mapRef.current.getZoom(), {
      animate: true
    });
    markerRef.current.setLatLng([lat, lng]);
  }, [lat, lng]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm uppercase tracking-widest text-gray-500">
          Select Location
        </label>
        <span className="text-xs text-gray-500">
          {lat.toFixed(2)}°, {lng.toFixed(2)}°
        </span>
      </div>
      <div
        ref={containerRef}
        className="w-full h-64 rounded-xl border border-white/10 overflow-hidden"
      />
    </div>
  );
};

export default BranchesManagement;
