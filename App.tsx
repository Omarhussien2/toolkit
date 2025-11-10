import React, { useState, useMemo, useEffect } from 'react';
import { initialTools } from './data';

const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1VlfBPQw79zF9Znafn_lvclGAdMmwwCs_S5PaPrMb4Ak/';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allTools, setAllTools] = useState(initialTools || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', description: '', category: '', toolUrl: '', featured: false })
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [featuredToolIds, setFeaturedToolIds] = useState([]);

  // Load featured tools from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('featuredTools');
      if (saved) {
        setFeaturedToolIds(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading featured tools from localStorage:', error);
    }
  }, []);

  // Save featured tools to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('featuredTools', JSON.stringify(featuredToolIds));
    } catch (error) {
      console.error('Error saving featured tools to localStorage:', error);
    }
  }, [featuredToolIds]);

  // Separate featured and regular tools
  const featuredTools = useMemo(() => {
    return allTools.filter(tool => featuredToolIds.includes(tool.id));
  }, [allTools, featuredToolIds]);

  // Filtered tools for search (excluding featured in main list)
  const filteredTools = useMemo(() => {
    let result = allTools.filter(tool => !featuredToolIds.includes(tool.id));

    if (searchQuery.trim()) {
      result = result.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [allTools, searchQuery, featuredToolIds]);

  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTools.slice(startIndex, endIndex);
  }, [filteredTools, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);

  const handleAddTool = () => {
    if (newTool.name.trim()) {
      const tool = {
        id: Date.now().toString(),
        name: newTool.name,
        description: newTool.description,
        category: newTool.category || 'Other',
        toolUrl: newTool.toolUrl,
        featured: false
      };
      setAllTools([...allTools, tool]);
      setNewTool({ name: '', description: '', category: '', toolUrl: '', featured: false });
      setShowAddForm(false);
    }
  };

  const handleDeleteTool = (toolId) => {
    setAllTools(allTools.filter(tool => tool.id !== toolId));
    setFeaturedToolIds(featuredToolIds.filter(id => id !== toolId));
  };

  const handleToggleFeatured = (toolId) => {
    if (featuredToolIds.includes(toolId)) {
      setFeaturedToolIds(featuredToolIds.filter(id => id !== toolId));
    } else {
      setFeaturedToolIds([...featuredToolIds, toolId]);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'AI': 'bg-blue-900 border-l-4 border-blue-400',
      'Writing': 'bg-purple-900 border-l-4 border-purple-400',
      'Image': 'bg-pink-900 border-l-4 border-pink-400',
      'Code': 'bg-green-900 border-l-4 border-green-400',
      'Voice': 'bg-orange-900 border-l-4 border-orange-400',
      'Video': 'bg-red-900 border-l-4 border-red-400',
      'Other': 'bg-gray-800 border-l-4 border-gray-500',
    };
    return colors[category] || colors['Other'];
  };

  const ToolCard = ({ tool, isFeatured = false }) => (
    <div className={`p-4 rounded-lg ${getCategoryColor(tool.category)}`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl">📄</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm break-words">{tool.name}</h3>
          <p className="text-gray-300 text-xs mt-1 line-clamp-2">{tool.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-blue-300 text-xs bg-blue-900 px-2 py-1 rounded">{tool.category}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center gap-2 mt-3">
        <button
          onClick={() => handleDeleteTool(tool.id)}
          className="p-1.5 hover:bg-gray-700 rounded transition text-red-400 hover:text-red-300"
          title="Delete"
        >
          🗑️
        </button>
        
        <button
          onClick={() => window.open(tool.toolUrl, '_blank')}
          className="p-2 hover:bg-gray-700 rounded transition text-blue-400 hover:text-blue-300 text-lg"
          title="Open"
        >
          ↗️
        </button>
        
        <button
          onClick={() => handleToggleFeatured(tool.id)}
          className={`p-1.5 hover:bg-gray-700 rounded transition ${
            featuredToolIds.includes(tool.id)
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-gray-500 hover:text-gray-400'
          }`}
          title="Toggle Featured"
        >
          ⭐
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">AI Toolkit</h1>
        <p className="text-gray-400 mb-6">Explore and manage AI tools</p>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tools by name, description, or category..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Add Tool Button and Form */}
        <div className="mb-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              + Add Tool
            </button>
          ) : (
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <input
                type="text"
                placeholder="Tool Name"
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded mb-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <input
                type="text"
                placeholder="Description"
                value={newTool.description}
                onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded mb-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <input
                type="text"
                placeholder="Category"
                value={newTool.category}
                onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded mb-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <input
                type="text"
                placeholder="Tool URL"
                value={newTool.toolUrl}
                onChange={(e) => setNewTool({ ...newTool, toolUrl: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded mb-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddTool}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                >
                  Save Tool
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Featured Tools Section */}
        {featuredTools.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Featured Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} isFeatured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-4">All Tools</h2>
          
          {filteredTools.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No tools found. Try adjusting your search.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {paginatedTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-2">
                  {[5, 10, 20, 50].map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        setItemsPerPage(num);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded transition ${
                        itemsPerPage === num
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
