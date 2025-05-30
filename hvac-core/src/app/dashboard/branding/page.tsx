'use client';

import { useState } from 'react';
import { 
  Palette,
  Image,
  Type,
  Save,
  Upload,
  Eye,
  Trash2,
  Check
} from 'lucide-react';

// Mock data for demonstration
const mockBranding = {
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  accentColor: '#F59E0B',
  logo: '/images/logo.png',
  fontFamily: 'Inter',
  theme: 'light'
};

const FONT_FAMILIES = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Poppins'
];

const THEMES = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
  { id: 'system', name: 'System Default' }
];

export default function BrandingPage() {
  const [branding, setBranding] = useState(mockBranding);
  const [isPreview, setIsPreview] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleColorChange = (colorType, value) => {
    setBranding(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving branding:', branding);
  };

  const renderColorPicker = (label, colorType) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={branding[colorType]}
          onChange={(e) => handleColorChange(colorType, e.target.value)}
          className="h-10 w-10 rounded border border-gray-300"
        />
        <input
          type="text"
          value={branding[colorType]}
          onChange={(e) => handleColorChange(colorType, e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Custom Branding</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Eye className="h-5 w-5 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        {isPreview ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-center h-96 text-gray-500">
              Brand preview will be implemented here
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  <Palette className="h-5 w-5 inline-block mr-2" />
                  Colors
                </h2>
                <div className="space-y-4">
                  {renderColorPicker('Primary Color', 'primaryColor')}
                  {renderColorPicker('Secondary Color', 'secondaryColor')}
                  {renderColorPicker('Accent Color', 'accentColor')}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  <Type className="h-5 w-5 inline-block mr-2" />
                  Typography
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Font Family
                    </label>
                    <select
                      value={branding.fontFamily}
                      onChange={(e) => setBranding(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {FONT_FAMILIES.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  <Image className="h-5 w-5 inline-block mr-2" />
                  Logo & Images
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Logo
                    </label>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-16 w-16 object-contain"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                            <Image className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex space-x-2">
                          <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                            <Upload className="h-5 w-5 mr-2" />
                            Upload
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleLogoUpload}
                            />
                          </label>
                          {logoPreview && (
                            <button
                              onClick={() => setLogoPreview(null)}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Trash2 className="h-5 w-5 mr-2" />
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Recommended size: 200x200px, PNG or SVG format
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Theme
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setBranding(prev => ({ ...prev, theme: theme.id }))}
                        className={`p-4 rounded-lg border ${
                          branding.theme === theme.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {theme.name}
                          </span>
                          {branding.theme === theme.id && (
                            <Check className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 