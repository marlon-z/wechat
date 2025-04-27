// 图片加载优化脚本
document.addEventListener('DOMContentLoaded', function() {
  // 延迟加载所有带有data-src属性的图片
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          
          // 图片加载完成后添加淡入效果
          image.onload = function() {
            image.classList.add('loaded');
          };
          
          // 停止观察已加载的图片
          imageObserver.unobserve(image);
        }
      });
    }, {
      rootMargin: '0px 0px 50px 0px',
      threshold: 0.1
    });
    
    lazyImages.forEach(function(image) {
      // 为每个图片添加占位符样式
      image.style.transition = 'opacity 0.3s ease-in-out';
      image.style.opacity = '0';
      
      // 开始观察
      imageObserver.observe(image);
    });
  } else {
    // 回退方案：对于不支持IntersectionObserver的浏览器
    let lazyImageTimeout;
    
    function lazyLoadImages() {
      if (lazyImageTimeout) {
        clearTimeout(lazyImageTimeout);
      }
      
      lazyImageTimeout = setTimeout(function() {
        const scrollTop = window.pageYOffset;
        
        lazyImages.forEach(function(image) {
          if (image.offsetTop < (window.innerHeight + scrollTop)) {
            image.src = image.dataset.src;
            image.onload = function() {
              image.classList.add('loaded');
            };
          }
        });
        
        if (lazyImages.length === 0) {
          document.removeEventListener('scroll', lazyLoadImages);
          window.removeEventListener('resize', lazyLoadImages);
          window.removeEventListener('orientationChange', lazyLoadImages);
        }
      }, 20);
    }
    
    document.addEventListener('scroll', lazyLoadImages);
    window.addEventListener('resize', lazyLoadImages);
    window.addEventListener('orientationChange', lazyLoadImages);
    lazyLoadImages();
  }
  
  // 图片预先获取 - 为常用图片添加预加载
  const preloadImages = [
    '/logo192.png',
    '/images/header-background.jpg'
  ];
  
  preloadImages.forEach(function(src) {
    const img = new Image();
    img.src = src;
  });
}); 