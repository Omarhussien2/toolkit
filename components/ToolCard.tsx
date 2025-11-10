import React from 'react';
import { Tool } from '../types';
import { StarIcon } from './Icons';

interface ToolCardProps {
  tool: Tool;
  onToggleFeatured: (id: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onToggleFeatured }) => {
  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFeatured(tool.id);
  };

  return (
    <a 
      href={tool.toolUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group block bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-blue-500 rounded-2xl p-6 transform transition-all duration-300 h-full flex flex-col hover:scale-105"
    >
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white pr-4">{tool.name}</h3>
          <button 
            onClick={handleStarClick} 
            className="p-1 -m-1 z-10 flex-shrink-0"
            aria-label={tool.featured ? 'Remove from featured' : 'Add to featured'}
            title={tool.featured ? 'Remove from featured' : 'Add to featured'}
          >
            <StarIcon className={`w-5 h-5 transition-colors ${tool.featured ? 'text-yellow-400' : 'text-zinc-600 group-hover:text-yellow-300'}`} />
          </button>
        </div>
        <p className="text-zinc-400 text-sm">{tool.description}</p>
      </div>
      <div className="mt-4 text-xs text-blue-400 group-hover:underline">{tool.category}</div>
    </a>
  );
};

export default ToolCard;