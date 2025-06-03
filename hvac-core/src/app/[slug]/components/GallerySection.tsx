'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption?: string;
}

interface GallerySectionProps {
  images: GalleryImage[];
  title?: string;
  description?: string;
}

export default function GallerySection({ 
  images, 
  title = "Our Work Gallery", 
  description = "Browse through our collection of completed projects and service work"
}: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-lg text-gray-600 mb-8">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div 
              key={image.id}
              className="relative aspect-w-16 aspect-h-9 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                  <p className="text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full mx-4">
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </button>
              <div className="relative aspect-w-16 aspect-h-9">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                />
              </div>
              {selectedImage.caption && (
                <div className="bg-white p-4 rounded-b-lg">
                  <p className="text-gray-900">{selectedImage.caption}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 