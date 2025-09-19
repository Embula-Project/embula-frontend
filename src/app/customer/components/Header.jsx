export default function Header() {
  return (
    <header className="bg-black border-b border-gray-800 p-6 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold text-white tracking-wide">Embula Portal</h1>
      <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium border border-gray-600">
        Menu
      </button>
    </header>
  );
}
