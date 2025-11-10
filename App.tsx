import React, { useState, useEffect } from 'react';
import { initialTools } from './data';

function App() {
  const [tools, setTools] = useState(initialTools || []);

  useEffect(() => {
    console.log('Tools loaded:', tools);
    console.log('Tools count:', tools.length);
  }, [tools]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col items-center justify-start py-8">
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to AI Toolkit</h1>
        <p className="text-lg md:text-xl text-white mb-8">Your complete AI tools collection</p>
        <p className="text-white text-base md:text-lg">✨ Successfully deployed on GitHub Pages!</p>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
        {tools && tools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.slice(0, 12).map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 md:p-6 cursor-pointer hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 border border-white border-opacity-20"
                  onClick={() => window.open(tool.toolUrl, '_blank')}
                >
                  {tool.imageUrl && (
                    <img
                      src={tool.imageUrl}
                      alt={tool.name}
                      className="w-full h-32 md:h-40 object-cover rounded-lg mb-4"
                      onerror="this.src='https://via.placeholder.com/300x200?text=' + encodeURIComponent(this.alt)"
                    />
                  )}
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 line-clamp-2">{tool.name}</h3>
                  {tool.category && (
                    <p className="text-xs md:text-sm text-blue-200 mb-2 uppercase tracking-wide">{tool.category}</p>
                  )}
                  <p className="text-white text-opacity-80 text-sm mb-4 line-clamp-3">{tool.description}</p>
                  {tool.featured && (
                    <div className="inline-block bg-yellow-400 text-black px-2 md:px-3 py-1 rounded-full text-xs font-bold mb-4">
                      ⭐ Featured
                    </div>
                  )}
                  <div className="mt-4">
                    <a
                      href={tool.toolUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg transition-all duration-300 text-xs md:text-sm"
                    >
                      Open →
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {tools.length > 12 && (
              <p className="text-center text-white text-opacity-70 mt-8 text-sm md:text-base">Showing 12 of {tools.length} tools</p>
            )}
          </>
        ) : (
          <div className="text-center text-white mt-12">
            <p className="text-lg">Loading tools...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
