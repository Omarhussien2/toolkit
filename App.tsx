import React, { useEffect, useState } from 'react';
import { initialTools } from './data';

// ======================== الألوان والثوابت ========================
const NEON_COLOR = '#CCFF00';
const ACCENT_COLOR = '#03a9f4';
const DARK_BG = '#0a0a0a';
const CARD_BG = '#1a1a1a';
const TEXT_COLOR = '#e0e0e0';
const GOLD_COLOR = '#FFD700';
const SHEETY_API = 'https://api.sheety.co/6912c67fe0fa9a0546f333fe/tools/tools';

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
    return [];
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
    className="rounded-lg p-6 border-2 transition-all hover:shadow-xl"
    style={{
      backgroundColor: CARD_BG,
      borderColor: isFeatured ? GOLD_COLOR : '#333',
      boxShadow: isFeatured ? `0 0 20px ${GOLD_COLOR}80` : 'none',
    }}
  >
    {tool.isPaid && (
      <span
        className="inline-block px-3 py-1 rounded text-sm font-bold mb-2"
        style={{ backgroundColor: '#ef4444', color: 'white' }}
      >
        مدفوع
      </span>
    )}
    <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
    <p className="text-gray-400 text-sm mb-3">{tool.description}</p>
    <div className="flex gap-2 mb-3">
      <span
        className="px-3 py-1 rounded text-xs"
        style={{ backgroundColor: '#222', color: NEON_COLOR }}
      >
        {tool.category}
      </span>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => window.open(tool.toolUrl, '_blank')}
        className="flex-1 py-2 rounded font-bold transition hover:opacity-90"
        style={{ backgroundColor: NEON_COLOR, color: 'black' }}
      >
        فتح
      </button>
      <button
        onClick={() => onToggleFeatured(tool.id)}
        className="px-4 py-2 rounded font-bold transition"
        style={{
          backgroundColor: isFeatured ? GOLD_COLOR : '#333',
          color: isFeatured ? 'black' : TEXT_COLOR,
        }}
      >
        {isFeatured ? '⭐' : '☆'}
      </button>
      <button
        onClick={() => onEdit(tool)}
        className="px-4 py-2 rounded font-bold"
        style={{ backgroundColor: ACCENT_COLOR, color: 'white' }}
      >
        تعديل
      </button>
      <button
        onClick={() => onDelete(tool.id)}
        className="px-4 py-2 rounded font-bold"
        style={{ backgroundColor: '#ef4444', color: 'white' }}
      >
        حذف
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
  const [showPromptsModal, setShowPromptsModal] = useState(false);
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [newPrompt, setNewPrompt] = useState<Prompt>({
    id: '',
    title: '',
    content: '',
    category: 'Writing',
  });
  const [selectedPromptCategory, setSelectedPromptCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const PROMPT_CATEGORIES = ['All', 'Writing', 'Analysis', 'Creative', 'Technical', 'Business'];
  const CATEGORIES = ['All', 'AI', 'Writing', 'Image', 'Code', 'Voice', 'Video', 'Other'];

  const defaultPrompts: Prompt[] = [
    {
      id: 'p1',
      title: 'تلخيص',
      content: 'يرجى تلخيص هذا النص بشكل موجز...',
      category: 'Analysis',
    },
    {
      id: 'p2',
      title: 'كتابة إبداعية',
      content: 'اكتب قصة إبداعية عن...',
      category: 'Creative',
    },
    {
      id: 'p3',
      title: 'مراجعة الكود',
      content: 'راجع هذا الكود واقترح تحسينات...',
      category: 'Technical',
    },
    {
      id: 'p4',
      title: 'تحسين SEO',
      content: 'ساعدني في تحسين هذا المحتوى لتحسين محركات البحث...',
      category: 'Business',
    },
  ];

  // ========== تحميل البيانات ==========
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

  // ========== حفظ المفضلة ==========
  useEffect(() => {
    localStorage.setItem('featured', JSON.stringify(Array.from(featuredIds)));
  }, [featuredIds]);

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts));
  }, [prompts]);

  // ========== دوال المعالجة ==========
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

  const handleAddPrompt = () => {
    if (!newPrompt.title || !newPrompt.content) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }
    setPrompts([...prompts, { ...newPrompt, id: Date.now().toString() }]);
    setNewPrompt({ id: '', title: '', content: '', category: 'Writing' });
    setShowPromptForm(false);
  };

  const handleCopyPrompt = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
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

  const allPrompts = [...defaultPrompts, ...prompts];
  const filteredPrompts = allPrompts.filter(
    p => selectedPromptCategory === 'All' || p.category === selectedPromptCategory
  );

  return (
    <div className="min-h-screen text-white" dir="rtl" style={{ backgroundColor: DARK_BG }}>
      <style>{`
        * { font-family: 'Tajawal', sans-serif; }
        body { margin: 0; padding: 0; }
        .featured-glow { box-shadow: 0 0 20px ${GOLD_COLOR}, inset 0 0 10px rgba(255, 215, 0, 0.2); }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-8px); }
        input, textarea, select { direction: rtl; }
      `}</style>

      <div className="flex" style={{ minHeight: '100vh' }}>
        {/* الشريط الجانبي */}
        <div className="w-80 border-r" style={{ borderColor: '#333', backgroundColor: CARD_BG, maxHeight: '100vh', overflowY: 'auto' }}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: NEON_COLOR }}>💡 البرومات</h2>

            <div className="space-y-3 mb-6">
              {prompts.map(p => (
                <div key={p.id} className="rounded-lg p-3" style={{ backgroundColor: '#222' }}>
                  <p className="
