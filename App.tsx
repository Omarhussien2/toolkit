import React, { useState, useEffect } from 'react';
import { initialTools } from './data';

const NEON_COLOR = '#CCFF00';
const ACCENT_COLOR = '#03a9f4';
const DARK_BG = '#0a0a0a';
const CARD_BG = '#1a1a1a';
const TEXT_COLOR = '#e0e0e0';
const GOLD_COLOR = '#FFD700';

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
}

function App() {
  const [currentPage, setCurrentPage] = useState<'tools' | 'prompts'>('tools');
  const [tools, setTools] = useState<Tool[]>(initialTools || []);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [featuredToolIds, setFeaturedToolIds] = useState<Set<string>>(new Set());
  const [showToolForm, setShowToolForm] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', description: '', category: 'AI', toolUrl: '', isPaid: false });
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ title: '', content: '', category: 'Writing' });
  const [showPromptsModal, setShowPromptsModal] = useState(false);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const PROMPT_CATEGORIES = ['All', 'Writing', 'Analysis', 'Creative', 'Technical', 'Business'];
  const CATEGORIES = ['All', 'AI', 'Writing', 'Image', 'Code', 'Voice', 'Video', 'Other'];
  const defaultPrompts: Prompt[] = [
    { id: '1', title: 'Summary', content: 'Please summarize this text...', category: 'Analysis' },
    { id: '2', title: 'Creative Writing', content: 'Write a creative story about...', category: 'Creative' },
    { id: '3', title: 'Code Review', content: 'Review this code and suggest improvements...', category: 'Technical' },
    { id: '4', title: 'SEO Optimization', content: 'Help me optimize this content for SEO...', category: 'Business' },
  ];

  // تحميل البيانات من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('featured');
    if (saved) setFeaturedToolIds(new Set(JSON.parse(saved)));
    const savedPrompts = localStorage.getItem('userPrompts');
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
  }, []);

  // حفظ المفضلة في localStorage
  useEffect(() => {
    localStorage.setItem('featured', JSON.stringify(Array.from(featuredToolIds)));
  }, [featuredToolIds]);

  useEffect(() => {
    localStorage.setItem('userPrompts', JSON.stringify(prompts));
  }, [prompts]);

  const toggleFeatured = (id: string) => {
    const newFeatured = new Set(featuredToolIds);
    if (newFeatured.has(id)) {
      newFeatured.delete(id);
    } else {
      newFeatured.add(id);
    }
    setFeaturedToolIds(newFeatured);
  };

  const addTool = () => {
    if (!newTool.name || !newTool.toolUrl) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    let url = newTool.toolUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    const tool: Tool = { id: Date.now().toString(), ...newTool, toolUrl: url };
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
    setNewPrompt({ title: '', content: '', category: 'Writing' });
  };

  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };

  const copyPrompt = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };

  const filteredAndSortedTools = tools
    .filter(tool => {
      const matchCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      const aFeatured = featuredToolIds.has(a.id);
      const bFeatured = featuredToolIds.has(b.id);
      if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      if (sortBy === 'oldest') return a.id.localeCompare(b.id);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const allPrompts = [...defaultPrompts, ...prompts];
  const filteredPrompts = allPrompts.filter(p => selectedPromptCategory === 'All' || p.category === selectedPromptCategory);

  const getCategories = () => {
    const cats = new Set<string>(['All']);
    tools.forEach(t => cats.add(t.category));
    return Array.from(cats);
  };

  return (
    <div className="min-h-screen text-white" dir="rtl" style={{ backgroundColor: DARK_BG }}>
      <style>{`
        * { font-family: 'Tajawal', sans-serif; }
        body { margin: 0; padding: 0; }
        .featured-glow { box-shadow: 0 0 20px ${GOLD_COLOR}, inset 0 0 10px rgba(255, 215, 0, 0.2); }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-8px); border-color: ${ACCENT_COLOR}; }
      `}</style>

      <div className="flex" style={{ minHeight: '100vh' }}>
        {/* الشريط الجانبي */}
        <div className="w-80 border-r" style={{ borderColor: '#333', backgroundColor: CARD_BG }}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: NEON_COLOR }}>💡 البرومات</h2>

            <div className="space-y-3 mb-6">
              {prompts.map(p => (
                <div key={p.id} className="rounded-lg p-3" style={{ backgroundColor: '#222' }}>
                  <p className="font-bold text-sm">{p.title}</p>
                  <p className="text-gray-400 text-xs truncate">{p.content}</p>
                  <button onClick={() => deletePrompt(p.id)} className="text-red-500 text-xs mt-2">حذف</button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPromptForm(!showPromptForm)}
              className="w-full py-2 rounded-lg border-2 font-bold transition"
              style={{ borderColor: NEON_COLOR, color: NEON_COLOR }}
            >
              + إضافة برومت
            </button>

            {showPromptForm && (
              <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: '#222' }}>
                <input
                  type="text"
                  placeholder="العنوان"
                  value={newPrompt.title}
                  onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
                  className="w-full p-2 mb-2 rounded text-sm"
                  style={{ backgroundColor: '#333', color: TEXT_COLOR }}
                />
                <textarea
                  placeholder="المحتوى"
                  value={newPrompt.content}
                  onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})}
                  className="w-full p-2 mb-2 rounded text-sm h-16"
                  style={{ backgroundColor: '#333', color: TEXT_COLOR }}
                />
                <select
                  value={newPrompt.category}
                  onChange={(e) => setNewPrompt({...newPrompt, category: e.target.value})}
                  className="w-full p-2 mb-2 rounded text-sm"
                  style={{ backgroundColor: '#333', color: TEXT_COLOR }}
                >
                  {PROMPT_CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <button onClick={addPrompt} className="w-full py-2 rounded font-bold" style={{ backgroundColor: NEON_COLOR, color: 'black' }}>
                  حفظ
                </button>
              </div>
            )}

            {/* التصنيفات */}
            <div className="mt-8">
              <h3 className="font-bold mb-3">📁 التصنيفات</h3>
              <div className="space-y-2">
                {getCategories().map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="w-full p-2 rounded text-right transition"
                    style={{
                      backgroundColor: selectedCategory === cat ? ACCENT_COLOR : '#222',
                      color: selectedCategory === cat ? 'black' : TEXT_COLOR
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 overflow-auto" style={{ backgroundColor: DARK_BG }}>
          {/* الهيدر */}
          <div className="border-b p-6 flex justify-between items-center" style={{ borderColor: '#333' }}>
            <div>
              <h1 className="text-4xl font-bold mb-2">My AI Toolkit</h1>
              <p style={{ color: '#888' }}>كتالوج شخصي وتفاعلي لأدوات الذكاء الاصطناعي</p>
            </div>
            <button
              onClick={() => setShowPromptsModal(!showPromptsModal)}
              className="px-6 py-3 rounded-lg font-bold transition"
              style={{ backgroundColor: NEON_COLOR, color: 'black' }}
            >
              برومت من الآخر 🚀
            </button>
          </div>

          {/* المحتوى */}
          <div className="p-8">
            {/* شريط البحث والفلترة */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="ابحث عن الأدوات التي تبحث عنها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 rounded-lg border-2 mb-4"
                style={{ backgroundColor: CARD_BG, borderColor: '#333', color: TEXT_COLOR }}
              />

              <div className="flex gap-4">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 rounded border-2" style={{ backgroundColor: CARD_BG, borderColor: '#333', color: TEXT_COLOR }}>
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="name">الاسم (أ-ي)</option>
                </select>

                <button
                  onClick={() => setShowToolForm(!showToolForm)}
                  className="px-6 py-2 rounded-lg font-bold"
                  style={{ backgroundColor: NEON_COLOR, color: 'black' }}
                >
                  + أضف أداة
                </button>
              </div>
            </div>

            {/* نموذج إضافة أداة */}
            {showToolForm && (
              <div className="rounded-lg p-6 mb-8 border-2" style={{ backgroundColor: CARD_BG, borderColor: ACCENT_COLOR }}>
                <input type="text" placeholder="اسم الأداة" value={newTool.name} onChange={(e) => setNewTool({...newTool, name: e.target.value})} className="w-full p-2 mb-3 rounded" style={{ backgroundColor: '#222', color: TEXT_COLOR }} />
                <textarea placeholder="الوصف" value={newTool.description} onChange={(e) => setNewTool({...newTool, description: e.target.value})} className="w-full p-2 mb-3 rounded h-20" style={{ backgroundColor: '#222', color: TEXT_COLOR }} />
                <input type="text" placeholder="رابط الأداة" value={newTool.toolUrl} onChange={(e) => setNewTool({...newTool, toolUrl: e.target.value})} className="w-full p-2 mb-3 rounded" style={{ backgroundColor: '#222', color: TEXT_COLOR }} />
                <select value={newTool.category} onChange={(e) => setNewTool({...newTool, category: e.target.value})} className="w-full p-2 mb-3 rounded" style={{ backgroundColor: '#222', color: TEXT_COLOR }}>
                  {getCategories().filter(c => c !== 'All').map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <label className="flex items-center gap-2 mb-3">
