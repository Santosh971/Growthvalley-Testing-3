'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { teamAPI } from '@/lib/admin-api';
import { useAuth } from '@/lib/auth-context';
import AdminLayout from '../AdminLayout';


interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  status: string;
  order: number;
  linkedin?: string;
  twitter?: string;
}

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

export default function TeamListPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) loadMembers();
  }, [isAuthenticated]);

  const loadMembers = async () => {
    try {
      const response = await teamAPI.getAll('all');
      setMembers(response.data || []);
    } catch (error) {
      console.error('Failed to load team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      await teamAPI.delete(id);
      loadMembers();
    } catch (error) {
      alert('Failed to delete team member');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      await teamAPI.update(id, { status: currentStatus === 'active' ? 'inactive' : 'active' });
      loadMembers();
    } catch (error) {
      alert('Failed to update status');
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
            <h1 className="text-3xl font-bold text-brand-black dark:text-white">Team Members</h1>
            <p className="text-brand-grey-500 dark:text-brand-grey-400 mt-1">{members.length} team members</p>
          </div>
          <Link
            href="/admin/team/new"
            className="px-6 py-3 bg-accent text-brand-black font-semibold rounded-lg hover:bg-accent-light transition-colors"
          >
            + Add Member
          </Link>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-black dark:border-white mx-auto"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white dark:bg-brand-grey-900 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800 p-8 text-center">
            <p className="text-brand-grey-500 dark:text-brand-grey-400 mb-4">No team members yet. Add your first team member!</p>
            <Link
              href="/admin/team/new"
              className="px-6 py-3 bg-accent text-brand-black font-semibold rounded-lg hover:bg-accent-light transition-colors"
            >
              Add Team Member
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((member) => (
              <div
                key={member._id}
                className="bg-white dark:bg-brand-grey-900 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800 overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-square bg-brand-grey-100 dark:bg-brand-grey-800 relative">
                  {member.image ? (
                    // <img
                    //   src={member.image}
                    //   alt={member.name}
                    //   className="w-full h-full object-cover"
                    // />

                    <img
                      src={getImageUrl(member.image)}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-brand-grey-300 dark:text-brand-grey-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  {/* Status Badge */}
                  <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${member.status === 'active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-grey-100 dark:bg-brand-grey-700 text-brand-grey-700 dark:text-brand-grey-300'
                    }`}>
                    {member.status}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-brand-black dark:text-white truncate">{member.name}</h3>
                  <p className="text-sm text-brand-grey-500 dark:text-brand-grey-400 truncate">{member.role}</p>

                  {/* Social Links */}
                  {(member.linkedin || member.twitter) && (
                    <div className="flex gap-2 mt-2">
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-brand-grey-400 hover:text-accent">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                      {member.twitter && (
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-brand-grey-400 hover:text-accent">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-grey-200 dark:border-brand-grey-700">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/team/${member._id}`}
                        className="px-3 py-1 text-sm bg-brand-grey-100 dark:bg-brand-grey-700 text-brand-black dark:text-white rounded hover:bg-brand-grey-200 dark:hover:bg-brand-grey-600 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => toggleStatus(member._id, member.status)}
                        className="px-3 py-1 text-sm bg-brand-grey-100 dark:bg-brand-grey-700 text-brand-black dark:text-white rounded hover:bg-brand-grey-200 dark:hover:bg-brand-grey-600 transition-colors"
                      >
                        {member.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}