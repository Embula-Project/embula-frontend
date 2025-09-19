export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 p-6 text-center">
      <div className="text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Embula. All rights reserved.
      </div>
      <div className="text-gray-500 text-xs mt-2">
        Crafted with excellence
      </div>
    </footer>
  );
}
