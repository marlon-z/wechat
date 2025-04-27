// IE 浏览器降级支持脚本
(function() {
  // 检测是否为IE浏览器
  function isIE() {
    return navigator.userAgent.indexOf('MSIE') !== -1 || 
           navigator.userAgent.indexOf('Trident/') !== -1;
  }
  
  // 如果是IE浏览器，应用降级处理
  if (isIE()) {
    document.documentElement.className += ' ie-browser';
    
    // 添加提示条
    function addIEBanner() {
      var banner = document.createElement('div');
      banner.style.backgroundColor = '#f8d7da';
      banner.style.color = '#721c24';
      banner.style.padding = '10px 15px';
      banner.style.textAlign = 'center';
      banner.style.position = 'fixed';
      banner.style.top = '0';
      banner.style.left = '0';
      banner.style.right = '0';
      banner.style.zIndex = '9999';
      banner.style.fontFamily = 'Arial, sans-serif';
      banner.style.fontSize = '14px';
      banner.style.borderBottom = '1px solid #f5c6cb';
      
      var bannerText = document.createElement('p');
      bannerText.style.margin = '0';
      bannerText.innerHTML = '您正在使用不受支持的Internet Explorer浏览器。为了获得最佳体验，请升级到 <a href="https://www.microsoft.com/edge" style="color: #721c24; text-decoration: underline;">Microsoft Edge</a>, <a href="https://www.google.com/chrome/" style="color: #721c24; text-decoration: underline;">Google Chrome</a> 或 <a href="https://www.mozilla.org/firefox/" style="color: #721c24; text-decoration: underline;">Mozilla Firefox</a>。';
      
      var closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.style.marginLeft = '15px';
      closeButton.style.backgroundColor = 'transparent';
      closeButton.style.border = 'none';
      closeButton.style.cursor = 'pointer';
      closeButton.style.fontSize = '20px';
      closeButton.style.fontWeight = 'bold';
      closeButton.style.float = 'right';
      closeButton.style.lineHeight = '14px';
      
      closeButton.onclick = function() {
        document.body.removeChild(banner);
        // 记住用户已关闭提示
        try {
          sessionStorage.setItem('ie-banner-closed', 'true');
        } catch(e) {
          // IE可能在隐私模式下禁用sessionStorage
        }
      };
      
      banner.appendChild(closeButton);
      banner.appendChild(bannerText);
      
      // 检查用户是否已关闭提示
      var isBannerClosed = false;
      try {
        isBannerClosed = sessionStorage.getItem('ie-banner-closed') === 'true';
      } catch(e) {
        // IE可能在隐私模式下禁用sessionStorage
      }
      
      if (!isBannerClosed) {
        // 等待DOM加载完成后添加横幅
        if (document.body) {
          document.body.appendChild(banner);
        } else {
          window.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(banner);
          });
        }
      }
    }
    
    // 添加IE兼容性修复
    function applyIEFixes() {
      // 添加Promise和Fetch polyfill
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js';
      document.head.appendChild(script);
      
      var fetchScript = document.createElement('script');
      fetchScript.src = 'https://cdn.jsdelivr.net/npm/whatwg-fetch@3.0.0/dist/fetch.umd.min.js';
      document.head.appendChild(fetchScript);
      
      // 为flexbox添加降级支持
      var styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.innerText = `
        /* IE Flexbox 修复 */
        .flex-container { 
          display: block !important;
        }
        .flex-container > * {
          display: inline-block !important;
          vertical-align: top !important;
        }
        /* 隐藏不支持的功能 */
        .no-ie {
          display: none !important;
        }
        /* 显示IE回退内容 */
        .ie-only {
          display: block !important;
        }
      `;
      document.head.appendChild(styleSheet);
      
      // 使用IE兼容的方式处理CSS变量
      var cssVars = document.createElement('script');
      cssVars.src = 'https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2';
      cssVars.onload = function() {
        if (typeof cssVars === 'function') {
          cssVars({
            watch: true,
            onlyLegacy: true,
            updateDOM: true
          });
        }
      };
      document.head.appendChild(cssVars);
      
      // 修复常见的IE布局问题
      setTimeout(function() {
        // 强制重新计算布局
        var elements = document.querySelectorAll('*');
        for (var i = 0; i < elements.length; i++) {
          var el = elements[i];
          el.className = el.className;
        }
      }, 1000);
    }
    
    // 应用IE特定的优化和修复
    addIEBanner();
    applyIEFixes();
    
    // 简化或禁用一些高级功能
    window.addEventListener('load', function() {
      // 禁用可能导致IE崩溃的复杂动画
      var animations = document.querySelectorAll('.animated, .animation, [data-animation]');
      for (var i = 0; i < animations.length; i++) {
        animations[i].style.animation = 'none';
        animations[i].style.transition = 'none';
      }
      
      // 降级富文本编辑器体验
      if (document.querySelector('.markdown-editor')) {
        document.querySelector('.markdown-editor').classList.add('basic-editor-ie');
      }
      
      console.log('已应用IE浏览器兼容性修复');
    });
  }
})(); 