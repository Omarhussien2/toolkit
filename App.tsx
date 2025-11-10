import React, { useState, useMemo, useEffect } from 'react';
import { initialTools } from './data';

const NEON_COLOR = '#CCFF00';
const CATEGORIES = ['All', 'AI', 'Writing', 'Image', 'Code', 'Voice', 'Video', 'Other'];

function App() {
  const [tools, setTools] = useState(initialTools || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [prompts, setPrompts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aiPrompts')) || [];
    } catch { return []; }
  });
  const [featuredToolIds, setFeaturedToolIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('featuredTools')) || [];
    } catch { return []; }
  });
  const [newPrompt, setNewPrompt] = useState({ title: '', content: '', model: '' });
  const [showPromptForm, setShowPromptForm] = useState(false);

  // Save prompts
  useEffect(() => {
    try { localStorage.setItem('aiPrompts', JSON.stringify(prompts)); }
    catch (error) { console.error('Error saving prompts:', error); }
  }, [prompts]);

  // Save featured tools
  useEffect(() => {
    try { localStorage.setItem('featuredTools', JSON.stringify(featuredToolIds)); }
    catch (error) { console.error('Error saving featured tools:', error); }
  }, [featuredToolIds]);

  // Featured tools first, then others
  const filteredAndSortedTools = useMemo(() => {
    let result = tools;

    if (selectedCategory !== 'All') {
      result = result.filter(tool => tool.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      result = result.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Separate featured and regular
    const featured = result.filter(t => featuredToolIds.includes(t.id));
    const regular = result.filter(t => !featuredToolIds.includes(t.id));

    if (sortBy === 'newest') {
      regular.reverse();
    } else if (sortBy === 'name') {
      regular.sort((a, b) => a.name.localeCompare(b.name));
    }

    return [...featured, ...regular];
  }, [tools, selectedCategory, searchQuery, sortBy, featuredToolIds]);

  const handleAddPrompt = () => {
    if (newPrompt.title.trim() && newPrompt.content.trim()) {
      setPrompts([...prompts, {
        id: Date.now().toString(),
        ...newPrompt,
        createdAt: new Date().toISOString()
      }]);
      setNewPrompt({ title: '', content: '', model: '' });
      setShowPromptForm(false);
    }
  };

  const handleDeletePrompt = (id) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };

  const toggleFeatured = (toolId) => {
    if (featuredToolIds.includes(toolId)) {
      setFeaturedToolIds(featuredToolIds.filter(id => id !== toolId));
    } else {
      setFeaturedToolIds([...featuredToolIds, toolId]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span>قوة الذكاء الاصطناعي في</span>
            <br />
            <span style={{ color: NEON_COLOR }}>مكتبة ادوات لا حدود لها</span>
          </h1>
          <p className="text-gray-400 text-lg">اكتشف واستخدم أفضل أدوات الذكاء الاصطناعي</p>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 min-h-screen">
          {/* Prompts */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>💡</span> البرومات
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {prompts.length === 0 ? (
                <p className="text-sm text-gray-500">لا توجد برومات محفوظة</p>
              ) : (
                prompts.map(prompt => (
                  <div key={prompt.id} className="bg-slate-800 p-3 rounded-lg text-sm">
                    <div className="font-semibold text-xs truncate" style={{ color: NEON_COLOR }}>{prompt.title}</div>
                    <div className="text-gray-400 text-xs truncate">{prompt.content}</div>
                    <div className="text-gray-500 text-xs mt-1">Model: {prompt.model || 'N/A'}</div>
                    <button onClick={() => handleDeletePrompt(prompt.id)} className="mt-2 text-xs text-red-400 hover:text-red-300">حذف</button>
                  </div>
                ))
              )}
            </div>
            {!showPromptForm ? (
              <button onClick={() => setShowPromptForm(true)} className="w-full py-2 px-3 rounded-lg border-2 transition" style={{ borderColor: NEON_COLOR, color: NEON_COLOR }}>+ إضافة برومت</button>
            ) : (
              <div className="bg-slate-800 p-3 rounded-lg space-y-2">
                <input type="text" placeholder="عنوان البرومت" value={newPrompt.title} onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white placeholder-gray-500" />
                <textarea placeholder="محتوى البرومت" value={newPrompt.content} onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white placeholder-gray-500 resize-none" rows="3" />
                <input type="text" placeholder="الموديل (مثال: GPT-4)" value={newPrompt.model} onChange={(e) => setNewPrompt({...newPrompt, model: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white placeholder-gray-500" />
                <div className="flex gap-2">
                  <button onClick={handleAddPrompt} className="flex-1 py-1 rounded text-sm font-semibold" style={{ backgroundColor: NEON_COLOR, color: '#0f172a' }}>حفظ</button>
                  <button onClick={() => setShowPromptForm(false)} className="flex-1 py-1 rounded text-sm bg-slate-700 hover:bg-slate-600">إلغاء</button>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>📁</span> التصنيفات
          </h3>
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-4 py-2 rounded-lg transition ${selectedCategory === cat ? 'bg-slate-700' : 'hover:bg-slate-800'}`} style={selectedCategory === cat ? { borderLeft: `4px solid ${NEON_COLOR}` } : {}}>
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <input type="text" placeholder="ابحث عن الأدوات..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-6 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-slate-600" />
            <div className="flex gap-4">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none">
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="name">الاسم (أ-ي)</option>
              </select>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedTools.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">لم يتم العثور على أدوات</div>
            ) : (
              filteredAndSortedTools.map(tool => {
                const isFeatured = featuredToolIds.includes(tool.id);
                return (
                  <div key={tool.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex flex-col h-full hover:border-slate-600 transition">
                    {/* Image Section */}
                    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center text-4xl font-bold" style={{ backgroundColor: '#1e293b' }}>
                        {tool.name.charAt(0).toUpperCase()}
                      </div>
                      {/* Paid Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-3 py-1 rounded text-white text-sm font-semibold" style={{ backgroundColor: '#ef4444' }}>Paid</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{tool.name}</h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{tool.description}</p>
                      <div className="mt-auto space-y-3">
                        {/* Category Badge */}
                        <div>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: NEON_COLOR, color: '#0f172a' }}>
                            {tool.category}
                          </span>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-2 items-center">
                          <button onClick={() => toggleFeatured(tool.id)} className={`flex-1 py-2 rounded text-sm font-semibold transition ${ isFeatured ? 'text-yellow-400' : 'text-gray-400' }`} title="Toggle Featured">
                            {isFeatured ? '⭐ Featured' : '☆ Feature'}
                          </button>
                          <button onClick={() => window.open(tool.toolUrl, '_blank')} className="flex-1 py-2 rounded text-sm font-semibold text-white" style={{ backgroundColor: NEON_COLOR, color: '#0f172a' }}>فتح</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
