import React, { useState } from 'react';
import { Tool } from '../types';
import { CloseIcon } from './Icons';

interface AddToolFormProps {
    onAddTool: (tool: Tool) => Promise<void>;
    onClose: () => void;
    isSubmitting: boolean;
}

const AddToolForm: React.FC<AddToolFormProps> = ({ onAddTool, onClose, isSubmitting }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [toolUrl, setToolUrl] = useState('');
    const [featured, setFeatured] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !category || !toolUrl) {
            setError('Please fill out all required fields.');
            return;
        }
        setError('');
        await onAddTool({
            id: `local-${Date.now()}`,
            name,
            description,
            category,
            imageUrl: imageUrl || `https://picsum.photos/seed/${name}/500/300`,
            toolUrl,
            featured,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add a New AI Tool</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Tool Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-brand-blue focus:outline-none transition-colors" />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-brand-blue focus:outline-none transition-colors h-24 resize-none" />
                    <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-brand-blue focus:outline-none transition-colors" />
                    <input type="url" placeholder="Tool URL" value={toolUrl} onChange={e => setToolUrl(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-brand-blue focus:outline-none transition-colors" />
                    <input type="url" placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-brand-blue focus:outline-none transition-colors" />
                    <div className="flex items-center">
                        <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} className="h-5 w-5 rounded text-brand-blue focus:ring-brand-blue" />
                        <label htmlFor="featured" className="ml-2 text-gray-700 dark:text-gray-300">Mark as Featured</label>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait"
                      disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Tool'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddToolForm;