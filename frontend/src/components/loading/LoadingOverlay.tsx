const LoadingOverlay = ({ message = "Loading..." }: { message?: string }) => (
  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-700 dark:text-gray-300 font-medium">
        {message}
      </span>
    </div>
  </div>
);

export default LoadingOverlay;
