

const FolderSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="relative flex items-stretch gap-3 rounded-md border bg-white/80 p-3 text-left animate-pulse border-gray-200"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gray-200">
            <div className="h-10 w-10 bg-gray-300 rounded"></div>
          </div>
          <div className="min-w-0 flex-1 flex flex-col justify-center space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FolderSkeleton;
