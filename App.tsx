سأقدم لك الآن الكود الكامل الجديد مع رابط API الصحيح من Sheety. سأقوم بنسخ الكود التالي وسيتم تطبيقه في ملف App.tsx:

**الكود الكامل لـ App.tsx مع رابط API الصحيح:**

```typescript
import React, { useEffect, useState } from 'react';
import { initialTools } from './data';

// ======================== الألوان والثوابت ========================
const NEON_COLOR = '#CCFF00';
const ACCENT_COLOR = '#03a9f4';
const DARK_BG = '#0a0a0a';
const CARD_BG = '#1a1a1a';
const TEXT_COLOR = '#e0e0e0';
const GOLD_COLOR = '#FFD700';
const SHEETY_API = 'https://api.sheety.co/31cb147aac99e6cd99f93c776de1/aiToolkit/tools';

// ======================== الواجهات والأنواع ========================
interface Tool {
  id?: number;
  name: string;
  description: string;
  category: string;
  toolUrl: string;
  isPaid?: boolean;
  isFeatured?: boolean;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
}

// ======================== دوال الـ API ========================
const fetchToolsFromSheety = async (): Promise<Tool[]> => {
  try {
    const response = await fetch(SHEETY_API);
    const data = await response.json();
    return data.tools || [];
  } catch (error) {
    console.error('خطأ في جلب البيانات:', error);
    return initialTools || [];
  }
};

const addToolToSheety = async (tool: Tool) => {
  try {
    await fetch(SHEETY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool }),
    });
    return true;
  } catch (error) {
    console.error('خطأ في إضافة الأداة:', error);
    return false;
  }
};

const updateToolInSheety = async (id: number, tool: Partial<Tool>) => {
  try {
    await fetch(`${SHEETY_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool }),
    });
    return true;
  } catch (error) {
    console.error('خطأ في تحديث الأداة:', error);
    return false;
  }
};

