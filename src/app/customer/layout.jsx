

export const metadata = {
  title: "Customer Dashboard - Embula",
  description: "Customer portal for Embula restaurant",
};

export default function CustomerLayout({ children }) {
  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url("/menupage.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Full page overlay for blur and darkness */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/85 backdrop-blur-sm"></div>
      
      <main className="relative z-10 flex-1">
        {children}
      </main>
    </div>
  );
}
