export default function ProfileDropdown() {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-medium">A</span>
        </div>
        <span className="text-gray-700 font-medium text-sm">Admin</span>
        <span className="text-gray-400 text-xs transition-transform group-hover:rotate-180">
          ▼
        </span>
      </button>

      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30 transform translate-y-2 group-hover:translate-y-0">
        <div className="p-2 space-y-1">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Administrateur</p>
            <p className="text-xs text-gray-500 truncate">
              admin@hashseven.com
            </p>
          </div>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
            <span className="text-lg">👤</span>
            <span>Profil</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
            <span className="text-lg">⚙️</span>
            <span>Paramètres</span>
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">
            <span className="text-lg">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
