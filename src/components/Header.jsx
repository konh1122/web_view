import React from 'react';
import { Search, ArrowLeft } from 'lucide-react';

const Header = ({ 
  searchQuery, 
  setSearchQuery, 
  activeCategory, 
  setActiveCategory, 
  categories,
  showBackButton = false,
  onBackClick
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          {showBackButton ? (
            <button
              onClick={onBackClick}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              กลับ
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center font-bold text-white">
                V
              </div>
              <h1 className="text-xl font-bold text-gray-900">VideoStream</h1>
            </div>
          )}
        </div>

        {!showBackButton && (
          <>
            {/* Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="ค้นหาวิดีโอ..."
                className="w-full bg-gray-100 text-gray-900 px-4 py-2.5 pl-10 rounded-full focus:outline-none focus:bg-gray-50 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>

            {/* Category Pills */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;