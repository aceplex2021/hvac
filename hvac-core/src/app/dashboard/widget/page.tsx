'use client';

import { useState } from 'react';
import { 
  Palette,
  Code,
  Copy,
  Check,
  Settings,
  Eye
} from 'lucide-react';

interface WidgetConfig {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  services: {
    id: number;
    name: string;
    price: string;
    duration: string;
  }[];
}

export default function WidgetConfigPage() {
  const [config, setConfig] = useState<WidgetConfig>({
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    textColor: '#1F2937',
    backgroundColor: '#FFFFFF',
    services: [
      { id: 1, name: 'AC Installation', price: 'Starting at $2,500', duration: '4-6 hours' },
      { id: 2, name: 'AC Repair', price: 'Starting at $99', duration: '1-2 hours' },
      { id: 3, name: 'Maintenance', price: 'Starting at $79', duration: '1 hour' },
    ],
  });

  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = (field: keyof WidgetConfig, value: string) => {
    setConfig({
      ...config,
      [field]: value,
    });
  };

  const generateEmbedCode = () => {
    return `<div id="hvac-booking-widget"></div>
<script>
  window.hvacWidgetConfig = ${JSON.stringify(config)};
</script>
<script src="https://widget.hvacapp.com/widget.js"></script>`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Booking Widget Configuration</h1>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <Eye className="w-4 h-4 mr-2" />
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        {!previewMode && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Settings className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold">Widget Settings</h2>
            </div>

            <div className="space-y-6">
              {/* Color Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-full h-10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="w-full h-10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="w-full h-10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="w-full h-10 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-medium mb-4">Services</h3>
                <div className="space-y-4">
                  {config.services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Name
                          </label>
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => {
                              const newServices = [...config.services];
                              newServices[service.id - 1].name = e.target.value;
                              setConfig({ ...config, services: newServices });
                            }}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                          </label>
                          <input
                            type="text"
                            value={service.price}
                            onChange={(e) => {
                              const newServices = [...config.services];
                              newServices[service.id - 1].price = e.target.value;
                              setConfig({ ...config, services: newServices });
                            }}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embed Code */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Embed Code</h3>
                  <button
                    onClick={copyEmbedCode}
                    className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {generateEmbedCode()}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Eye className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-semibold">Widget Preview</h2>
          </div>
          <div className="border rounded-lg p-4">
            {/* TODO: Add actual widget preview component */}
            <div className="text-center text-gray-500">
              Widget preview will be displayed here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 