'use client';

import { Star } from 'lucide-react';

interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  date: string;
  service: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
          <p className="text-lg text-gray-600 mb-8">What our customers say about our services</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{review.comment}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="font-medium">{review.author}</span>
                <span>{review.date}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Service: {review.service}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 