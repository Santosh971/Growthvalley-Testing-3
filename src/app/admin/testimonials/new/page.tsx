'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { testimonialAPI, mediaAPI } from '@/lib/admin-api';
import AdminLayout from '../../AdminLayout';

export default function NewTestimonialPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    designation: '',
    company: '',
    avatar: '',
    rating: 5,
    featured: false,
    status: 'active',
  });

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   setUploading(true);

  //   try {
  //     const response = await mediaAPI.upload(file, 'testimonials');
  //     if (response.success) {
  //       setFormData(prev => ({ ...prev, avatar: response.data.url }));
  //     }
  //   } catch (error: any) {
  //     alert(error.message || 'Upload failed');
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      setAvatarFile(file);

      // preview image
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar: preview }));

    } catch (error: any) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSaving(true);

  //   try {
  //     const response = await testimonialAPI.create(formData);
  //     if (response.success) {
  //       router.push('/admin/testimonials');
  //     }
  //   } catch (error: any) {
  //     alert(error.message || 'Failed to create testimonial');
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'avatar') {
          form.append(key, String(value));
        }
      });

      if (avatarFile) {
        form.append('avatar', avatarFile);
      }

      const response = await testimonialAPI.create(form);

      if (response.success) {
        router.push('/admin/testimonials');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create testimonial');
    } finally {
      setSaving(false);
    }
  };


  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/testimonials" className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors">
            ← Back to Testimonials
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-brand-black dark:text-white mb-8">Create New Testimonial</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="space-y-6">
            {/* Quote */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Quote *</label>
              <textarea
                value={formData.quote}
                onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                required
                rows={4}
                className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                placeholder="What did the client say about your service?"
              />
            </div>

            {/* Author Info */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Author Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                    placeholder="John Smith"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Designation</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                      className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                      placeholder="VP of Marketing"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                      placeholder="TechCorp Inc."
                    />
                  </div>
                </div>

                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Avatar</label>
                  <div className="border-2 border-dashed border-brand-grey-300 dark:border-brand-grey-700 rounded-lg p-6 text-center">
                    {formData.avatar ? (
                      <div className="relative inline-block">
                        <img src={formData.avatar} alt="Avatar" className="w-24 h-24 object-cover rounded-full" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="avatar"
                        />
                        <label htmlFor="avatar" className="cursor-pointer">
                          <div className="text-brand-grey-500 dark:text-brand-grey-400">
                            {uploading ? 'Uploading...' : 'Click to upload avatar'}
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className={`text-3xl ${star <= formData.rating ? 'text-yellow-400' : 'text-brand-grey-300 dark:text-brand-grey-600'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-5 h-5 rounded border-brand-grey-300 dark:border-brand-grey-600 text-accent focus:ring-accent"
                    />
                    <span className="text-sm font-medium text-brand-black dark:text-white">Mark as Featured</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/admin/testimonials"
                className="px-6 py-3 border border-brand-grey-200 dark:border-brand-grey-700 text-brand-black dark:text-white rounded-lg hover:bg-brand-grey-50 dark:hover:bg-brand-grey-800 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-accent text-brand-black font-semibold rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Testimonial'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

