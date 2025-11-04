export const EmptyState = ({
  message,
  onClear,
}: {
  message: string;
  onClear: () => void;
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
      <span className="text-2xl text-gray-400">📦</span>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-3">
      Aucun produit disponible
    </h3>
    <p className="text-gray-500 max-w-md mx-auto mb-6">{message}</p>
    <button
      onClick={onClear}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Effacer les filtres
    </button>
  </div>
);
