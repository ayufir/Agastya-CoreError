import React, { useState, useEffect, useRef } from "react";
import "../styles/skeleton.css";

const LazyImage = ({ src, alt, className = "", style = {}, placeholderHeight = "150px" }) => {
  const [isIntersected, setIsIntersected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // If browser doesn't support IntersectionObserver, fall back to eager loading
    if (!window.IntersectionObserver) {
      setIsIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersected(true);
            observer.disconnect(); // Stop observing once loaded
          }
        });
      },
      { rootMargin: "50px" } // Load slightly before it comes into view
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={imgRef} 
      className="relative overflow-hidden w-full h-full"
      style={{ minHeight: !isLoaded ? placeholderHeight : "auto", ...style }}
    >
      {/* Shimmer Placeholder */}
      {!isLoaded && (
        <div 
          className="shimmer-base absolute inset-0 w-full h-full" 
          style={{ minHeight: placeholderHeight }} 
        />
      )}

      {/* Actual Image */}
      {isIntersected && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-500 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0 absolute"
          }`}
          onLoad={() => setIsLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: style.objectFit || "cover",
            ...style,
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
