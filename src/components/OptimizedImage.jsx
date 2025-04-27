import React, { useState, useEffect, useRef } from 'react';

// 优化的图片组件，支持懒加载和渐进式加载
const OptimizedImage = ({ src, alt, className, style, width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // 检测图片是否在视口中
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 } // 当图片有10%进入视口时开始加载
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  // 当图片进入视口时加载
  useEffect(() => {
    if (isInView && imgRef.current) {
      const img = imgRef.current;
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [isInView, src]);

  return (
    <div 
      className={`optimized-image-container ${className || ''}`} 
      style={{ 
        ...style,
        width: width || 'auto',
        height: height || 'auto',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <img
        ref={imgRef}
        alt={alt || ''}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        loading="lazy"
      />
      {!isLoaded && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage; 