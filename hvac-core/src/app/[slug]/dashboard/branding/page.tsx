'use client';

import { useState } from 'react';
// import { 
//   Palette,
//   Image,
//   Type,
//   Save,
//   Upload,
//   Eye,
//   Trash2,
//   Check
// } from 'lucide-react';

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
  // const [logoPreview, setLogoPreview] = useState(null);

  // const handleColorChange = (colorType, value) => {
  //   setBranding(prev => ({
  //     ...prev,
  //     [colorType]: value
  //   }));
  // };

  // const handleLogoUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setLogoPreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleSave = () => {
  //   // Implement save functionality
  //   console.log('Saving branding:', branding);
  // };

  // const renderColorPicker = (label, colorType) => (
  //   <div className="space-y-2">
  //     <label className="block text-sm font-medium text-gray-700">
  //       {label}
  //     </label>
  //     <div className="flex items-center space-x-2">
  //       <input
  //         type="color"
  //         value={branding[colorType]}
  //         onChange={(e) => handleColorChange(colorType, e.target.value)}
  //         className="h-10 w-10 rounded border border-gray-300"
  //       />
  //       <input
  //         type="text"
  //         value={branding[colorType]}
  //         onChange={(e) => handleColorChange(colorType, e.target.value)}
  //         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
  //       />
  //     </div>
  //   </div>
  // );

  return (
    <div className="py-6">
      <h1>Branding page temporarily disabled for demo</h1>
    </div>
  );
} 