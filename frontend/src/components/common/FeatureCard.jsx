// src/components/common/FeatureCard.jsx
import React from "react";

export default function FeatureCard({ title, description, icon }) {
  return (
    <article className="bg-white rounded-xl shadow px-6 py-5 hover:shadow-lg transition flex gap-4 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
        {/* icon can be an element or a string (first letter) */}
        {icon ? (
          <span className="text-blue-600">{icon}</span>
        ) : (
          <span className="text-blue-600 font-bold">{title?.charAt(0)}</span>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </article>
  );
}
