'use client';

import React from 'react';

export function ChatStyles() {
  return (
    <style jsx global>{`
      .product-html-content {
        @apply text-current mt-2;
      }
      .product-html-content a {
        @apply text-blue-500 no-underline;
      }
      .product-html-content a:hover {
        @apply underline;
      }
      .product-html-content img {
        @apply max-w-full h-auto object-cover rounded;
      }
      .product-results {
        @apply flex flex-col gap-3 my-2;
      }
      .product-card {
        @apply flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow;
      }
      .product-image {
        @apply w-20 h-20 flex-shrink-0;
      }
      .product-image img {
        @apply w-full h-full object-cover;
      }
      .product-info {
        @apply p-2 flex-grow;
      }
      .product-name {
        @apply font-semibold text-sm text-gray-900 mb-1;
      }
      .product-price {
        @apply text-red-500 font-semibold text-xs mb-1.5;
      }
      .product-description {
        @apply text-xs text-gray-600 line-clamp-2 mb-2;
      }
      .product-link {
        @apply inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors;
      }
    `}</style>
  );
}
