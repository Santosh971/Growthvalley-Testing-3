'use client';

import { useEffect, useState, useRef } from 'react';
import { settingsAPI, mediaAPI } from '@/lib/admin-api';
import { useAuth } from '@/lib/auth-context';
import { getMediaUrl } from '@/lib/api-config';
import AdminLayout from '../AdminLayout';

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
  businessInfo: {
    legalName: string;
    foundedYear: string;
    teamSize: string;
    description: string;
    logo: string;
    logoDark: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
  };
  footer: {
    copyrightText: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  favicon: string;
}

export default function SettingsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLight, setUploadingLight] = useState(false);
  const [uploadingDark, setUploadingDark] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const lightLogoRef = useRef<HTMLInputElement>(null);
  const darkLogoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<SiteSettings>({
    siteName: '',
    siteTagline: '',
    siteDescription: '',
    socialLinks: { linkedin: '', twitter: '', facebook: '', instagram: '', youtube: '' },
    businessInfo: { legalName: '', foundedYear: '', teamSize: '', description: '', logo: '', logoDark: '' },
    hero: { title: '', subtitle: '', ctaText: '', ctaLink: '' },
    footer: { copyrightText: '' },
    seo: { metaTitle: '', metaDescription: '', keywords: [] },
    favicon: '',
  });
  const [keywordsInput, setKeywordsInput] = useState('');

  // Helper to get full URL for preview
  const getFullUrl = (path: string | undefined) => {
    return getMediaUrl(path);
  };

  useEffect(() => {
    if (isAuthenticated) loadSettings();
  }, [isAuthenticated]);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.success && response.data) {
        setFormData({
          siteName: response.data.siteName || '',
          siteTagline: response.data.siteTagline || '',
          siteDescription: response.data.siteDescription || '',
          socialLinks: response.data.socialLinks || { linkedin: '', twitter: '', facebook: '', instagram: '', youtube: '' },
          businessInfo: response.data.businessInfo || { legalName: '', foundedYear: '', teamSize: '', description: '', logo: '', logoDark: '' },
          hero: response.data.hero || { title: '', subtitle: '', ctaText: '', ctaLink: '' },
          footer: response.data.footer || { copyrightText: '' },
          seo: response.data.seo || { metaTitle: '', metaDescription: '', keywords: [] },
          favicon: response.data.favicon || '',
        });
        setKeywordsInput((response.data.seo?.keywords || []).join(', '));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'logoDark'|'favicon') => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   if (type === 'logo') {
  //     setUploadingLight(true);
  //   } else {
  //     setUploadingDark(true);
  //   }

  //   try {
  //     const response = await mediaAPI.upload(file, 'logos');
  //     if (response.success && response.data?.url) {
  //       setFormData(prev => ({
  //         ...prev,
  //         businessInfo: {
  //           ...prev.businessInfo,
  //           [type]: response.data.url,
  //         },
  //       }));
  //     }
  //   } catch (error: any) {
  //     alert(error.message || 'Failed to upload logo');
  //   } finally {
  //     if (type === 'logo') {
  //       setUploadingLight(false);
  //     } else {
  //       setUploadingDark(false);
  //     }
  //   }
  // };

  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'logoDark' | 'favicon'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'logo') setUploadingLight(true);
    if (type === 'logoDark') setUploadingDark(true);
    if (type === 'favicon') setUploadingFavicon(true);

    try {
      const response = await mediaAPI.upload(file, 'logos');

      if (response.success && response.data?.url) {
        if (type === 'favicon') {
          // Favicon is stored at root level
          setFormData(prev => ({
            ...prev,
            favicon: response.data.url,
          }));
        } else {
          // Logos are stored in businessInfo
          setFormData(prev => ({
            ...prev,
            businessInfo: {
              ...prev.businessInfo,
              [type]: response.data.url,
            },
          }));
        }
      }
    } catch (error: any) {
      alert(error.message || 'Upload failed');
    } finally {
      setUploadingLight(false);
      setUploadingDark(false);
      setUploadingFavicon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...formData,
        seo: {
          ...formData.seo,
          keywords: keywordsInput.split(',').map(k => k.trim()).filter(Boolean),
        },
      };

      const response = await settingsAPI.update(data);
      alert('Settings saved successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-4">
          <a href="/admin" className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors">
            ← Back to Dashboard
          </a>
        </div>
        <h1 className="text-3xl font-bold text-brand-black dark:text-white mb-8">Site Settings</h1>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
          {/* Logo Section */}
          <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
            <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Logo Settings</h2>
            <p className="text-sm text-brand-grey-500 dark:text-brand-grey-400 mb-6">
              Upload light and dark versions of your logo. The light logo is used on dark backgrounds, dark logo on light backgrounds.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Light Logo (for dark backgrounds) */}
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">
                  Light Logo (for dark backgrounds)
                </label>
                <div className="border-2 border-dashed border-brand-grey-300 dark:border-brand-grey-700 rounded-lg p-4">
                  {formData.businessInfo.logo ? (
                    <div className="relative">
                      <div className="bg-brand-black rounded-lg p-4 flex items-center justify-center">
                        <img
                          src={getFullUrl(formData.businessInfo.logo)}
                          alt="Light Logo"
                          className="max-h-24 max-w-full object-contain"
                        />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => lightLogoRef.current?.click()}
                          className="flex-1 px-3 py-2 text-sm border border-brand-grey-300 dark:border-brand-grey-700 rounded-lg hover:border-accent"
                          disabled={uploadingLight}
                        >
                          {uploadingLight ? 'Uploading...' : 'Replace'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            businessInfo: { ...prev.businessInfo, logo: '' },
                          }))}
                          className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => lightLogoRef.current?.click()}
                      className="w-full py-8 flex flex-col items-center gap-2 text-brand-grey-500 hover:text-accent transition-colors"
                      disabled={uploadingLight}
                    >
                      {uploadingLight ? (
                        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                      )}
                      <span>{uploadingLight ? 'Uploading...' : 'Upload Light Logo'}</span>
                    </button>
                  )}
                  <input
                    ref={lightLogoRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, 'logo')}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Dark Logo (for light backgrounds) */}
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">
                  Dark Logo (for light backgrounds)
                </label>
                <div className="border-2 border-dashed border-brand-grey-300 dark:border-brand-grey-700 rounded-lg p-4">
                  {formData.businessInfo.logoDark ? (
                    <div className="relative">
                      <div className="bg-white rounded-lg p-4 flex items-center justify-center border border-brand-grey-200">
                        <img
                          src={getFullUrl(formData.businessInfo.logoDark)}
                          alt="Dark Logo"
                          className="max-h-24 max-w-full object-contain"
                        />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => darkLogoRef.current?.click()}
                          className="flex-1 px-3 py-2 text-sm border border-brand-grey-300 dark:border-brand-grey-700 rounded-lg hover:border-accent"
                          disabled={uploadingDark}
                        >
                          {uploadingDark ? 'Uploading...' : 'Replace'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            businessInfo: { ...prev.businessInfo, logoDark: '' },
                          }))}
                          className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => darkLogoRef.current?.click()}
                      className="w-full py-8 flex flex-col items-center gap-2 text-brand-grey-500 hover:text-accent transition-colors"
                      disabled={uploadingDark}
                    >
                      {uploadingDark ? (
                        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                      )}
                      <span>{uploadingDark ? 'Uploading...' : 'Upload Dark Logo'}</span>
                    </button>
                  )}
                  <input
                    ref={darkLogoRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, 'logoDark')}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            {(formData.businessInfo.logo || formData.businessInfo.logoDark) && (
              <div className="mt-6 p-4 bg-brand-grey-50 dark:bg-brand-grey-800 rounded-lg">
                <h4 className="text-sm font-medium text-brand-black dark:text-white mb-3">Preview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-brand-grey-500 mb-2">In Navbar (Light Mode)</p>
                    <div className="bg-white p-4 rounded border border-brand-grey-200 flex items-center h-16">
                      {formData.businessInfo.logoDark ? (
                        <img src={getFullUrl(formData.businessInfo.logoDark)} alt="Logo" className="max-h-10 max-w-full object-contain" />
                      ) : formData.businessInfo.logo ? (
                        <img src={getFullUrl(formData.businessInfo.logo)} alt="Logo" className="max-h-10 max-w-full object-contain" />
                      ) : (
                        <span className="text-lg font-semibold">Growth<span className="text-accent">Valley</span></span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-brand-grey-500 mb-2">In Navbar (Dark Mode)</p>
                    <div className="bg-brand-black p-4 rounded flex items-center h-16">
                      {formData.businessInfo.logo ? (
                        <img src={getFullUrl(formData.businessInfo.logo)} alt="Logo" className="max-h-10 max-w-full object-contain" />
                      ) : formData.businessInfo.logoDark ? (
                        <img src={getFullUrl(formData.businessInfo.logoDark)} alt="Logo" className="max-h-10 max-w-full object-contain" />
                      ) : (
                        <span className="text-lg font-semibold text-white">Growth<span className="text-accent">Valley</span></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Favicon Settings */}
          <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
            <h2 className="text-lg font-semibold mb-4">Favicon</h2>

            <div className="border-2 border-dashed rounded-lg p-4">
              {formData.favicon ? (
                <div className="text-center">
                  <img
                    src={getFullUrl(formData.favicon)}
                    className="h-12 w-12 mx-auto object-contain"
                  />

                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => faviconRef.current?.click()}
                      className="flex-1 border rounded-lg py-2"
                    >
                      Replace
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          favicon: '',
                        }))
                      }
                      className="border border-red-400 text-red-500 px-3 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => faviconRef.current?.click()}
                  className="w-full py-10 text-center"
                >
                  {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                </button>
              )}

              <input
                ref={faviconRef}
                type="file"
                accept="image/png,image/x-icon,image/svg+xml"
                onChange={(e) => handleLogoUpload(e, 'favicon')}
                className="hidden"
              />
            </div>
          </div>

          {/* General Settings */}
          <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
            <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">General</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Site Name</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.siteTagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, siteTagline: e.target.value }))}
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Site Description</label>
              <textarea
                value={formData.siteDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
            <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Social Links</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                  }))}
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Twitter</label>
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                  }))}
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Facebook</label>
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, facebook: e.target.value },
                  }))}
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Instagram</label>
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, instagram: e.target.value },
                  }))}
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Footer Settings */}
          <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
            <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Footer</h2>
            <div>
              <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Copyright Text</label>
              <input
                type="text"
                value={formData.footer.copyrightText}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  footer: { ...prev.footer, copyrightText: e.target.value },
                }))}
                placeholder="© 2024 Growth Valley. All rights reserved."
                className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-accent text-brand-black font-semibold rounded-lg hover:bg-accent-light disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}