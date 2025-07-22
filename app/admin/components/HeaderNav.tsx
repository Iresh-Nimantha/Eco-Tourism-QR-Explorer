// components/HeaderNav.js
export default function HeaderNav() {
  return (
    <nav className="flex justify-between items-center mb-8">
      <span className="text-2xl font-semibold text-gray-700">Dashboard</span>
      <div className="space-x-8">
        <a href="/" className="text-gray-600 hover:text-gray-900">
          Website
        </a>
        <a href="/admin" className="text-gray-600 hover:text-gray-900">
          View locations
        </a>
        <a href="/logout" className="text-gray-600 hover:text-gray-900">
          Logout
        </a>
      </div>
    </nav>
  );
}
