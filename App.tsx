import React, { useState, useEffect, useMemo } from 'react';
import { Tool } from './types';
import ToolCard from './components/ToolCard';
import AddToolForm from './components/AddToolForm';
import Pagination from './components/Pagination';
import PerPageSelector from './components/PerPageSelector';
import { PlusIcon, SearchIcon, SheetIcon } from './components/Icons';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchTools } from './services/googleSheetService';
import { initialTools } from './data';

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1VlfBPQw79zF9Znafn_lvclGAdMmwwCs_S5PaPrMb4Ak/edit?usp=sharing";
// IMPORTANT: Paste the Web app URL you copied from Google Apps Script here.
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE";

function App() {
  const [allTools, setAllTools] = useLocalStorage<Tool[]>('ai-tools', []);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [toolsPerPage, setToolsPerPage] = useLocalStorage<number | 'All'>('ai-tools-per-page', 20);

  useEffect(() => {
    const loadTools = async () => {
      setIsLoading(true);
      const gsheetTools = await fetchTools();
      
      const combined = [...initialTools, ...gsheetTools];
      const uniqueTools = Array.from(new Map(combined.map(tool => [tool.name.trim().toLowerCase(), tool])).values());
      
      if (allTools.length === 0) {
          setAllTools(uniqueTools);
      } else {
        const mergedWithLocal = [...allTools, ...uniqueTools];
        const finalUniqueTools = Array.from(new Map(mergedWithLocal.map(tool => [tool.name.trim().toLowerCase(), tool])).values());
        setAllTools(finalUniqueTools);
      }
      
      setIsLoading(false);
    };

    if(allTools.length === 0) {
        loadTools();
    } else {
        setIsLoading(false);
    }
  }, []);

  const handleAddTool = async (tool: Tool) => {
    if (GOOGLE_SCRIPT_URL === "PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE") {
      alert("Configuration Error: Please paste your Google Apps Script URL into the App.tsx file.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tool),
      });

      const result = await response.json();

      if (result.result !== 'success') {
        throw new Error(result.message || 'An unknown error occurred in the script.');
      }
      
      // Add tool to local state only after successful submission
      setAllTools(prevTools => {
        const newTools = [tool, ...prevTools];
        const unique = Array.from(new Map(newTools.map(t => [t.name.trim().toLowerCase(), t])).values());
        return unique.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      });

      alert('Tool added successfully to both the website and Google Sheet!');
      setIsFormVisible(false);

    } catch (error) {
      console.error("Failed to add tool:", error);
      alert(`Error: Could not save the tool. Please check the console for details.\n${error instanceof Error ? error.message : ''}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleToggleFeatured = (toolId: string) => {
    setAllTools(prevTools => {
      const newTools = prevTools.map(t =>
        t.id === toolId ? { ...t, featured: !t.featured } : t
      );
      // Re-sort to bring the newly featured/unfeatured tool to the correct position
      return newTools.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    });
  };

  const categories = useMemo(() => {
    const cats = new Set(allTools.map(tool => tool.category));
    return ['All', ...Array.from(cats).sort()];
  }, [allTools]);

  const filteredTools = useMemo(() => {
    // Create a new sorted array to avoid mutating the state directly
    const sorted = [...allTools].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return sorted
      .filter(tool => {
        const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  }, [allTools, searchTerm, selectedCategory]);
  
  const featuredTools = useMemo(() => {
    return allTools.filter(tool => tool.featured).slice(0, 4); // Show max 4 featured
  }, [allTools]);

  const totalPages = useMemo(() => {
    if (toolsPerPage === 'All' || !filteredTools.length) return 1;
    return Math.ceil(filteredTools.length / toolsPerPage);
  }, [filteredTools.length, toolsPerPage]);

  const paginatedTools = useMemo(() => {
    if (toolsPerPage === 'All') {
      return filteredTools;
    }
    const startIndex = (currentPage - 1) * toolsPerPage;
    return filteredTools.slice(startIndex, startIndex + toolsPerPage);
  }, [filteredTools, currentPage, toolsPerPage]);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, toolsPerPage]);

  return (
    <div className="dark bg-zinc-900 min-h-screen font-sans text-gray-200">
      <header className="bg-zinc-900/80 backdrop-blur-lg sticky top-0 z-40 border-b border-zinc-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              AI Toolkit
            </h1>
            <div className="flex items-center gap-2">
               <a
                href={GOOGLE_SHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-zinc-800 text-zinc-300 font-bold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors"
                title="Open Google Sheet"
              >
                <SheetIcon className="w-5 h-5" />
                <span className="hidden lg:inline">Manage Data</span>
              </a>
              <button
                onClick={() => setIsFormVisible(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden lg:inline">Add Tool</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {featuredTools.length > 0 && !searchTerm && selectedCategory === 'All' && (
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white">Featured Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} onToggleFeatured={handleToggleFeatured} />
                    ))}
                </div>
            </section>
        )}

        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for tools..."
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); }}
                        className="w-full p-3 pl-10 bg-zinc-700 rounded-lg border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors text-white"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                </div>
                <select
                    value={selectedCategory}
                    onChange={e => { setSelectedCategory(e.target.value); }}
                    className="w-full p-3 bg-zinc-700 rounded-lg border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none text-white"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-lg">Loading AI tools...</p>
          </div>
        ) : paginatedTools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {paginatedTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} onToggleFeatured={handleToggleFeatured} />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-8">
              <PerPageSelector value={toolsPerPage} onChange={setToolsPerPage} />
              {toolsPerPage !== 'All' && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-zinc-800/50 rounded-2xl border border-zinc-700/50">
            <h3 className="text-xl font-semibold">No tools found</h3>
            <p className="text-zinc-400 mt-2">Try adjusting your search or filter.</p>
          </div>
        )}
      </main>

      <button
        onClick={() => setIsFormVisible(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
        aria-label="Add new tool"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {isFormVisible && (
        <AddToolForm
          onAddTool={handleAddTool}
          onClose={() => setIsFormVisible(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

export default App;