import Menu from '../components/Menu';

export default function CustomerMenu() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Our Menu</h1>
          <p className="text-gray-400">Discover our carefully curated selection of dishes</p>
        </div>
        <Menu />
      </div>
    </div>
  );
}



