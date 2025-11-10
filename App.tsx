import React, { useState, useMemo } from 'react';
import { initialTools } from './data';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allTools, setAllTools] = useState(initialTools || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', description: '', category: '', toolUrl: '', featured: false })
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

  const totalTools = filteredTools.length;
  const totalPages = Math.ceil(totalTools / itemsPerPage);
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const deleteTool = (id) => {
    setAllTools(allTools.filter(tool => tool.id !== id));
    if (paginatedTools.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddTool = () => {
    if (newTool.name.trim()) {
      setAllTools([...allTools, { ...newTool, id: Date.now() }]);
      setNewTool({ name: '', description: '', category: '', toolUrl: '', featured: false });
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📄</div>
            <h1 className="text-3xl font-bold text-blue-400">AI Toolkit</h1>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-2">Complete collection of AI tools and resources</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Tools Section */}
        {featuredTools.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">⭐ Featured Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTools.map(tool => (
                <div key={tool.id} className="bg-gradient-to-br from-blue-900 to-purple-900 border border-blue-700 rounded-lg p-4 hover:shadow-lg hover:shadow-blue-500/20 transition-shadow group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl">⭐</span>
                    <button
                      onClick={() => removeFeatured(tool.id)}
                      className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{tool.name}</h3>
                  <p className="text-sm text-gray-200 mb-3 min-h-12">{tool.description || 'No description available'}</p>
                  <div className="flex items-center justify-between">
                    <a
                      href={tool.toolUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm font-semibold transition-colors"
                    >
                      Open
                    </a>
                    {tool.category && (
                      <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs">{tool.category}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Add Tool Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-stretch">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded font-semibold text-sm transition-colors whitespace-nowrap"
          >
            + Add Tool
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search for tools..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Add Tool Form */}
        {showAddForm && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                value={newTool.name}
                onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                placeholder="Tool name"
                className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={newTool.category}
                onChange={(e) => setNewTool({...newTool, category: e.target.value})}
                placeholder="Category"
                className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <textarea
                value={newTool.description}
                onChange={(e) => setNewTool({...newTool, description: e.target.value})}
                placeholder="Description"
                className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 sm:col-span-2"
                rows="2"
              />
              <input
                type="url"
                value={newTool.toolUrl}
                onChange={(e) => setNewTool({...newTool, toolUrl: e.target.value})}
                placeholder="Tool URL"
                className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 sm:col-span-2"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newTool.featured}
                  onChange={(e) => setNewTool({...newTool, featured: e.target.checked})}
                  className="w-4 h-4"
                />
                Add to Featured Tools
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddTool}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm font-semibold transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* All Tools Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">All Tools</h2>
          {filteredTools.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No tools found</div>
          ) : (
            <div className="space-y-3">
              {paginatedTools.map(tool => (
                <div key={tool.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white">{tool.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{tool.description || 'No description available'}</p>
                    <div className="flex flex-wrap gap-2">
                      {tool.category && (
                        <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs">• {tool.category}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => deleteTool(tool.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-semibold transition-colors"
                    >
                      Delete
                    </button>
                    <a
                      href={tool.toolUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs font-semibold transition-colors text-center"
                    >
                      Open
                    </a>
                    <button
                      onClick={() => toggleFeatured(tool.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-xs font-semibold transition-colors"
                    >
                      ⭐ Featured
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredTools.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400">
              Total: {filteredTools.length} tools
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-3 py-1 rounded text-xs font-semibold transition-colors"
              >
                ← Previous
              </button>
              <div className="px-3 py-1 text-xs font-semibold">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-3 py-1 rounded text-xs font-semibold transition-colors"
              >
                Next →
              </button>
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
