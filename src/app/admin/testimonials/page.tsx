'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { testimonialAPI } from '@/lib/admin-api';
import { useAuth } from '@/lib/auth-context';
import AdminLayout from '../AdminLayout';

interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  designation: string;
  company: string;
  avatar: string;
  rating: number;
  featured: boolean;
  status: string;
  order: number;
  createdAt: string;
}

export default function TestimonialsListPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) loadTestimonials();
  }, [isAuthenticated]);

  const loadTestimonials = async () => {
    try {
      const response = await testimonialAPI.getAll();
      console.log("Testimonial s : ", response)
      setTestimonials(response.data || []);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await testimonialAPI.delete(id);
      loadTestimonials();
    } catch (error) {
      alert('Failed to delete testimonial');
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await testimonialAPI.update(id, { featured: !featured });
      loadTestimonials();
    } catch (error) {
      alert('Failed to update testimonial');
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return ''; // fallback if no image
    if (path.startsWith('http')) return path; // already full URL

    // If running on localhost, use localhost backend
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : 'https://your-live-domain.com');

    return `${baseUrl}${path}`;
  };
  const toggleStatus = async (id: string, status: string) => {
    try {
      await testimonialAPI.update(id, { status: status === 'active' ? 'inactive' : 'active' });
      loadTestimonials();
    } catch (error) {
      alert('Failed to update testimonial');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin" className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-black dark:text-white">Testimonials</h1>
            <p className="text-brand-grey-500 dark:text-brand-grey-400 mt-1">{testimonials.length} total</p>
          </div>
          <Link
            href="/admin/testimonials/new"
            className="px-6 py-3 bg-accent text-brand-black font-semibold rounded-lg hover:bg-accent-light transition-colors"
          >
            + New Testimonial
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-brand-grey-900 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-black dark:border-white mx-auto"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-8 text-center text-brand-grey-500 dark:text-brand-grey-400">
              No testimonials found. Create your first one!
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-brand-grey-50 dark:bg-brand-grey-800 border-b border-brand-grey-200 dark:border-brand-grey-700">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-brand-grey-500 dark:text-brand-grey-400">Testimonial</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-brand-grey-500 dark:text-brand-grey-400">Author</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-brand-grey-500 dark:text-brand-grey-400">Rating</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-brand-grey-500 dark:text-brand-grey-400">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-brand-grey-500 dark:text-brand-grey-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-grey-200 dark:divide-brand-grey-700">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial._id} className="hover:bg-brand-grey-50 dark:hover:bg-brand-grey-800">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {testimonial.avatar && (
                          // <img src={testimonial.avatar} alt={testimonial.author} className="w-10 h-10 rounded-full object-cover" />
                          // <img
                          //   src={`http://localhost:3001${testimonial.avatar}`}
                          //   alt={testimonial.author}
                          //   className="w-10 h-10 rounded-full object-cover"
                          // />

                          <img
                            src={getImageUrl(testimonial.avatar)}
                            alt={testimonial.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-brand-black dark:text-white line-clamp-1">{testimonial.quote.substring(0, 60)}</p>
                          {testimonial.featured && (
                            <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-brand-black dark:text-white font-medium">{testimonial.author}</p>
                        <p className="text-sm text-brand-grey-500 dark:text-brand-grey-400">{testimonial.designation}{testimonial.company && `, ${testimonial.company}`}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= testimonial.rating ? 'text-yellow-400' : 'text-brand-grey-300 dark:text-brand-grey-600'}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(testimonial._id, testimonial.status)}
                        className={`px-2 py-1 text-xs rounded-full ${testimonial.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}
                      >
                        {testimonial.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleFeatured(testimonial._id, testimonial.featured)}
                          className={`px-3 py-1 text-sm rounded transition-colors ${testimonial.featured
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-brand-grey-100 dark:bg-brand-grey-700 text-brand-black dark:text-white'
                            }`}
                        >
                          {testimonial.featured ? '★ Featured' : 'Feature'}
                        </button>
                        <Link
                          href={`/admin/testimonials/${testimonial._id}`}
                          className="px-3 py-1 text-sm bg-brand-grey-100 dark:bg-brand-grey-700 text-brand-black dark:text-white rounded hover:bg-brand-grey-200 dark:hover:bg-brand-grey-600 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(testimonial._id)}
                          className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}