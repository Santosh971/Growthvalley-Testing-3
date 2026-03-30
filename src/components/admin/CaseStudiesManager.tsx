'use client';

import { useState, useEffect } from 'react';
import { caseStudyAPI } from '@/lib/admin-api';
import { getApiUrl } from '@/lib/api-config';

interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  challenge: string;
  solution: string;
  status: string;
}

export default function CaseStudiesManager() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for inline editing
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    title: '',
    slug: '',
    challenge: '',
    solution: '',
    status: 'published',
  };

  const [formData, setFormData] = useState(emptyForm);

  const loadCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await caseStudyAPI.getAll();
      setCaseStudies(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load case studies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = async (id: string) => {
    const apiUrl = getApiUrl();
    if (!apiUrl) {
      setError('API URL not configured');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/case-studies/admin/${id}`, {
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
        setEditingId(id);
        setShowForm(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load case study');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const data = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        challenge: formData.challenge,
        solution: formData.solution,
        status: formData.status,
        publishDate: formData.status === 'published' ? new Date() : undefined,
      };

      let response;
      if (editingId) {
        response = await caseStudyAPI.update(editingId, data);
      } else {
        response = await caseStudyAPI.create(data);
      }

      if (response.success) {
        await loadCaseStudies();
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save case study');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;

    try {
      await caseStudyAPI.delete(id);
      await loadCaseStudies();
    } catch (err: any) {
      setError(err.message || 'Failed to delete case study');
    }
  };

  if (loading && !showForm) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {!showForm ? (
        <>
          {/* List View */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-heading-3 text-brand-black dark:text-white">Case Studies</h3>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-4 py-2 bg-accent text-brand-black font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              + Add Case Study
            </button>
          </div>

          <div className="bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-brand-grey-50 dark:bg-brand-grey-800 border-b border-brand-grey-200 dark:border-brand-grey-700">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-brand-grey-500 dark:text-brand-grey-400">Title</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-brand-grey-500 dark:text-brand-grey-400">Challenge</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-brand-grey-500 dark:text-brand-grey-400">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-brand-grey-500 dark:text-brand-grey-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-grey-200 dark:divide-brand-grey-700">
                {caseStudies.map((cs) => (
                  <tr key={cs._id} className="hover:bg-brand-grey-50 dark:hover:bg-brand-grey-800">
                    <td className="px-6 py-4">
                      <p className="font-medium text-brand-black dark:text-white">{cs.title}</p>
                    </td>
                    <td className="px-6 py-4 text-brand-grey-600 dark:text-brand-grey-300 max-w-md truncate">
                      {cs.challenge?.substring(0, 100)}...
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${cs.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                        {cs.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cs._id)}
                          className="text-accent hover:text-accent/80 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cs._id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {caseStudies.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-brand-grey-500 dark:text-brand-grey-400">
                      No case studies found. Click &quot;Add Case Study&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Form View */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-heading-3 text-brand-black dark:text-white">
              {editingId ? 'Edit Case Study' : 'New Case Study'}
            </h3>
            <button
              onClick={resetForm}
              className="px-4 py-2 text-brand-grey-600 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors"
            >
              ← Back to List
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 rounded-lg p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-body-sm font-medium text-brand-grey-600 dark:text-brand-grey-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                }))}
                className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white focus:border-accent focus:outline-none rounded-lg"
                required
              />
            </div>

            {/* Challenge */}
            <div>
              <label className="block text-body-sm font-medium text-brand-grey-600 dark:text-brand-grey-300 mb-2">
                Challenge *
              </label>
              <textarea
                value={formData.challenge}
                onChange={(e) => setFormData(prev => ({ ...prev, challenge: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white focus:border-accent focus:outline-none rounded-lg"
                required
              />
            </div>

            {/* Solution */}
            <div>
              <label className="block text-body-sm font-medium text-brand-grey-600 dark:text-brand-grey-300 mb-2">
                Solution *
              </label>
              <textarea
                value={formData.solution}
                onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white focus:border-accent focus:outline-none rounded-lg"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-body-sm font-medium text-brand-grey-600 dark:text-brand-grey-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white focus:border-accent focus:outline-none rounded-lg"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-brand-grey-200 dark:border-brand-grey-700 text-brand-grey-600 dark:text-brand-grey-400 rounded-lg hover:border-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-accent text-brand-black font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : (editingId ? 'Update Case Study' : 'Create Case Study')}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}