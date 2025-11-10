import React, { useState, useMemo, useEffect } from 'react';
import { initialTools } from './data';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [allTools, setAllTools] = useState(initialTools || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', description: '', category: '', toolUrl: '', featured: false });

  // Filter and search logic
  const filteredTools = useMemo(() => {
    let result = allTools;
    
    if (filterMode === 'featured') {
      result = result.filter(tool => tool.featured);
    }
    
    if (searchQuery.trim()) {
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return result;
  }, [searchQuery, filterMode, allTools]);

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

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">AI Toolkit</h1>
        <p className="text-gray-400">Complete collection of AI tools and resources</p>
      </div>

      {/* Search & Filter Section */}
      <div className="max-w-4xl mx-auto mb-6 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-800 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
          <button
            onClick={() => {
              setFilterMode(filterMode === 'all' ? 'featured' : 'all');
              setCurrentPage(1);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium transition"
          >
            {filterMode === 'all' ? 'Show Featured' : 'Show All'}
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded font-medium transition"
          >
            + Add Tool
          </button>
        </div>

        {/* Add Tool Form */}
        {showAddForm && (
          <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-3">
            <input
              type="text"
              placeholder="Tool Name"
              value={newTool.name}
              onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
              className="w-full bg-gray-900 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description"
              value={newTool.description}
              onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
              className="w-full bg-gray-900 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            />
            <input
              type="text"
              placeholder="Category"
              value={newTool.category}
              onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
              className="w-full bg-gray-900 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="Tool URL"
              value={newTool.toolUrl}
              onChange={(e) => setNewTool({ ...newTool, toolUrl: e.target.value })}
              className="w-full bg-gray-900 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newTool.featured}
                onChange={(e) => setNewTool({ ...newTool, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Mark as Featured</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleAddTool}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition"
              >
                Save Tool
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tools List */}
      <div className="max-w-4xl mx-auto space-y-3 mb-6">
        {paginatedTools.length > 0 ? (
          paginatedTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-gray-900 border border-gray-800 rounded p-4 hover:bg-gray-800 hover:border-gray-700 transition flex items-start justify-between group"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 mt-1">
                  {tool.featured ? (
                    <span className="text-yellow-400 text-2xl">⭐</span>
                  ) : (
                    <span className="text-gray-600 text-2xl">•</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{tool.description}</p>
                  <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                    {tool.category && <span className="text-blue-400">{tool.category}</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <a
                  href={tool.toolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition font-medium"
                >
                  Open
                </a>
                <button
                  onClick={() => handleDeleteTool(tool.id)}
                  className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition font-medium"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
            >
              ← Previous
            </button>
            
            <div className="text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
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
