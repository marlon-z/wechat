// 浏览器特定优化脚本
(function() {
  // 检测浏览器类型和版本
  function detectBrowser() {
    const userAgent = navigator.userAgent;
    let browser = 'unknown';
    let version = 'unknown';

    // Chrome
    if (/Chrome/.test(userAgent) && !/Chromium|Edge|Edg|OPR|Opera/.test(userAgent)) {
      browser = 'chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      version = match ? parseInt(match[1], 10) : 'unknown';
    } 
    // Firefox
    else if (/Firefox/.test(userAgent)) {
      browser = 'firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      version = match ? parseInt(match[1], 10) : 'unknown';
    } 
    // Safari
    else if (/Safari/.test(userAgent) && !/Chrome|Chromium|Edge|Edg|OPR|Opera/.test(userAgent)) {
      browser = 'safari';
      const match = userAgent.match(/Version\/(\d+)/);
      version = match ? parseInt(match[1], 10) : 'unknown';
    } 
    // Edge (新版基于Chromium)
    else if (/Edg|Edge/.test(userAgent)) {
      browser = 'edge';
      const match = userAgent.match(/Edg(?:e)?\/(\d+)/);
      version = match ? parseInt(match[1], 10) : 'unknown';
    } 
    // IE
    else if (/Trident|MSIE/.test(userAgent)) {
      browser = 'ie';
      const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
      version = match ? parseInt(match[1], 10) : 'unknown';
    } 
    // Opera
    else if (/OPR|Opera/.test(userAgent)) {
      browser = 'opera';
      const match = userAgent.match(/(?:OPR|Opera)\/(\d+)/);
      version = match ? parseInt(match[1], 10) : 'unknown';
    }

    // 检测移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    return { browser, version, isMobile };
  }

  // 应用浏览器特定优化
  function applyBrowserOptimizations() {
    const { browser, version, isMobile } = detectBrowser();
    
    // 为HTML标签添加浏览器类标记
    document.documentElement.classList.add(`browser-${browser}`);
    document.documentElement.classList.add(`${browser}-${version}`);
    
    if (isMobile) {
      document.documentElement.classList.add('mobile-device');
    }

    console.log(`检测到浏览器: ${browser} ${version}, 移动设备: ${isMobile}`);

    // === Chrome 特定优化 ===
    if (browser === 'chrome') {
      // 使用CSS will-change属性提示Chrome的图层合成器
      if (version >= 60) {
        const heavyAnimationElements = document.querySelectorAll('.animated, .hover-effect, .scroll-effect');
        heavyAnimationElements.forEach(el => {
          el.style.willChange = 'transform, opacity';
        });
      }
      
      // Chrome中优化滚动性能
      if (version >= 75) {
        const scrollableElements = document.querySelectorAll('.scrollable');
        scrollableElements.forEach(el => {
          el.style.overscrollBehavior = 'contain'; // 防止滚动传播
          el.style.scrollbarWidth = 'thin'; // 使用细滚动条
          el.style.scrollbarColor = 'rgba(155, 155, 155, 0.5) transparent'; // 自定义滚动条颜色
        });
      }
    }
    
    // === Firefox 特定优化 ===
    else if (browser === 'firefox') {
      // 添加Firefox特定的滚动优化
      if (version >= 70) {
        document.body.style.scrollbarWidth = 'thin';
        document.body.style.scrollbarColor = 'rgba(155, 155, 155, 0.5) transparent';
      }
      
      // 使用Firefox的content-visibility属性
      if (version >= 83) {
        const offScreenElements = document.querySelectorAll('.offscreen-content');
        offScreenElements.forEach(el => {
          el.style.contentVisibility = 'auto';
          el.style.containIntrinsicSize = '0 500px'; // 提供一个占位大小
        });
      }
    }
    
    // === Safari 特定优化 ===
    else if (browser === 'safari') {
      // Safari中PNG优化（避免特定Safari渲染问题）
      if (version <= 14) {
        const pngImages = document.querySelectorAll('img[src$=".png"]');
        pngImages.forEach(img => {
          // 强制重新计算PNG图片渲染，避免某些Safari版本的渲染问题
          img.style.transform = 'translateZ(0)';
        });
      }
      
      // 临时修复Safari中的粘性元素问题
      if (version >= 11 && version <= 13) {
        const stickyElements = document.querySelectorAll('.sticky');
        stickyElements.forEach(el => {
          el.style.position = 'fixed';
          el.style.top = '0';
        });
      }
    }
    
    // === Edge 特定优化 ===
    else if (browser === 'edge') {
      // 针对Edge的渲染优化
      if (version >= 80) {
        // 新版基于Chromium的Edge，应用Chrome相同的优化
        const heavyAnimationElements = document.querySelectorAll('.animated, .hover-effect, .scroll-effect');
        heavyAnimationElements.forEach(el => {
          el.style.willChange = 'transform, opacity';
        });
      }
    }
    
    // === IE 特定优化 ===
    else if (browser === 'ie') {
      // 为IE添加更兼容的样式
      const cssStyles = document.createElement('style');
      cssStyles.textContent = `
        /* IE特定修复 */
        .flex-container { display: block !important; }
        .grid-container { display: block !important; }
        .modern-feature { display: none !important; }
        .legacy-fallback { display: block !important; }
      `;
      document.head.appendChild(cssStyles);
      
      // 警告IE用户
      if (!sessionStorage.getItem('ie-warning-shown')) {
        setTimeout(() => {
          alert('您正在使用Internet Explorer浏览器，部分功能可能无法正常工作。建议升级到Edge、Chrome或Firefox等现代浏览器获得更好体验。');
          sessionStorage.setItem('ie-warning-shown', 'true');
        }, 1000);
      }
    }

    // === 移动设备特定优化 ===
    if (isMobile) {
      // 移动设备优化
      document.addEventListener('touchstart', function(){}, {passive: true}); // 使触摸事件被动监听，提高滚动性能
      
      // 简化移动设备上的动画
      const animations = document.querySelectorAll('.complex-animation');
      animations.forEach(el => {
        el.classList.add('simplified-animation');
      });
      
      // 移动设备上延迟加载非关键元素
      const nonCriticalElements = document.querySelectorAll('.non-critical');
      setTimeout(() => {
        nonCriticalElements.forEach(el => {
          el.classList.add('loaded');
        });
      }, 2000);
    }

    // 动态加载特定浏览器的补丁
    if (browser === 'ie' || (browser === 'edge' && version < 79)) {
      // 旧版Edge和IE需要一些polyfill
      const polyfillScript = document.createElement('script');
      polyfillScript.src = 'https://polyfill.io/v3/polyfill.min.js?features=default,Array.prototype.includes,Promise,fetch';
      document.head.appendChild(polyfillScript);
    }
  }

  // 在DOM内容加载后应用优化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBrowserOptimizations);
  } else {
    applyBrowserOptimizations();
  }

  // 特定浏览器的内存优化
  window.addEventListener('load', function() {
    // 延迟3秒执行内存优化（确保页面已完全加载）
    setTimeout(function() {
      const { browser } = detectBrowser();
      
      // Chrome和基于Chromium的浏览器内存优化
      if (browser === 'chrome' || browser === 'edge' || browser === 'opera') {
        if (window.performance && window.performance.memory) {
          // 仅在内存使用高时执行
          if (window.performance.memory.usedJSHeapSize > 50000000) { // 50MB
            console.log('执行内存优化');
            
            // 使用正确的方式检测不可见图片
            const allImages = document.querySelectorAll('img');
            allImages.forEach(img => {
              // 检查图片是否在可视区域外或被隐藏
              const rect = img.getBoundingClientRect();
              const isHidden = (
                img.style.display === 'none' || 
                img.style.visibility === 'hidden' ||
                rect.width === 0 || 
                rect.height === 0 ||
                rect.top + rect.height < 0 || 
                rect.left + rect.width < 0 ||
                rect.top > window.innerHeight ||
                rect.left > window.innerWidth
              );
              
              if (isHidden) {
                // 保存原始URL
                const originalSrc = img.src;
                img.dataset.originalSrc = originalSrc;
                // 使用1x1像素的透明GIF替换
                img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
              }
            });
          }
        }
      }
    }, 3000);
  });
})(); 