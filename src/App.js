import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Swords, Users } from 'lucide-react';

// Main App Component
const App = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHero, setSelectedHero] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  // Mock data to simulate the API response
  const mockHeroes = [
    {
      hero_id: "1",
      name: "Chou",
      icon: "https://i.imgur.com/KzX33vC.png",
      win_rate: 55.21,
      countered_by: [
        { hero_id: "2", name: "Nana", icon: "https://i.imgur.com/FjM0TzD.png" },
        { hero_id: "3", name: "Akai", icon: "https://i.imgur.com/Pq9zY2w.png" }
      ],
      synergy: [
        { hero_id: "4", name: "Masha", icon: "https://i.imgur.com/Y3U724t.png" },
        { hero_id: "5", name: "Angela", icon: "https://i.imgur.com/R3zYq0T.png" }
      ]
    },
    {
      hero_id: "6",
      name: "Nana",
      icon: "https://i.imgur.com/FjM0TzD.png",
      win_rate: 53.89,
      countered_by: [
        { hero_id: "7", name: "Lancelot", icon: "https://i.imgur.com/C5uM43l.png" },
        { hero_id: "8", name: "Gusion", icon: "https://i.imgur.com/S8jQ13v.png" }
      ],
      synergy: [
        { hero_id: "9", name: "Estes", icon: "https://i.imgur.com/E8RzY0d.png" },
        { hero_id: "10", name: "Tigreal", icon: "https://i.imgur.com/P4w8hDq.png" }
      ]
    },
    {
      hero_id: "11",
      name: "Fanny",
      icon: "https://i.imgur.com/W2d4D9E.png",
      win_rate: 51.50,
      countered_by: [
        { hero_id: "12", name: "Khufra", icon: "https://i.imgur.com/R4y2T1p.png" },
        { hero_id: "13", name: "Diggie", icon: "https://i.imgur.com/Q1h9T3Z.png" }
      ],
      synergy: [
        { hero_id: "14", name: "Ruby", icon: "https://i.imgur.com/D4sT5fE.png" },
        { hero_id: "15", name: "Kaja", icon: "https://i.imgur.com/A6jP9vO.png" }
      ]
    },
    {
      hero_id: "16",
      name: "Miya",
      icon: "https://i.imgur.com/B9zT5hU.png",
      win_rate: 49.03,
      countered_by: [
        { hero_id: "17", name: "Natalia", icon: "https://i.imgur.com/G5y1K3v.png" },
        { hero_id: "18", name: "Hayabusa", icon: "https://i.imgur.com/P9oT4eJ.png" }
      ],
      synergy: [
        { hero_id: "19", name: "Layla", icon: "https://i.imgur.com/D1h2F3s.png" },
        { hero_id: "20", name: "Eudora", icon: "https://i.imgur.com/L6kP5jW.png" }
      ]
    },
    {
      hero_id: "21",
      name: "Gord",
      icon: "https://i.imgur.com/C4gL5pP.png",
      win_rate: 47.78,
      countered_by: [
        { hero_id: "22", name: "Chou", icon: "https://i.imgur.com/KzX33vC.png" },
        { hero_id: "23", name: "Ling", icon: "https://i.imgur.com/T4j8Y7L.png" }
      ],
      synergy: [
        { hero_id: "24", name: "Minotaur", icon: "https://i.imgur.com/Z8vX1hT.png" },
        { hero_id: "25", name: "Atlas", icon: "https://i.imgur.com/Y2w8T1u.png" }
      ]
    }
  ];

  // Function to load mock data locally
  useEffect(() => {
    // Simulate a network delay to show the loading animation
    setTimeout(() => {
      // Sort mock data by win rate initially in descending order
      const sortedData = mockHeroes.sort((a, b) => b.win_rate - a.win_rate);
      setHeroes(sortedData);
      setLoading(false);
    }, 1500); // 1.5 seconds delay to see the animation
  }, []);

  // Function to handle sorting the hero list
  const handleSortByWinRate = () => {
    const newSortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    const sortedHeroes = [...heroes].sort((a, b) => {
      if (newSortDirection === 'asc') {
        return a.win_rate - b.win_rate;
      }
      return b.win_rate - a.win_rate;
    });
    setHeroes(sortedHeroes);
    setSortDirection(newSortDirection);
  };

  // Render loading state with a visual animation
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-900 text-white">
        {/* CSS for the loading animation */}
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.7; }
            }
            .spinner {
              animation: spin 1.5s linear infinite;
            }
            .pulsate {
              animation: pulse 1.5s ease-in-out infinite;
            }
          `}
        </style>
        <div className="flex flex-col items-center justify-center">
          <div className="relative pulsate mb-4">
            <Swords size={64} className="text-emerald-500 spinner" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">正在加载英雄数据...</p>
        </div>
      </div>
    );
  }

  // Component to render a single hero card
  const HeroCard = ({ hero, onClick }) => (
    <div
      onClick={onClick}
      className="p-3 bg-gray-800 rounded-lg shadow-lg flex items-center space-x-4 cursor-pointer hover:bg-gray-700 transition-colors"
    >
      <img
        src={hero.icon}
        alt={hero.name}
        className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/48x48/57534e/e7e5e4?text=Hero";
        }}
      />
      <div className="flex-1">
        <h3 className="text-white text-lg font-semibold">{hero.name}</h3>
      </div>
      <div className="text-white font-bold">
        {hero.win_rate.toFixed(2)}%
      </div>
    </div>
  );

  // Component to render hero details (counters and synergies)
  const HeroDetails = ({ hero, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 md:scale-100 transition-transform">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <img
              src={hero.icon}
              alt={hero.name}
              className="w-16 h-16 rounded-full border-4 border-emerald-500 mr-4 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/64x64/57534e/e7e5e4?text=Hero";
              }}
            />
            {hero.name}
            <span className="ml-4 text-emerald-400 text-xl font-bold">{hero.win_rate.toFixed(2)}%</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Counters Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-red-400 mb-3 flex items-center">
            <Swords className="mr-2" size={20} />
            克制关系 (Countered by)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {hero.countered_by.length > 0 ? (
              hero.countered_by.map((counter) => (
                <div key={counter.hero_id} className="flex items-center space-x-2 bg-red-900 bg-opacity-50 rounded-lg p-2">
                  <img
                    src={counter.icon}
                    alt={counter.name}
                    className="w-8 h-8 rounded-full border-2 border-red-400 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/32x32/57534e/e7e5e4?text=C";
                    }}
                  />
                  <span className="text-white text-sm">{counter.name}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">暂无克制数据。</p>
            )}
          </div>
        </div>

        {/* Synergy Section */}
        <div>
          <h3 className="text-xl font-semibold text-blue-400 mb-3 flex items-center">
            <Users className="mr-2" size={20} />
            阵容搭配 (Synergy)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {hero.synergy.length > 0 ? (
              hero.synergy.map((synergyHero) => (
                <div key={synergyHero.hero_id} className="flex items-center space-x-2 bg-blue-900 bg-opacity-50 rounded-lg p-2">
                  <img
                    src={synergyHero.icon}
                    alt={synergyHero.name}
                    className="w-8 h-8 rounded-full border-2 border-blue-400 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/32x32/57534e/e7e5e4?text=S";
                    }}
                  />
                  <span className="text-white text-sm">{synergyHero.name}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">暂无搭配数据。</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-emerald-400 mb-2">MLBB 英雄数据</h1>
        <p className="text-center text-gray-400 text-lg">英雄排行, 胜率, 阵容搭配, 克制关系</p>
      </header>

      <main className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">英雄胜率排行</h2>
          <button
            onClick={handleSortByWinRate}
            className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span className="mr-2 text-lg">按胜率排序</span>
            {sortDirection === 'desc' ? (
              <ChevronDown size={20} className="stroke-2" />
            ) : (
              <ChevronUp size={20} className="stroke-2" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroes.map((hero) => (
            <HeroCard key={hero.hero_id} hero={hero} onClick={() => setSelectedHero(hero)} />
          ))}
        </div>
      </main>

      {/* Render the details modal if a hero is selected */}
      {selectedHero && (
        <HeroDetails hero={selectedHero} onClose={() => setSelectedHero(null)} />
      )}
    </div>
  );
};

export default App;
