'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { caseStudyAPI } from '@/lib/admin-api';
import { getApiUrl } from '@/lib/api-config';
import AdminLayout from '../../AdminLayout';

interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  challenge: string;
  solution: string;
  status: string;
}

export default function EditCaseStudyPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    challenge: '',
    solution: '',
    status: 'published',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  useEffect(() => {
    loadCaseStudy();
  }, []);

  const loadCaseStudy = async () => {
    const apiUrl = getApiUrl();
    if (!apiUrl) {
      console.error('API URL not configured');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/case-studies/admin/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        const cs = data.data;
        setFormData({
          title: cs.title || '',
          slug: cs.slug || '',
          challenge: cs.challenge || '',
          solution: cs.solution || '',
          status: cs.status || 'published',
        });
      }
    } catch (error) {
      console.error('Failed to load case study:', error);
      alert('Failed to load case study');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        title: formData.title,
        slug: formData.slug,
        challenge: formData.challenge,
        solution: formData.solution,
        status: formData.status,
      };

      const response = await caseStudyAPI.update(params.id as string, data);
      if (response.success) {
        router.push('/admin/case-studies');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update case study');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-black dark:border-white"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/case-studies" className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors">
            ← Back to Case Studies
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-brand-black dark:text-white mb-8">Edit Case Study</h1>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Case Study Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
                    }}
                    required
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Content</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Challenge *</label>
                  <textarea
                    value={formData.challenge}
                    onChange={(e) => setFormData(prev => ({ ...prev, challenge: e.target.value }))}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Solution *</label>
                  <textarea
                    value={formData.solution}
                    onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Publishing</h2>

              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/admin/case-studies"
                className="px-6 py-3 border border-brand-grey-200 dark:border-brand-grey-700 text-brand-black dark:text-white rounded-lg hover:bg-brand-grey-50 dark:hover:bg-brand-grey-800 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-accent text-brand-black font-semibold rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}