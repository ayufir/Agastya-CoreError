import React, { useEffect, useRef } from "react";

const InfiniteScroll = ({ hasMore, onLoadMore, children, loading = false }) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        root: null, // relative to document viewport
        rootMargin: "100px", // trigger 100px before reaching the bottom
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasMore, onLoadMore, loading]);

  return (
    <div className="w-full flex flex-col">
      {children}
      {/* Sentinel loading trigger */}
      <div 
        ref={sentinelRef} 
        style={{ height: "20px", margin: "10px 0" }} 
        className="flex items-center justify-center text-slate-400 text-xs w-full"
      >
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-slate-350 border-t-blue-500 rounded-full animate-spin" />
            <span>Loading more cases...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteScroll;
