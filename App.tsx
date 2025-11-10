import React, { useState, useMemo } from 'react';
import { initialTools } from './data';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allTools, setAllTools] = useState(initialTools || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', description: '', category: '', toolUrl: '', featured: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Separate featured and regular tools
  const featuredTools = useMemo(() => {
    return allTools.filter(tool => tool.featured);
  }, [allTools]);

  // Filtered tools for search (excluding featured in main list)
  const filteredTools = useMemo(() => {
    let result = allTools.filter(tool => !tool.featured);
    
    if (searchQuery.trim()) {
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return result;
  }, [searchQuery, allTools]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddTool = () => {
    if (newTool.name && newTool.toolUrl) {
      const tool = {
        id: `tool-${Date.now()}`,
        ...newTool,
      };
      setAllTools([...allTools, tool]);
      setNewTool({ name: '', description: '', category: '', toolUrl: '', featured: false });
      setShowAddForm(false);
      setCurrentPage(1);
    }
  };

  const handleDeleteTool = (id) => {
    setAllTools(allTools.filter(tool => tool.id !== id));
  };

  const toggleFeatured = (id) => {
    setAllTools(allTools.map(tool => 
      tool.id === id ? { ...tool, featured: !tool.featured } : tool
    ));
  };

  const removeFeatured = (id) => {
    setAllTools(allTools.map(tool => 
      tool.id === id ? { ...tool, featured: false } : tool
    ));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-5xl font-bold text-blue-400 mb-2">AI Toolkit</h1>
        <p className="text-gray-400 text-lg">Complete collection of AI tools and resources</p>
      </div>

      {/* Featured Tools Section */}
      {featuredTools.length > 0 && (
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-gradient-to-br from-blue-900 to-purple-900 border border-blue-700 rounded-lg p-6 hover:shadow-lg hover:shadow-blue-500/50 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">⭐</span>
                  <button
                    onClick={() => removeFeatured(tool.id)}
                    className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition"
                    title="Remove from featured"
                  >
                    Remove
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-300 mb-3">{tool.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-300 bg-blue-950 px-2 py-1 rounded">
                    {tool.category}
                  </span>
                  <a
                    href={tool.toolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded font-medium transition"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Controls Section */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition flex items-center gap-2"
          >
            <span>+ Add Tool</span>
          </button>
        </div>

        {/* Add Tool Form */}
        {showAddForm && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Add New Tool</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tool Name"
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                className="bg-gray-900 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Category"
                value={newTool.category}
                onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                className="bg-gray-900 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              placeholder="Description"
              value={newTool.description}
              onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
              className="w-full bg-gray-900 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            />
            <input
              type="url"
              placeholder="Tool URL"
              value={newTool.toolUrl}
              onChange={(e) => setNewTool({ ...newTool, toolUrl: e.target.value })}
              className="w-full bg-gray-900 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newTool.featured}
                onChange={(e) => setNewTool({ ...newTool, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-white">Add to Featured Tools</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleAddTool}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
              >
                Save Tool
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* All Tools List */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">All Tools</h2>
        <div className="space-y-3">
          {paginatedTools.length > 0 ? (
            paginatedTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 hover:border-gray-600 transition flex items-start justify-between group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0 mt-1">•</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">{tool.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{tool.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-blue-400 bg-gray-900 px-2 py-1 rounded">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => toggleFeatured(tool.id)}
                    className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 rounded transition font-medium"
                    title="Add to featured"
                  >
                    ⭐ Featured
                  </button>
                  <a
                    href={tool.toolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded font-medium transition"
                  >
                    Open
                  </a>
                  <button
                    onClick={() => handleDeleteTool(tool.id)}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tools found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-medium transition"
            >
              ← Previous
            </button>
            
            <div className="text-gray-400 px-4">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-medium transition"
            >
              Next →
            </button>
          </div>
          
          <div className="text-gray-400">
            Total: {filteredTools.length} tools
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
