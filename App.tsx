import React, { useEffect, useState } from 'react';
import { initialTools } from './data';

const NEON_COLOR = '#CCFF00';
const ACCENT_COLOR = '#03a9f4';
const DARK_BG = '#0a0a0a';
const CARD_BG = '#1a1a1a';
const TEXT_COLOR = '#e8e8e8';
const GOLD_COLOR = '#FFD700';
const SHEETY_API = 'https://api.sheety.co/31cb147aac99e6cd99f93c776de1/aiToolkit/tools';

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

const fetchToolsFromSheety = async (): Promise<Tool[]> => {
  try {
    const response = await fetch(SHEETY_API);
    if (!response.ok) return initialTools;
    const data = await response.json();
    return data.tools || initialTools;
  } catch {
    return initialTools;
  }
};

const addToolToSheety = async (tool: Tool): Promise<Tool | null> => {
  try {
    const response = await fetch(SHEETY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool }),
    });
    return response.ok ? tool : null;
  } catch {
    return null;
  }
};

const updateToolInSheety = async (id: number, tool: Tool): Promise<boolean> => {
  try {
    const response = await fetch(`${SHEETY_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool }),
    });
    return response.ok;
  } catch {
    return false;
  }
};

const deleteToolFromSheety = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${SHEETY_API}/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch {
    return false;
  }
};

const ToolCard: React.FC<{
  tool: Tool;
  onEdit: (tool: Tool) => void;
  onDelete: (id: number) => void;
  onToggleFeatured: (id: number) => void;
  isFeatured: boolean;
}> = ({ tool, onEdit, onDelete, onToggleFeatured, isFeatured }) => (
  <div
    style={{
      backgroundColor: CARD_BG,
      border: isFeatured ? `2px solid ${GOLD_COLOR}` : `1px solid rgba(204,255,0,0.2)`,
      borderRadius: '8px',
      padding: '12px',
      color: TEXT_COLOR,
      direction: 'rtl',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0', color: NEON_COLOR }}>{tool.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '12px' }}>{tool.description}</p>
        <p style={{ margin: '4px 0', fontSize: '11px', color: ACCENT_COLOR }}>{tool.category}</p>
        {tool.isPaid && <span style={{ background: '#ff4444', padding: '2px 6px', fontSize: '10px' }}>PAID</span>}
      </div>
      <div style={{ display: 'flex', gap: '4px', flexDirection: 'column', fontSize: '18px' }}>
        <button onClick={() => onToggleFeatured(tool.id!)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>⭐</button>
        <button onClick={() => onEdit(tool)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
        <button onClick={() => onDelete(tool.id!)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
        <a href={tool.toolUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>↗️</a>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [featured, setFeatured] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [newTool, setNewTool] = useState<Tool>({ name: '', description: '', category: '', toolUrl: '' });
  const [showPrompts, setShowPrompts] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [promptCategory, setPromptCategory] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchToolsFromSheety().then(data => setTools(data));
    const saved = localStorage.getItem('featured');
    if (saved) setFeatured(JSON.parse(saved));
    const savedPrompts = localStorage.getItem('prompts');
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
  }, []);

  const handleAddTool = async () => {
    if (newTool.name) {
      if (editingTool) {
        await updateToolInSheety(editingTool.id!, newTool);
        setTools(tools.map(t => t.id === editingTool.id ? { ...newTool, id: editingTool.id } : t));
      } else {
        await addToolToSheety(newTool);
        setTools([...tools, { ...newTool, id: Date.now() }]);
      }
      setNewTool({ name: '', description: '', category: '', toolUrl: '' });
      setEditingTool(null);
      setShowAddForm(false);
    }
  };

  const handleDeleteTool = async (id: number) => {
    await deleteToolFromSheety(id);
    setTools(tools.filter(t => t.id !== id));
    setFeatured(featured.filter(f => f !== id));
  };

  const handleToggleFeatured = (id: number) => {
    const newFeatured = featured.includes(id) ? featured.filter(f => f !== id) : [...featured, id];
    setFeatured(newFeatured);
    localStorage.setItem('featured', JSON.stringify(newFeatured));
  };

  const handleAddPrompt = () => {
    if (newPrompt && promptCategory) {
      const prompt: Prompt = { id: Date.now().toString(), title: newPrompt.substring(0, 20), content: newPrompt, category: promptCategory };
      const updated = [...prompts, prompt];
      setPrompts(updated);
      localStorage.setItem('prompts', JSON.stringify(updated));
      setNewPrompt('');
      setPromptCategory('');
    }
  };

  const filteredTools = tools.filter(t => 
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())) &&
    (!category || t.category === category)
  );

  const categories = [...new Set(tools.map(t => t.category))];
  const featuredTools = filteredTools.filter(t => featured.includes(t.id!));
  const regularTools = filteredTools.filter(t => !featured.includes(t.id!));
  const paginatedTools = regularTools.slice(0, itemsPerPage);

  return (
    <div style={{ backgroundColor: DARK_BG, color: TEXT_COLOR, minHeight: '100vh', padding: '20px', direction: 'rtl' }}>
      <h1 style={{ color: NEON_COLOR, textAlign: 'center', margin: '20px 0' }}>My AI Toolkit</h1>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="ابحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '8px', backgroundColor: CARD_BG, color: TEXT_COLOR, border: `1px solid ${NEON_COLOR}`, borderRadius: '4px' }}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px', backgroundColor: CARD_BG, color: TEXT_COLOR, border: `1px solid ${NEON_COLOR}`, borderRadius: '4px' }}>
            <option value="">جميع الفئات</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '8px 16px', backgroundColor: NEON_COLOR, color: DARK_BG, border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ إضافة أداة</button>
          <button onClick={() => setShowPrompts(!showPrompts)} style={{ padding: '8px 16px', backgroundColor: ACCENT_COLOR, color: TEXT_COLOR, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>الأوامر</button>
        </div>

        {showAddForm && (
          <div style={{ backgroundColor: CARD_BG, padding: '15px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${NEON_COLOR}` }}>
            <input placeholder="الاسم" value={newTool.name} onChange={(e) => setNewTool({...newTool, name: e.target.value})} style={{ width: '100%', marginBottom: '8px', padding: '8px', backgroundColor: DARK_BG, color: TEXT_COLOR, border: `1px solid ${NEON_COLOR}`, borderRadius: '4px' }} />
            <textarea placeholder="الوصف" value={newTool.description} onChange={(e) => setNewTool({...newTool, description: e.target.value})} style={{ width: '100%', marginBottom: '8px', padding: '8px', backgroundColor: DARK_BG, color: TEXT_COLOR, border: `1px solid ${NEON_COLOR}`, borderRadius: '4px' }} />
            <input placeholder="الفئة" value={newTool.category} onChange={(e) => setNewTool({...newTool, category: e.target.value})} style={{ width: '100%', marginBottom: '8px', padding: '8px', backgroundColor: DARK_BG, color: TEXT_COLOR, border: `1px solid ${NEON_COLOR}`, borderRadius: '4px' }} />
            <input placeholder="الرابط" value={newTool.toolUrl} onChange={(e) => setNewTool({...newTool, toolUrl: e.target.value})} style={{ width: '100%', marginBottom: '8px', padding: '8px', backgroundColor: DARK_BG, color: TEXT_COLOR, border: `1px solid ${NEON_COLOR}`, borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleAddTool} style={{ flex: 1, padding: '8px', backgroundColor: NEON_COLOR, color: DARK_BG, border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ</button>
              <button onClick={() => {setShowAddForm(false); setEditingTool(null);}} style={{ flex: 1, padding: '8px', backgroundColor: '#666', color: TEXT_COLOR, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        )}

        {showPrompts && (
          <div style={{ backgroundColor: CARD_BG, padding: '15px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${ACCENT_COLOR}` }}>
            <h3 style={{ color: NEON_COLOR, margin: '0 0 10px 0' }}>الأوامر المحفوظة</h3>
            <div style={{ marginBottom: '10px' }}>
              {prompts.map(p => (
                <div key={p.id} style={{ backgroundColor: DARK_BG, padding: '8px', marginBottom: '8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <div><strong>{p.category}:</strong> {p.content.substring(0, 50)}</div>
                  <button onClick={() => {const updated = prompts.filter(pr => pr.id !== p.id); setPrompts(updated); localStorage.setItem('prompts', JSON.stringify(updated));}} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input placeholder="الفئة" value={promptCategory} onChange={(e) => setPromptCategory(e.target.value)} style={{ flex: 1, padding: '8px', backgroundColor: DARK_BG, color: TEXT_COLOR, border: `1px solid ${NEON_COLOR}`, borderRadius: '4px' }} />
              <textarea placeholder="الأمر" value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} style={{ flex: 2, padding: '8px', backgroundColor: DARK_BG, color: TEXT_COLOR, border: `1px solid ${NEON_COLOR}`, borderRadius: '4px' }} />
              <button onClick={handleAddPrompt} style={{ padding: '8px 16px', backgroundColor: ACCENT_COLOR, color: TEXT_COLOR, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>إضافة</button>
            </div>
          </div>
        )}

        {featuredTools.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: GOLD_COLOR, fontSize: '16px' }}>⭐ المفضلة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {featuredTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onEdit={setEditingTool}
                  onDelete={handleDeleteTool}
                  onToggleFeatured={handleToggleFeatured}
                  isFeatured={true}
                />
              ))}
            </div>
          </div>
        )}

        <h2 style={{ color: NEON_COLOR, fontSize: '16px' }}>الأدوات</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {paginatedTools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onEdit={(t) => { setEditingTool(t); setNewTool(t); setShowAddForm(true); }}
              onDelete={handleDeleteTool}
              onToggleFeatured={handleToggleFeatured}
              isFeatured={featured.includes(tool.id!)}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{ padding: '8px', backgroundColor: CARD_BG, color: TEXT_COLOR, border: `1px solid ${NEON_COLOR}`, borderRadius: '4px' }}>
            <option value={5}>5 عناصر</option>
            <option value={10}>10 عناصر</option>
            <option value={20}>20 عنصر</option>
            <option value={50}>50 عنصر</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default App;
