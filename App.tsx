import React, { useState, useEffect } from 'react';
import { initialTools } from './data';

const NEON_COLOR = '#CCFF00';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  toolUrl: string;
  isPaid?: boolean;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  model: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'tools' | 'prompts'>('tools');
  const [tools, setTools] = useState<Tool[]>(initialTools || []);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [featuredToolIds, setFeaturedToolIds] = useState<string[]>([]);
  const [showToolForm, setShowToolForm] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', description: '', category: 'AI', toolUrl: '', isPaid: false });
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ title: '', content: '', model: '', category: 'Writing' });
  const [selectedPromptCategory, setSelectedPromptCategory] = useState('All');

  const PROMPT_CATEGORIES = ['All', 'Writing', 'Analysis', 'Creative', 'Technical', 'Business'];
  const CATEGORIES = ['All', 'AI', 'Writing', 'Image', 'Code', 'Voice', 'Video', 'Other'];

  useEffect(() => {
    const savedFeatured = localStorage.getItem('featuredTools');
    if (savedFeatured) setFeaturedToolIds(JSON.parse(savedFeatured));
    const savedPrompts = localStorage.getItem('aiPrompts');
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
  }, []);

  useEffect(() => {
    localStorage.setItem('featuredTools', JSON.stringify(featuredToolIds));
  }, [featuredToolIds]);

  useEffect(() => {
    localStorage.setItem('aiPrompts', JSON.stringify(prompts));
  }, [prompts]);

  const addTool = async () => {
    if (!newTool.name || !newTool.toolUrl) return;
    const tool: Tool = { id: Date.now().toString(), ...newTool };
    const updatedTools = [...tools, tool];
    setTools(updatedTools);
    setNewTool({ name: '', description: '', category: 'AI', toolUrl: '', isPaid: false });
    setShowToolForm(false);
  };

  const addPrompt = () => {
    if (!newPrompt.title || !newPrompt.content) return;
    const prompt: Prompt = { id: Date.now().toString(), ...newPrompt };
    setPrompts([...prompts, prompt]);
    setNewPrompt({ title: '', content: '', model: '', category: 'Writing' });
    setShowPromptForm(false);
  };

  const toggleFeatured = (id: string) => {
    if (featuredToolIds.includes(id)) {
      setFeaturedToolIds(featuredToolIds.filter(fid => fid !== id));
    } else {
      setFeaturedToolIds([...featuredToolIds, id]);
    }
  };

  const filteredAndSortedTools = tools
    .filter(tool => {
      const matchCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (featuredToolIds.includes(a.id) && !featuredToolIds.includes(b.id)) return -1;
      if (!featuredToolIds.includes(a.id) && featuredToolIds.includes(b.id)) return 1;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      if (sortBy === 'oldest') return a.id.localeCompare(b.id);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const filteredPrompts = prompts.filter(p =>
    selectedPromptCategory === 'All' || p.category === selectedPromptCategory
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white" dir="rtl">
      <div className="border-b border-slate-800 p-4 flex gap-4">
        <button
          onClick={() => setCurrentPage('tools')}
          className={`px-6 py-2 rounded-lg font-bold ${currentPage === 'tools' ? 'bg-yellow-400 text-black' : 'bg-slate-800'}`}
        >
          الأدوات
        </button>
        <button
          onClick={() => setCurrentPage('prompts')}
          className={`px-6 py-2 rounded-lg font-bold ${currentPage === 'prompts' ? 'bg-yellow-400 text-black' : 'bg-slate-800'}`}
        >
          البرومتات
        </button>
      </div>

      {currentPage === 'tools' && (
        <div className="container mx-auto p-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: NEON_COLOR }}>مكتبة الأدوات 🛠️</h1>
          <input type="text" placeholder="ابحث..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-3 mb-6 bg-slate-800 rounded border border-slate-700" />
          <div className="flex gap-4 mb-6">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 bg-slate-800 rounded border border-slate-700">
              {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
            </select>
            <button onClick={() => setShowToolForm(true)} className="px-4 py-2 rounded bg-yellow-400 text-black font-bold">+ أداة</button>
          </div>
          {showToolForm && (
            <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-700">
              <input type="text" placeholder="الاسم" value={newTool.name} onChange={(e) => setNewTool({...newTool, name: e.target.value})} className="w-full p-2 mb-3 bg-slate-700 rounded" />
              <input type="text" placeholder="الرابط" value={newTool.toolUrl} onChange={(e) => setNewTool({...newTool, toolUrl: e.target.value})} className="w-full p-2 mb-3 bg-slate-700 rounded" />
              <button onClick={addTool} className="px-6 py-2 rounded bg-yellow-400 text-black font-bold">حفظ</button>
            </div>
          )}
          <div className="grid grid-cols-3 gap-6">
            {filteredAndSortedTools.map(tool => (
              <div key={tool.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                {tool.isPaid && <span className="inline-block bg-red-500 px-2 py-1 rounded text-sm mb-2">مدفوع</span>}
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <button onClick={() => window.open(tool.toolUrl, '_blank')} className="w-full py-2 rounded bg-yellow-400 text-black font-bold mb-2">فتح</button>
                <button onClick={() => toggleFeatured(tool.id)} className={`w-full py-2 rounded ${featuredToolIds.includes(tool.id) ? 'bg-yellow-400 text-black' : 'bg-slate-700'}`}>
                  {featuredToolIds.includes(tool.id) ? '⭐ Featured' : '☆ Feature'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentPage === 'prompts' && (
        <div className="container mx-auto p-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: NEON_COLOR }}>البرومتات 💡</h1>
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {PROMPT_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedPromptCategory(cat)} className={`px-4 py-2 rounded ${selectedPromptCategory === cat ? 'bg-yellow-400 text-black' : 'bg-slate-800'}`}>
                {cat}
              </button>
            ))}
          </div>
          <button onClick={() => setShowPromptForm(true)} className="px-4 py-2 rounded bg-yellow-400 text-black font-bold mb-6">+ برومت</button>
          {showPromptForm && (
            <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-700">
              <input type="text" placeholder="العنوان" value={newPrompt.title} onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})} className="w-full p-2 mb-3 bg-slate-700 rounded" />
              <textarea placeholder="المحتوى" value={newPrompt.content} onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})} className="w-full p-2 mb-3 bg-slate-700 rounded h-24" />
              <button onClick={addPrompt} className="px-6 py-2 rounded bg-yellow-400 text-black font-bold">حفظ</button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            {filteredPrompts.map(prompt => (
              <div key={prompt.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="font-bold text-lg mb-2">{prompt.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{prompt.content}</p>
                <span className="inline-block bg-slate-700 px-3 py-1 rounded text-xs">{prompt.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
