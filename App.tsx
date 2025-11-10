import React from 'react';
import { initialTools } from './data';

function App() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-brand-purple to-brand-blue flex flex-col items-center justify-start py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">Welcome to AI Toolkit</h1>
        <p className="text-xl text-white mb-8">Your complete AI tools collection</p>
        <p className="text-white text-lg">✨ Successfully deployed on GitHub Pages!</p>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => window.open(tool.toolUrl, '_blank')}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 cursor-pointer hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 border border-white border-opacity-20"
            >
              {tool.imageUrl && (
                <img
                  src={tool.imageUrl}
                  alt={tool.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-bold text-white mb-2">{tool.name}</h2>
              {tool.category && (
                <p className="text-sm text-blue-200 mb-2 uppercase tracking-wide">{tool.category}</p>
              )}
              <p className="text-white text-opacity-90 text-sm mb-4">{tool.description}</p>
              {tool.featured && (
                <div className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold mb-4">
                  ⭐ Featured
                </div>
              )}
              <div className="mt-4">
                <a
                  href={tool.toolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open Tool →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
