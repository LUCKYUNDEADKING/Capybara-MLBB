import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Swords, Users } from 'lucide-react';

// Main App Component
const App = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [retryCount, setRetryCount] = useState(0); // Add state for retry count
  const MAX_RETRIES = 3; // Maximum number of retries
  const API_URL = 'https://mlbb-stats.ridwaanhall.com/api/v1/heroes/';
  const FETCH_TIMEOUT_MS = 10000; // 10-second timeout

  // A helper function to add a timeout to the fetch request
  const fetchWithTimeout = (url, options = {}, timeout = FETCH_TIMEOUT_MS) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('请求超时')), timeout)
      )
    ]);
  };

  // Function to fetch hero data with retry and timeout logic
  const fetchHeroesWithRetry = async (retries = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWithTimeout(API_URL);
      if (!response.ok) {
        throw new Error(`API 请求失败，状态码: ${response.status}`);
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => b.win_rate - a.win_rate);
      setHeroes(sortedData);
      setLoading(false);
    } catch (e) {
      if (retries < MAX_RETRIES) {
        setRetryCount(retries + 1);
        setTimeout(() => fetchHeroesWithRetry(retries + 1), 2000 * (retries + 1));
      } else {
        setError(`加载数据失败。请检查您的网络连接或稍后重试。详细错误: ${e.message}`);
        setLoading(false);
      }
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchHeroesWithRetry(0);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        {/* CSS for the loading animation */}
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
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
          <div className="relative pulsate">
            <Swords size={64} className="text-emerald-500 spinner" />
          </div>
          <p className="mt-4 text-xl font-semibold">正在加载英雄数据...</p>
          {retryCount > 0 && (
            <p className="text-md text-gray-400 mt-2">正在重试 ({retryCount}/{MAX_RETRIES})...</p>
          )}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
        <div className="text-xl text-red-500 font-semibold mb-4">加载失败</div>
        <p className="text-gray-300 max-w-md">{error}</p>
        <button
          onClick={() => fetchHeroesWithRetry(0)}
          className="mt-6 px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-400 transition-colors"
        >
          重新加载
        </button>
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
