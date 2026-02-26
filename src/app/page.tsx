// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          DCarbon Email Preview
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Preview and test your email templates from the DCarbon CMS.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Templates</h2>
          <p className="text-gray-600 mb-4">
            To preview a template, use the preview button in your Strapi admin panel.
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-2">Example preview URL:</p>
            <code className="text-sm bg-gray-100 p-2 rounded block">
              /preview?templateKey=USER_WELCOME&status=draft
            </code>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-medium text-gray-800 mb-2">How to use</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
              <li>Create templates in Strapi admin</li>
              <li>Click &quot;Open preview&quot; in the template editor</li>
              <li>View the rendered email with sample data</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-medium text-gray-800 mb-2">Features</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Live template rendering</li>
              <li>Draft/Published toggle</li>
              <li>Sample data injection</li>
              <li>Responsive previews</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}