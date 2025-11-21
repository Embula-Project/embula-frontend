
import Link from 'next/link';

export default function CustomerPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black border border-gray-700 rounded-xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Embula</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Discover our delicious menu crafted with the finest ingredients and passionate expertise.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">🍽️</div>
              <h3 className="text-white font-semibold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-400 text-sm">Quality ingredients sourced daily</p>
            </div>
            <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">👨‍🍳</div>
              <h3 className="text-white font-semibold mb-2">Expert Chefs</h3>
              <p className="text-gray-400 text-sm">Crafted by culinary professionals</p>
            </div>
            <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-white font-semibold mb-2">Fast Service</h3>
              <p className="text-gray-400 text-sm">Quick and efficient delivery</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/customer/customerMenu">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                Explore Our Menu
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