const deleteToolFromSheety = async (id: number) => {
  try {
    await fetch(`${SHEETY_API}/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('خطأ في حذف الأداة:', error);
    return false;
  }
};

// ======================== بطاقة الأداة ========================
interface ToolCardProps {
  tool: Tool;
  isFeatured: boolean;
  onToggleFeatured: (id?: number) => void;
  onDelete: (id?: number) => void;
  onEdit: (tool: Tool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFeatured,
  onToggleFeatured,
  onDelete,
  onEdit,
}) => (
  <div
    className="rounded-xl p-6 border-2 transition-all hover:shadow-2xl card-hover"
    style={{
      backgroundColor: CARD_BG,
      borderColor: isFeatured ? GOLD_COLOR : '#333',
      boxShadow: isFeatured ? `0 0 25px ${GOLD_COLOR}` : 'none',
    }}
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        {tool.isPaid && (
          <span
            className="inline-block px-3 py-1 rounded-lg text-xs font-bold mr-2"
            style={{ backgroundColor: '#ef4444', color: 'white' }}
          >
            Paid
          </span>
        )}
      </div>
      <button
        onClick={() => onToggleFeatured(tool.id)}
        className="text-2xl transition hover:scale-125"
        style={{ color: isFeatured ? GOLD_COLOR : TEXT_COLOR }}
      >
        {isFeatured ? '⭐' : '☆'}
      </button>
    </div>
    
    <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
    <p className="text-gray-400 text-sm mb-4 min-h-12">{tool.description || 'No description'}</p>
    
    <div className="flex gap-2 mb-4 flex-wrap">
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold"
        style={{ backgroundColor: '#222', color: NEON_COLOR }}
      >
        {tool.category}
      </span>
    </div>
    
    <div className="flex gap-2">
      <button
        onClick={() => window.open(tool.toolUrl, '_blank')}
        className="flex-1 py-2 rounded-lg font-bold transition hover:opacity-90"
        style={{ backgroundColor: NEON_COLOR, color: 'black' }}
      >
        فتح
      </button>
      <button
        onClick={() => onEdit(tool)}
        className="px-4 py-2 rounded-lg font-bold transition hover:opacity-90"
        style={{ backgroundColor: ACCENT_COLOR, color: 'white' }}
      >
        تعديل
      </button>
      <button
        onClick={() => onDelete(tool.id)}
        className="px-4 py-2 rounded-lg font-bold transition hover:opacity-90"
        style={{ backgroundColor: '#ef4444', color: 'white' }}
      >
        🗑️
      </button>
    </div>
  </div>
);

// ======================== المكون الرئيسي ========================
function App() {
  const [tools, setTools] = useState<Tool[]>(initialTools || []);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [featuredIds, setFeaturedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Tool>({
    name: '',
    description: '',
    category: 'AI',
    toolUrl: '',
    isPaid: false,
  });
  const [loading, setLoading] = useState(true);

  const CATEGORIES = ['All', 'AI', 'Writing', 'Image', 'Code', 'Voice', 'Video', 'Other'];

  // تحميل البيانات
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const sheetyTools = await fetchToolsFromSheety();
      if (sheetyTools.length > 0) {
        setTools(sheetyTools);
      }
      const saved = localStorage.getItem('featured');
      if (saved) setFeaturedIds(new Set(JSON.parse(saved)));
      const savedPrompts = localStorage.getItem('prompts');
      if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
      setLoading(false);
    };
    loadData();
  }, []);

  // حفظ المفضلة
  useEffect(() => {
    localStorage.setItem('featured', JSON.stringify(Array.from(featuredIds)));
  }, [featuredIds]);

  // المعالجات
  const handleAddTool = async () => {
    if (!formData.name || !formData.toolUrl) {
      alert('الرجاء ملء الحقول المطلوبة');
      return;
    }
    let url = formData.toolUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    const toolToSave = { ...formData, toolUrl: url };
    if (editingId) {
      await updateToolInSheety(editingId, toolToSave);
    } else {
      await addToolToSheety(toolToSave);
    }
    const updatedTools = await fetchToolsFromSheety();
    setTools(updatedTools);
    resetForm();
  };

  const handleDeleteTool = async (id?: number) => {
    if (!id) return;
    if (confirm('هل تريد حقاً حذف هذه الأداة؟')) {
      await deleteToolFromSheety(id);
      const updatedTools = await fetchToolsFromSheety();
      setTools(updatedTools);
      setFeaturedIds(new Set(Array.from(featuredIds).filter(fid => fid !== id)));
    }
  };

  const handleEditTool = (tool: Tool) => {
    setFormData(tool);
    setEditingId(tool.id || null);
    setShowForm(true);
  };

  const handleToggleFeatured = (id?: number) => {
    if (!id) return;
    const newFeatured = new Set(featuredIds);
    if (newFeatured.has(id)) {
      newFeatured.delete(id);
    } else {
      newFeatured.add(id);
    }
    setFeaturedIds(newFeatured);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: 'AI', toolUrl: '', isPaid: false });
    setEditingId(null);
    setShowForm(false);
  };

  const getCategories = () => {
    const cats = new Set<string>(['All']);
    tools.forEach(t => cats.add(t.category));
    return Array.from(cats);
  };

  const filteredAndSortedTools = tools
    .filter(tool => {
      const matchCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      const aFeatured = featuredIds.has(a.id || 0);
      const bFeatured = featuredIds.has(b.id || 0);
      if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;
      if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
      if (sortBy === 'oldest') return (a.id || 0) - (b.id || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen text-white" dir="rtl" style={{ backgroundColor: DARK_BG }}>
      <style>{`
        * { font-family: 'Tajawal', sans-serif; }
        body { margin: 0; padding: 0; }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-8px); }
        input, textarea, select { direction: rtl; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* الهيدر */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2" style={{ color: NEON_COLOR }}>
            My AI Toolkit 🚀
          </h1>
          <p className="text-gray-400">كتالوج شخصي وتفاعلي لأدوات الذكاء الاصطناعي</p>
        </div>

        {/* شريط البحث والفلترة */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="ابحث عن الأدوات التي تبحث عنها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 rounded-lg border-2"
            style={{ backgroundColor: CARD_BG, borderColor: '#333', color: TEXT_COLOR }}
          />

          <div className="flex gap-4 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border-2"
              style={{ backgroundColor: CARD_BG, borderColor: '#333', color: TEXT_COLOR }}
            >
              {getCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border-2"
              style={{ backgroundColor: CARD_BG, borderColor: '#333', color: TEXT_COLOR }}
            >
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="name">الاسم (أ-ي)</option>
            </select>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-2 rounded-lg font-bold transition hover:opacity-90"
              style={{ backgroundColor: NEON_COLOR, color: 'black' }}
            >
              + إضافة أداة
            </button>
          </div>
        </div>

        {/* نموذج الإضافة */}
        {showForm && (
          <div className="rounded-lg p-6 mb-8 border-2" style={{ backgroundColor: CARD_BG, borderColor: ACCENT_COLOR }}>
            <input
              type="text"
              placeholder="اسم الأداة"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 mb-3 rounded-lg"
              style={{ backgroundColor: '#222', color: TEXT_COLOR }}
            />
            <textarea
              placeholder="الوصف"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 mb-3 rounded-lg h-20"
              style={{ backgroundColor: '#222', color: TEXT_COLOR }}
            />
            <input
              type="text"
              placeholder="رابط الأدا
