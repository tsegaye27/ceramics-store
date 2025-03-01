const SkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg animate-pulse"
      >
        <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-t-lg mb-4"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
