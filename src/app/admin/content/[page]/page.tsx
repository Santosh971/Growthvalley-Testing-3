'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { contentAPI, mediaAPI } from '@/lib/admin-api';
import { getImageUrl } from '@/lib/utils';
import AdminLayout from '../../AdminLayout';
import CaseStudiesManager from '@/components/admin/CaseStudiesManager';

interface SectionData {
  [key: string]: any;
}

interface PageContent {
  page: string;
  sections: SectionData;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
  updatedAt?: string;
  isDefault?: boolean;
}

interface SectionInfo {
  name: string;
  type: string;
  fields: string[];
  isArray: boolean;
  isPrimitiveArray?: boolean;
  fieldArrayTypes?: Record<string, { isPrimitive: boolean }>;
}

// Field Editor Component
function FieldEditor({
  label,
  value,
  onChange,
  type = 'text',
  placeholder
}: {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type?: 'text' | 'textarea' | 'number' | 'url';
  placeholder?: string;
}) {
  const inputClasses = "w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white focus:border-accent focus:outline-none rounded-lg";

  return (
    <div className="mb-4">
      <label className="block text-body-sm font-medium text-brand-grey-600 dark:text-brand-grey-300 mb-2">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={inputClasses + " resize-none"}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
}

// Array Item Editor
function ArrayItemEditor({
  item,
  fields,
  onChange,
  onRemove,
  isExpanded,
  onToggle
}: {
  item: any;
  fields: string[];
  onChange: (item: any) => void;
  onRemove: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    try {
      const response = await mediaAPI.upload(file, 'industries');
      if (response.success && response.data?.url) {
        onChange({ ...item, icon: response.data.url });
      } else {
        setUploadError('Failed to upload image');
      }
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="border border-brand-grey-200 dark:border-brand-grey-700 rounded-lg bg-white dark:bg-brand-grey-800">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 text-brand-grey-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-body font-medium text-brand-black dark:text-white">
            {item.title || item.name || item.value || item.client || `Item`}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-brand-grey-200 dark:border-brand-grey-700">
          {fields.map((field) => {
            // Determine input type based on field name
            const getInputType = (fieldName: string): 'text' | 'textarea' | 'number' | 'url' => {
              if (fieldName.includes('description') || fieldName.includes('content')) {
                return 'textarea';
              }
              if (fieldName.toLowerCase() === 'number') {
                return 'number';
              }
              return 'text';
            };

            // Check if this is the icon field
            const isIconField = field.toLowerCase() === 'icon';

            return (
              <div key={field}>
                <label className="block text-body-sm font-medium text-brand-grey-600 dark:text-brand-grey-300 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                {isIconField ? (
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item[field] || ''}
                        onChange={(e) => onChange({ ...item, [field]: e.target.value })}
                        placeholder="Enter icon URL or upload"
                        className="flex-1 px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white focus:border-accent focus:outline-none rounded-lg"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconUpload}
                        ref={fileInputRef}
                        className="hidden"
                        id={`icon-upload-${item.title || item.name || item.value || 'item'}`}
                      />
                      <label
                        htmlFor={`icon-upload-${item.title || item.name || item.value || 'item'}`}
                        className={`px-4 py-3 bg-accent text-brand-black rounded-lg cursor-pointer hover:bg-accent/90 transition-colors flex items-center gap-2 whitespace-nowrap ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        {uploading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span>Upload</span>
                          </>
                        )}
                      </label>
                    </div>
                    {uploadError && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                    )}
                    {item[field] && (
                      <div className="mt-3">
                        <img
                          src={getImageUrl(item[field])}
                          alt="Icon preview"
                          className="w-16 h-16 object-contain rounded-lg border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-900"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.png';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <FieldEditor
                    label=""
                    value={item[field]}
                    onChange={(value) => onChange({ ...item, [field]: value })}
                    type={getInputType(field)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Section Editor Component
function SectionEditor({
  name,
  data,
  fields,
  isArray,
  onUpdate,
  onDelete,
  isPrimitiveArrayField = false,
  fieldArrayTypes = {}
}: {
  name: string;
  data: any;
  fields: string[];
  isArray: boolean;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  isPrimitiveArrayField?: boolean; // True if this array should contain primitives (strings/numbers)
  fieldArrayTypes?: Record<string, { isPrimitive: boolean }>; // Info about nested array fields
}) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // Check if array contains primitive values (strings/numbers)
  // Use both the prop and runtime detection for safety
  const isPrimitiveArray = isArray && (
    isPrimitiveArrayField ||
    ((data || []).length > 0 && (data || []).every((item: any) => typeof item === 'string' || typeof item === 'number'))
  );

  const addItem = () => {
    if (isArray) {
      if (isPrimitiveArray) {
        // Add empty string for primitive arrays
        onUpdate([...(data || []), '']);
        setExpandedItems(new Set([...expandedItems, (data || []).length]));
      } else if (fields.length > 0) {
        // Add object for object arrays with known fields
        const newItem = fields.reduce((obj: any, field) => {
          obj[field] = '';
          return obj;
        }, {});
        onUpdate([...(data || []), newItem]);
        setExpandedItems(new Set([...expandedItems, (data || []).length]));
      }
    }
  };

  const updateItem = (index: number, item: any) => {
    const newData = [...data];
    newData[index] = item;
    onUpdate(newData);
  };

  const removeItem = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    onUpdate(newData);
  };

  const formatSectionName = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <div className="bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 rounded-lg overflow-hidden">
      {/* Section Header */}
      <div
        className="flex items-center justify-between p-4 bg-brand-grey-50 dark:bg-brand-grey-800 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-5 h-5 text-brand-grey-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <div>
            <h3 className="text-heading-4 text-brand-black dark:text-white">
              {formatSectionName(name)}
            </h3>
            <p className="text-xs text-brand-grey-500 dark:text-brand-grey-400">
              {isArray ? `${data?.length || 0} items` : `${fields.length} fields`}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this section?')) {
              onDelete();
            }
          }}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {isArray ? (
            <>
              {isPrimitiveArray ? (
                // Handle primitive arrays (string[] or number[])
                (data || []).length > 0 ? (
                  (data || []).map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={typeof item === 'string' || typeof item === 'number' ? item : ''}
                        onChange={(e) => updateItem(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white focus:border-accent focus:outline-none rounded-lg"
                      />
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-brand-grey-500 text-sm py-4 text-center">No items yet. Click "Add Item" to add one.</p>
                )
              ) : (
                // Handle object arrays
                (data || []).map((item: any, index: number) => (
                  <ArrayItemEditor
                    key={index}
                    item={item}
                    fields={fields}
                    onChange={(newItem) => updateItem(index, newItem)}
                    onRemove={() => removeItem(index)}
                    isExpanded={expandedItems.has(index)}
                    onToggle={() => toggleItem(index)}
                  />
                ))
              )}
              <button
                onClick={addItem}
                className="w-full py-3 border-2 border-dashed border-brand-grey-300 dark:border-brand-grey-600 rounded-lg text-brand-grey-500 dark:text-brand-grey-400 hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Item
              </button>
            </>
          ) : (
            fields.map((field) => {
              const fieldData = data?.[field];
              const isObject = typeof fieldData === 'object' && fieldData !== null && !Array.isArray(fieldData);
              const isArrayField = Array.isArray(fieldData);

              if (isObject) {
                return (
                  <div key={field} className="p-4 bg-brand-grey-50 dark:bg-brand-grey-800 rounded-lg">
                    <h4 className="text-body font-medium text-brand-black dark:text-white mb-4">
                      {formatSectionName(field)}
                    </h4>
                    {Object.keys(fieldData).map((subField) => (
                      <FieldEditor
                        key={subField}
                        label={formatSectionName(subField)}
                        value={fieldData[subField]}
                        onChange={(value) => onUpdate({ ...data, [field]: { ...fieldData, [subField]: value } })}
                        type={subField.includes('description') || subField.includes('content') ? 'textarea' : 'text'}
                      />
                    ))}
                  </div>
                );
              }

              if (isArrayField) {
                // Check if array contains primitive values (strings/numbers) or objects
                // Use fieldArrayTypes from structure if available, otherwise fallback to runtime detection
                const isFieldPrimitiveArray = fieldArrayTypes[field]?.isPrimitive ?? (
                  fieldData.length > 0
                    ? fieldData.every((item: any) => typeof item === 'string' || typeof item === 'number')
                    : true // Default to primitive array for empty arrays
                );

                return (
                  <div key={field} className="p-4 bg-brand-grey-50 dark:bg-brand-grey-800 rounded-lg">
                    <h4 className="text-body font-medium text-brand-black dark:text-white mb-4">
                      {formatSectionName(field)}
                    </h4>
                    <div className="space-y-2">
                      {isFieldPrimitiveArray ? (
                        // Handle primitive arrays (string[] or number[])
                        fieldData.length > 0 ? (
                          fieldData.map((arrItem: any, arrIndex: number) => (
                            <div key={arrIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={typeof arrItem === 'string' || typeof arrItem === 'number' ? arrItem : ''}
                                onChange={(e) => {
                                  const newData = [...fieldData];
                                  newData[arrIndex] = e.target.value;
                                  onUpdate({ ...data, [field]: newData });
                                }}
                                className="flex-1 px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white focus:border-accent focus:outline-none rounded-lg"
                              />
                              <button
                                onClick={() => {
                                  const newData = [...fieldData];
                                  newData.splice(arrIndex, 1);
                                  onUpdate({ ...data, [field]: newData });
                                }}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-brand-grey-500 text-sm">No items yet. Click "Add Item" to add one.</p>
                        )
                      ) : (
                        // Handle object arrays
                        fieldData.map((arrItem: any, arrIndex: number) => (
                          <ArrayItemEditor
                            key={arrIndex}
                            item={arrItem}
                            fields={Object.keys(arrItem)}
                            onChange={(newItem) => {
                              const newData = [...fieldData];
                              newData[arrIndex] = newItem;
                              onUpdate({ ...data, [field]: newData });
                            }}
                            onRemove={() => {
                              const newData = [...fieldData];
                              newData.splice(arrIndex, 1);
                              onUpdate({ ...data, [field]: newData });
                            }}
                            isExpanded={expandedItems.has(arrIndex)}
                            onToggle={() => toggleItem(arrIndex)}
                          />
                        ))
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (isFieldPrimitiveArray) {
                          // Add empty string for primitive arrays
                          onUpdate({ ...data, [field]: [...fieldData, ''] });
                        } else {
                          // Add object for object arrays - use existing item keys or empty object
                          const existingKeys = fieldData[0] ? Object.keys(fieldData[0]) : [];
                          const newItem = existingKeys.length > 0
                            ? existingKeys.reduce((obj: any, key) => { obj[key] = ''; return obj; }, {})
                            : {};
                          onUpdate({ ...data, [field]: [...fieldData, newItem] });
                        }
                      }}
                      className="mt-2 w-full py-2 border-2 border-dashed border-brand-grey-300 dark:border-brand-grey-600 rounded-lg text-brand-grey-500 dark:text-brand-grey-400 hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Item
                    </button>
                  </div>
                );
              }

              return (
                <FieldEditor
                  key={field}
                  label={formatSectionName(field)}
                  value={data?.[field]}
                  onChange={(value) => onUpdate({ ...data, [field]: value })}
                  type={field.includes('description') || field.includes('content') || field.includes('subtitle') ? 'textarea' : 'text'}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// Main Page Editor Component
export default function PageContentEditor() {
  const params = useParams();
  const router = useRouter();
  const pageName = params.page as string;

  // Map content page names to frontend routes
  const pageRouteMap: Record<string, string> = {
    'about': 'company',      // 'about' content maps to /company page
    'home': '',              // home maps to root
    'casestudies': 'case-studies', // casestudies maps to case-studies
    'case-studies': 'case-studies',
    'contact': 'contact',
    'industries': 'industries',
    'services': 'solutions', // services content maps to /solutions page
    'solutions': 'solutions',
    'privacy': 'privacy',
    'terms': 'terms',
    'blog': 'blog',
  };

  const previewRoute = pageRouteMap[pageName.toLowerCase()] ?? pageName;

  const [content, setContent] = useState<PageContent | null>(null);
  const [structure, setStructure] = useState<SectionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sections' | 'seo' | 'casestudies'>('sections');

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [contentRes, structureRes] = await Promise.all([
        contentAPI.getPageContent(pageName),
        contentAPI.getPageStructure(pageName),
      ]);

      if (contentRes.success) {

        setContent(contentRes.data);

      }
      if (structureRes.success) {
        setStructure(structureRes.data.sections);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [pageName]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleSave = async () => {
    if (!content) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await contentAPI.updatePageContent(pageName, {
        sections: content.sections,
        seo: content.seo,
      });

      if (response.success) {
        setSuccess('Content saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset this page to default content? All your changes will be lost.')) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const response = await contentAPI.resetPageContent(pageName);
      if (response.success) {
        // Reload content from server to ensure frontend is in sync
        await loadContent();

        setSuccess('Page reset to defaults successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to reset content');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset content');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionName: string, data: any) => {
    setContent(prev => prev ? {
      ...prev,
      sections: {
        ...prev.sections,
        [sectionName]: data
      }
    } : null);
  };

  const deleteSection = (sectionName: string) => {
    setContent(prev => {
      if (!prev) return null;
      const newSections = { ...prev.sections };
      delete newSections[sectionName];
      return { ...prev, sections: newSections };
    });
  };

  const updateSEO = (field: string, value: any) => {
    setContent(prev => prev ? {
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    } : null);
  };

  const formatSectionName = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-brand-grey-200 dark:bg-brand-grey-800 rounded mb-6"></div>
            <div className="h-96 bg-brand-grey-200 dark:bg-brand-grey-800 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        {/* <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link
              href="/admin/content"
              className="p-2 hover:bg-brand-grey-100 dark:hover:bg-brand-grey-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-brand-grey-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div>
              <h1 className="text-heading-2 lg:text-heading-1 text-brand-black dark:text-white">
                Edit {formatSectionName(pageName)} Page
              </h1>
              {content?.updatedAt && (
                <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400">
                  Last updated: {new Date(content.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <a
              href={`/${previewRoute}`}
              target="_blank"
              className="px-3 lg:px-4 py-2 border border-brand-grey-300 dark:border-brand-grey-700 text-brand-black dark:text-white rounded-lg hover:border-accent transition-colors flex items-center gap-2 text-sm lg:text-base"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Preview
            </a>
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-3 lg:px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 text-sm lg:text-base"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 lg:px-6 py-2 bg-accent text-brand-black rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm lg:text-base"
            >
              {saving && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div> */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link
              href="/admin/content"
              className="p-2 hover:bg-brand-grey-100 dark:hover:bg-brand-grey-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-brand-grey-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div>
              <h1 className="text-heading-2 lg:text-heading-1 text-brand-black dark:text-white">
                Edit {formatSectionName(pageName)} Page
              </h1>
              {content?.updatedAt && (
                <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400">
                  Last updated: {new Date(content.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <a
              href={`/${previewRoute}`}
              target="_blank"
              className="px-3 lg:px-4 py-2 border border-brand-grey-300 dark:border-brand-grey-700 text-brand-black dark:text-white rounded-lg hover:border-accent transition-colors flex items-center gap-2 text-sm lg:text-base"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Preview
            </a>
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-3 lg:px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 text-sm lg:text-base"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 lg:px-6 py-2 bg-accent text-brand-black rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm lg:text-base"
            >
              {saving && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-brand-grey-200 dark:border-brand-grey-800">
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-3 border-b-2 transition-colors ${activeTab === 'sections'
              ? 'border-accent text-accent'
              : 'border-transparent text-brand-grey-500 hover:text-brand-black dark:hover:text-white'
              }`}
          >
            Sections ({Object.keys(content?.sections || {}).length})
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-3 border-b-2 transition-colors ${activeTab === 'seo'
              ? 'border-accent text-accent'
              : 'border-transparent text-brand-grey-500 hover:text-brand-black dark:hover:text-white'
              }`}
          >
            SEO Settings
          </button>
          {pageName === 'casestudies' && (
            <button
              onClick={() => setActiveTab('casestudies')}
              className={`px-4 py-3 border-b-2 transition-colors ${activeTab === 'casestudies'
                ? 'border-accent text-accent'
                : 'border-transparent text-brand-grey-500 hover:text-brand-black dark:hover:text-white'
                }`}
            >
              Case Studies
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            {Object.entries(content?.sections || {}).map(([sectionName, sectionData]) => {
              const sectionInfo = structure.find(s => s.name === sectionName);
              return (
                <SectionEditor
                  key={sectionName}
                  name={sectionName}
                  data={sectionData}
                  fields={sectionInfo?.fields || Object.keys(sectionData || {})}
                  isArray={Array.isArray(sectionData)}
                  isPrimitiveArrayField={sectionInfo?.isPrimitiveArray}
                  fieldArrayTypes={sectionInfo?.fieldArrayTypes || {}}
                  onUpdate={(data) => updateSection(sectionName, data)}
                  onDelete={() => {
                    if (confirm('Are you sure you want to delete this section?')) {
                      deleteSection(sectionName);
                    }
                  }}
                />
              );
            })}

            {Object.keys(content?.sections || {}).length === 0 && (
              <div className="text-center py-12 text-brand-grey-500 dark:text-brand-grey-400">
                <p>No sections found. Reset to defaults to load default content.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 rounded-lg p-6">
            <h3 className="text-heading-3 text-brand-black dark:text-white mb-6">SEO Settings</h3>

            <FieldEditor
              label="Meta Title"
              value={content?.seo?.metaTitle}
              onChange={(value) => updateSEO('metaTitle', value)}
              placeholder={`${formatSectionName(pageName)} - Growth Valley`}
            />

            <FieldEditor
              label="Meta Description"
              value={content?.seo?.metaDescription}
              onChange={(value) => updateSEO('metaDescription', value)}
              type="textarea"
              placeholder="Brief description for search engines..."
            />

            <div className="mb-4">
              <label className="block text-body-sm font-medium text-brand-grey-600 dark:text-brand-grey-300 mb-2">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={(content?.seo?.keywords || []).join(', ')}
                onChange={(e) => updateSEO('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
                placeholder="revenue operations, consulting, B2B..."
                className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white focus:border-accent focus:outline-none rounded-lg"
              />
            </div>

            <FieldEditor
              label="OG Image URL"
              value={content?.seo?.ogImage}
              onChange={(value) => updateSEO('ogImage', value)}
              type="url"
              placeholder="https://example.com/image.jpg"
            />

            <FieldEditor
              label="Canonical URL"
              value={content?.seo?.canonicalUrl}
              onChange={(value) => updateSEO('canonicalUrl', value)}
              type="url"
              placeholder="https://growthvalley.com/page"
            />
          </div>
        )}

        {activeTab === 'casestudies' && pageName === 'casestudies' && (
          <CaseStudiesManager />
        )}
      </div>
    </AdminLayout>
  );
}