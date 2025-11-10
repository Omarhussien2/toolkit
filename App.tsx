```typescript
import React, { useState, useEffect } from 'react';
import { initialTools } from './data';

const NEON_COLOR = '#CCFF00';
const CATEGORIES = ['All', 'AI', 'Writing', 'Image', 'Code', 'Voice', 'Video', 'Other'];
const PROMPT_CATEGORIES = ['All', 'Writing', 'Analysis', 'Creative', 'Technical', 'Business'];

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

  // تحميل البيانات من localStorage
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

  const addTool = () => {
    if (!newTool.name || !newTool.toolUrl) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    const tool: Tool = { id: Date.now().toString(), ...newTool };
    setTools([...tools, tool]);
    setNewTool({ name: '', description: '', category: 'AI', toolUrl: '', isPaid: false });
    setShowToolForm(false);
  };

  const addPrompt = () => {
    if (!newPrompt.title || !newPrompt.content) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }
    const prompt: Prompt = { id: Date.now().toString(), ...newPrompt };
    setPrompts([...prompts, prompt]);
    setNewPrompt({ title: '', content: '', model: '', category: 'Writing' });
    setShowPromptForm(false);
  };

  const toggleFeatured = (id: string) => {
    setFeaturedToolIds(featuredToolIds.includes(id) ? featuredToolIds.filter(fid => fid !== id) : [...featuredToolIds, id]);
  };

  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
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

  const filteredPrompts = prompts.filter(p => selectedPromptCategory === 'All' || p.category === selectedPromptCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex" dir="rtl">
      {/* الشريط الجانبي */}
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-6" style={{ color: NEON_COLOR }}>💡 البرومات</h2>
        
        <div className="mb-4 flex justify-between items-center">
          <button onClick={() => setShowPromptForm(!showPromptForm)} className="text-sm" style={{ color: NEON_COLOR }}>حذف</button>
        </div>

        <div className="space-y-3 mb-6">
          {prompts.map(p => (
            <div key={p.id} className="bg-slate-800 p-3 rounded text-sm">
              <p className="font-bold">{p.title}</p>
              <p className="text-gray-400 text-xs truncate">{p.content}</p>
              <p className="text-xs mt-1" style={{ color: NEON_COLOR }}>Model: {p.model || 'N/A'}</p>
              <button onClick={() => deletePrompt(p.id)} className="text-red-500 text-xs mt-2">حذف</button>
            </div>
          ))}
        </div>

        <button onClick={() => setShowPromptForm(!showPromptForm)} className="w-full py-2 rounded border-2" style={{ borderColor: NEON_COLOR, color: NEON_COLOR }}>
          + إضافة برومت
        </button>

        {showPromptForm && (
          <div className="mt-4 bg-slate-800 p-3 rounded">
            <input type="text" placeholder="العنوان" value={newPrompt.title} onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})} className="w-full p-2 mb-2 bg-slate-700 rounded text-sm" />
            <textarea placeholder="المحتوى" value={newPrompt.content} onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})} className="w-full p-2 mb-2 bg-slate-700 rounded text-sm h-16" />
            <select value={newPrompt.category} onChange={(e) => setNewPrompt({...newPrompt, category: e.target.value})} className="w-full p-2 mb-2 bg-slate-700 rounded text-sm">
              {PROMPT_CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat}>{cat}</option>)}
            </select>
            <button onClick={addPrompt} className="w-full py-2 rounded bg-yellow-400 text-black font-bold text-sm">حفظ</button>
          </div>
        )}

        {/* التصنيفات */}
        <div className="mt-8">
          <h3 className="font-bold mb-3 flex items-center">📁 التصنيفات</h3>
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full p-2 rounded text-right ${selectedCategory === cat ? 'bg-yellow-400 text-black font-bold' : 'bg-slate-800'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col">
        {/* زر التنقل بين الصفحات */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex gap-4">
          <button onClick={() => setCurrentPage('tools')} className={`px-6 py-2 rounded-lg font-bold transition ${currentPage === 'tools' ? 'bg-yellow-400 text-black' : 'bg-slate-800 hover:bg-slate-700'}`}>
            الأدوات
          </button>
          <button onClick={() => setCurrentPage('prompts')} className={`px-6 py-2 rounded-lg font-bold transition ${currentPage === 'prompts' ? 'bg-yellow-400 text-black' : 'bg-slate-800 hover:bg-slate-700'}`}>
            البرومتات
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* صفحة الأدوات */}
          {currentPage === 'tools' && (
            <>
              <h1 className="text-4xl font-bold mb-4" style={{ color: NEON_COLOR }}>قوة الذكاء الاصطناعي في<br />مكتبة ادوات لا حدود لها</h1>
              <p className="text-gray-400 mb-8">اكتشف واستخدم أفضل أدوات الذكاء الاصطناعي</p>

              {/* شريط البحث */}
              <input type="text" placeholder="ابحث عن الأدوات التي تبحث عنها..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-96 p-3 mb-6 bg-slate-800 rounded-lg border border-slate-700" />

              {/* الفرز وإضافة أداة */}
              <div className="flex gap-4 mb-6">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 bg-slate-800 rounded border border-slate-700">
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="name">الاسم (أ-ي)</option>
                </select>
                <button onClick={() => setShowToolForm(!showToolForm)} className="px-4 py-2 rounded font-bold" style={{ backgroundColor: NEON_COLOR, color: 'black' }}>
                  + إضافة أداة
                </button>
              </div>

              {/* نموذج إضافة أداة */}
              {showToolForm && (
                <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-700">
                  <input type="text" placeholder="اسم الأداة" value={newTool.name} onChange={(e) => setNewTool({...newTool, name: e.target.value})} className="w-full p-2 mb-3 bg-slate-700 rounded" />
                  <textarea placeholder="الوصف" value={newTool.description} onChange={(e) => setNewTool({...newTool, description: e.target.value})} className="w-full p-2 mb-3 bg-slate-700 rounded h-20" />
                  <input type="text" placeholder="رابط الأداة" value={newTool.toolUrl} onChange={(e) => setNewTool({...newTool, toolUrl: e.target.value})} className="w-full p-2 mb-3 bg-slate-700 rounded" />
                  <select value={newTool.category} onChange={(e) => setNewTool({...newTool, category: e.target.value})} className="w-full p-2 mb-3 bg-slate-700 rounded">
                    {CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat}>{cat}</option>)}
                  </select>
                  <label className="flex items-center gap-2 mb-3">
                    <input type="checkbox" checked={newTool.isPaid} onChange={(e) => setNewTool({...newTool, isPaid: e.target.checked})} />
                    أداة مدفوعة
                  </label>
                  <button onClick={addTool} className="px-6 py-2 rounded font-bold" style={{ backgroundColor: NEON_COLOR, color: 'black' }}>حفظ</button>
                </div>
              )}

              {/* عرض البطاقات */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedTools.map(tool => (
                  <div key={tool.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-500 transition">
                    <div className="p-6">
                      {tool.isPaid && <span className="inline-block bg-red-500 text-white px-3 py-1 rounded text-sm mb-3 font-bold">Paid</span>}
                      <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{tool.description || 'No description available'}</p>
                      <span className="inline-block bg-slate-700 px-3 py-1 rounded text-xs mb-4">{tool.category}</span>
                      <div className="flex gap-2">
                        <button onClick={() => window.open(tool.toolUrl, '_blank')} className="flex-1 py-2 rounded font-bold text-sm" style={{ backgroundColor: NEON_COLOR, color: 'black' }}>فتح</button>
                        <button onClick={() => toggleFeatured(tool.id)} className={`px-3 py-2 rounded font-bold text-sm transition ${featuredToolIds.includes(tool.id) ? 'bg-yellow-400 text-black' : 'bg-slate-700'}`}>
                          {featuredToolIds.includes(tool.id) ? '⭐ Featured' : '☆ Feature'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
