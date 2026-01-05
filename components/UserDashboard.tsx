import React, { useState, useEffect, useMemo } from 'react';
import { User, Car, MapPin, Instagram, Save, X, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { apiService, ProfileUpdateData } from '../services/api';
import Navbar from './Navbar';

interface SocialLink {
  platform: string;
  url?: string;
  handle?: string;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [baselineProfile, setBaselineProfile] = useState<ProfileUpdateData | null>(null);
  const [profile, setProfile] = useState<ProfileUpdateData>({
    name: '',
    bio: '',
    location: '',
    description: '',
    age: undefined,
    instagram: '',
    machine: '',
    socialLinks: []
  });

  const cloneProfile = (data: ProfileUpdateData): ProfileUpdateData => ({
    ...data,
    socialLinks: data.socialLinks ? data.socialLinks.map(link => ({ ...link })) : []
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    const initialProfile: ProfileUpdateData = {
      name: user.name ?? '',
      bio: user.bio ?? '',
      location: user.location ?? '',
      description: user.description ?? '',
      age: user.age,
      instagram: user.instagram ?? '',
      machine: user.machine ?? '',
      socialLinks: user.socialLinks && user.socialLinks.length > 0 ? user.socialLinks : []
    };

    setProfile(initialProfile);
    setBaselineProfile(cloneProfile(initialProfile));
  }, [user]);

  const areProfilesEqual = (
    a: ProfileUpdateData | null,
    b: ProfileUpdateData | null
  ) => {
    if (!a || !b) {
      return false;
    }

    const primitiveFields: (keyof ProfileUpdateData)[] = [
      'name',
      'bio',
      'location',
      'description',
      'age',
      'instagram',
      'machine'
    ];

    for (const field of primitiveFields) {
      if (a[field] !== b[field]) {
        return false;
      }
    }

    const aLinks = a.socialLinks || [];
    const bLinks = b.socialLinks || [];

    if (aLinks.length !== bLinks.length) {
      return false;
    }

    for (let i = 0; i < aLinks.length; i++) {
      const aLink = aLinks[i];
      const bLink = bLinks[i];
      if (
        aLink.platform !== bLink.platform ||
        aLink.url !== bLink.url ||
        aLink.handle !== bLink.handle
      ) {
        return false;
      }
    }

    return true;
  };

  const isDirty = useMemo(() => {
    if (!baselineProfile) {
      return false;
    }
    return !areProfilesEqual(profile, baselineProfile);
  }, [profile, baselineProfile]);

  const handleInputChange = (field: keyof ProfileUpdateData, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...(profile.socialLinks || [])];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setProfile(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const addSocialLink = () => {
    setProfile(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), { platform: '', url: '', handle: '' }]
    }));
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = (profile.socialLinks || []).filter((_, i) => i !== index);
    setProfile(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty) {
      setMessage('No changes to save.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await apiService.updateProfile(profile);
      setMessage('Profile updated successfully!');
      setBaselineProfile(cloneProfile(profile));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <a 
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </a>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">User Dashboard</h1>
            <p className="text-gray-400">Manage your HondaUnit profile</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('success') ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User size={20} className="text-honda-red" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                  <input
                    type="text"
                    value={profile.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                  <input
                    type="number"
                    min="13"
                    max="120"
                    value={profile.age || ''}
                    onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                    placeholder="Your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <Instagram size={16} />
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={profile.instagram || ''}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                    placeholder="@yourhandle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                <textarea
                  value={profile.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  maxLength={600}
                  className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Machine Information */}
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Car size={20} className="text-honda-red" />
                Machine Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Honda Machine</label>
                <input
                  type="text"
                  value={profile.machine || ''}
                  onChange={(e) => handleInputChange('machine', e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                  placeholder="e.g., Honda Civic Type R (FK8)"
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-6">About You & Your Build</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={profile.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                  maxLength={2000}
                  className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors resize-none"
                  placeholder="Share your story, modifications, journey with Honda..."
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-6">Additional Social Links</h2>
              
              <div className="space-y-4">
                {profile.socialLinks?.map((link, index) => (
                  <div key={index} className="flex flex-col gap-3 md:gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                        placeholder="Platform (e.g., YouTube, Facebook)"
                      />
                      <input
                        type="text"
                        value={link.url || ''}
                        onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                        placeholder="URL"
                      />
                      <input
                        type="text"
                        value={link.handle || ''}
                        onChange={(e) => handleSocialLinkChange(index, 'handle', e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
                        placeholder="Handle"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-red-900/50 border border-red-500/30 rounded-lg hover:bg-red-900/70 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-400" />
                        <span className="text-sm">Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Social Link
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={isLoading || !isDirty}
                className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-honda-red text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={16} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
