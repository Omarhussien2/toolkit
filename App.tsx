import React, { useState, useMemo } from 'react';
import { initialTools } from './data';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'featured'

  // Filter tools based on search and featured status
  const filteredTools = useMemo(() => {
    let result = initialTools || [];
    
    if (filterMode === 'featured') {
      result = result.filter(tool => tool.featured);
    }
    
    if (searchQuery.trim()) {
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return result;
  }, [searchQuery, filterMode]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-blue-400">AI Toolkit</h1>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
          <button
            onClick={() => setFilterMode(filterMode === 'all' ? 'featured' : 'all')}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded font-medium transition"
          >
            {filterMode === 'all' ? 'All' : 'Featured'}
          </button>
        </div>
      </div>

      {/* Tools List */}
      <div className="max-w-2xl mx-auto space-y-4">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => window.open(tool.toolUrl, '_blank')}
              className="bg-gray-900 border border-gray-800 rounded p-5 hover:bg-gray-800 hover:border-gray-700 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Star Icon */}
                {tool.featured && (
                  <span className="text-yellow-400 text-xl mt-1 flex-shrink-0">⭐</span>
                )}
                {!tool.featured && (
                  <span className="text-gray-600 text-xl mt-1 flex-shrink-0">•</span>
                )}
                
                {/* Tool Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-400">{tool.description}</p>
                </div>
              </div>
              
              {/* Category Link */}
              {tool.category && (
                <a
                  href={tool.toolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-4 text-sm text-blue-400 hover:text-blue-300 transition flex-shrink-0 font-medium"
                >
                  {tool.category}
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tools found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
