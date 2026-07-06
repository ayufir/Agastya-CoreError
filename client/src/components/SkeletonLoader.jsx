import React from "react";
import "../styles/skeleton.css";

export const TextSkeleton = ({ className = "", type = "medium" }) => {
  return <div className={`shimmer-base shimmer-text ${type} ${className}`} />;
};

export const CardSkeleton = () => {
  return (
    <div className="shimmer-card flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-3">
        <div className="shimmer-base" style={{ width: 38, height: 38, borderRadius: 11 }} />
        <TextSkeleton type="short" style={{ height: 10 }} />
      </div>
      <TextSkeleton type="heading" style={{ height: 28, width: 80 }} />
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <div className="shimmer-table-row bg-slate-50 border-b border-slate-200">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="shimmer-base shimmer-table-cell" style={{ flex: 1, height: 14 }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="shimmer-table-row">
          {Array.from({ length: cols }).map((_, c) => {
            // Give slightly varied widths for realism
            const widths = ["60%", "75%", "90%", "80%", "45%"];
            const cellWidth = widths[c % widths.length];
            return (
              <div key={c} style={{ flex: 1 }}>
                <div 
                  className="shimmer-base shimmer-table-cell" 
                  style={{ width: cellWidth }} 
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const SkeletonLoader = {
  Text: TextSkeleton,
  Card: CardSkeleton,
  Table: TableSkeleton,
};

export default SkeletonLoader;
