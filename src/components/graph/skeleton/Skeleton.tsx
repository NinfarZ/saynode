import React from "react";

export const Skeleton: React.FC = () => {
  return (
    <div className="w-full p-4 flex flex-col gap-4 h-[700px]">
      {/* Title placeholder */}
        <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
     
      {/* Legend / small chips placeholder */}
      <div className="flex gap-3 items-center">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      {/* Chart area placeholder */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="w-full h-full animate-pulse bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />
      </div>

      
    </div>
  );
};

export default Skeleton;
