// src/app/preview/PreviewContent.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';

interface Template {
  id: number;
  documentId: string;
  templateKey: string;
  name: string;
  category: string;
  subject: string;
  preheader?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  bodyHtml: any[];
  bodyText?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export default function PreviewContent() {
  const searchParams = useSearchParams();
  const templateKey = searchParams.get('templateKey');
  const status = searchParams.get('status') || 'draft';
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isEnabled, setIsEnabled] = useState(false);

  const extractHtmlFromRichText = (nodes: any[]): string => {
    if (!nodes || !Array.isArray(nodes)) return '';
    
    let html = '';
    
    nodes.forEach((node: any) => {
      if (node.type === 'paragraph' && node.children) {
        node.children.forEach((child: any) => {
          if (child.type === 'text') {
            html += child.text || '';
          }
        });
      }
    });
    
    return html;
  };

  const renderText = (text: string, data: any): string => {
    if (!text) return '';
    
    let rendered = text;
    
    const allVars = {
      'user.firstName': data.user.firstName,
      'user.lastName': data.user.lastName,
      'user.email': data.user.email,
      'facility.name': data.facility.name,
      'facility.id': data.facility.id,
      'facility.utilityName': data.facility.utilityName,
    };
    
    Object.entries(allVars).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    });
    
    return rendered;
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!templateKey) {
        setError('No template key provided');
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const params = new URLSearchParams({
          'filters[templateKey][$eq]': templateKey,
        });
        
        if (status === 'draft') {
          params.append('status', 'draft');
        }
        
        const url = `${apiUrl}/api/templates?${params.toString()}`;
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch template');
        }
        
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setTemplate(data.data[0]);
          setIsEnabled(document.cookie.includes('__prerender_bypass'));
        } else {
          setError('Template not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateKey, status]);

  const deviceWidths = {
    mobile: 'w-[375px]',
    tablet: 'w-[768px]',
    desktop: 'w-full',
  };

  const sampleData = {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
    facility: {
      name: 'Solar Farm Alpha',
      id: 'FAC-001',
      utilityName: 'National Grid',
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            {error || 'Template Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {!templateKey ? 'No template key provided.' : `Could not find template with key: ${templateKey}`}
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const rawHtml = extractHtmlFromRichText(template.bodyHtml);
  const renderedHtml = renderText(rawHtml, sampleData);
  const renderedSubject = renderText(template.subject || '', sampleData);
  const renderedPreheader = template.preheader ? renderText(template.preheader, sampleData) : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm font-medium text-gray-500">Preview:</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  status === 'published' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  {status}
                </span>
                {isEnabled && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                    Draft Mode
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm sm:text-base font-semibold text-gray-900">
                {template.name}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {template.templateKey}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500 bg-gray-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setDevice('mobile')}
                className={`p-2 rounded-lg transition-colors ${
                  device === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'hover:bg-white/50'
                }`}
                title="Mobile view"
              >
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-2 rounded-lg transition-colors ${
                  device === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'hover:bg-white/50'
                }`}
                title="Tablet view"
              >
                <Tablet className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setDevice('desktop')}
                className={`p-2 rounded-lg transition-colors ${
                  device === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'hover:bg-white/50'
                }`}
                title="Desktop view"
              >
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          
          {renderedSubject && (
            <div className="mt-3 pt-3 border-t border-gray-200/60">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Subject</span>
                <span className="text-sm sm:text-base text-gray-900 font-medium">
                  {renderedSubject}
                </span>
              </div>
              {renderedPreheader && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1.5">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Preheader</span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {renderedPreheader}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="mb-6 sm:mb-8 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <details className="group">
            <summary className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer list-none flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  Sample Data
                </span>
                <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">
                  Used for preview
                </span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <span className="text-blue-600 group-open:rotate-180 transition-transform text-xs sm:text-sm">
                  ▼
                </span>
              </div>
            </summary>
            <div className="p-4 sm:p-6 bg-white">
              <pre className="text-xs sm:text-sm font-mono bg-gray-50 p-4 rounded-xl overflow-x-auto border border-gray-200">
                {JSON.stringify(sampleData, null, 2)}
              </pre>
            </div>
          </details>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-400">To:</span>
                <span className="text-xs sm:text-sm text-gray-600 truncate">recipient@example.com</span>
              </div>
              <span className="text-xs text-gray-400 hidden sm:block">Today</span>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 md:p-8 overflow-x-auto">
            <div className={`mx-auto transition-all duration-300 ${deviceWidths[device]}`}>
              {renderedHtml ? (
                <iframe
                  srcDoc={renderedHtml}
                  className="w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] border-0 rounded-lg"
                  title="Email Preview"
                  sandbox="allow-same-origin allow-popups"
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No HTML content in template</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-sm sm:text-base shadow-sm active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Back to Templates</span>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium text-sm sm:text-base shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Reload</span>
            <span className="hidden sm:inline">Reload Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}