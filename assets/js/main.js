/**
 * 亿禾新材料网站主脚本
 * Yihe New Materials Website Main Script
 */

(function() {
    'use strict';

    // ==================== 移动端菜单切换 ====================
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');

            // 防止背景滚动
            if (navbarMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // 点击菜单项后关闭菜单（移动端）
        const menuLinks = navbarMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navbarToggle.classList.remove('active');
                    navbarMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // 点击页面其他区域关闭菜单
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 &&
                !navbarToggle.contains(e.target) &&
                !navbarMenu.contains(e.target)) {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==================== 滚动时导航栏效果 ====================
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (navbar) {
            // 添加阴影效果
            if (currentScroll > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }

        lastScroll = currentScroll;
    });

    // ==================== 当前页面高亮导航项 ====================
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const menuLinks = document.querySelectorAll('.navbar-menu a');

        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage ||
                (currentPage === '' && href === 'index.html') ||
                href.includes(currentPage.replace('.html', ''))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    highlightCurrentPage();

    // ==================== 图片懒加载 ====================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // 延迟执行以确保DOM已加载
        setTimeout(() => {
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }, 100);
    }

    // ==================== 平滑滚动到锚点 ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;

                window.scrollTo({
                    top: target.offsetTop - navbarHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== 滚动显示动画 ====================
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    // 页面加载完成后执行动画
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animateOnScroll);
    } else {
        animateOnScroll();
    }

    // ==================== 产品卡片悬停效果增强 ====================
    const productCards = document.querySelectorAll('.product-card, .card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ==================== 返回顶部按钮 ====================
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==================== 外部链接在新标签页打开 ====================
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.hostname.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // ==================== 控制台信息 ====================
    console.log('%c亿禾新材料(湖北)有限公司', 'color: #0056b3; font-size: 20px; font-weight: bold;');
    console.log('%c专注工业用胶粘接技术', 'color: #666; font-size: 14px;');
    console.log('%cwww.yihe-newmaterials.com', 'color: #999; font-size: 12px;');

})();
