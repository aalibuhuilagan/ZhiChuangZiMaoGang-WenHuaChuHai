/* 导航滚动状态 + 滚动入场动画 */
(function () {
    const nav = document.getElementById('navbar');

    /* V5 手机端：汉堡菜单开合（≤860px 抽屉导航） */
    const burger = document.querySelector('.nav-burger');
    const overlay = document.querySelector('.nav-overlay');
    function setNavOpen(open) {
        if (!nav || !burger) return;
        nav.classList.toggle('nav-open', open);
        document.body.classList.toggle('nav-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    }
    if (burger) {
        burger.addEventListener('click', function () {
            setNavOpen(!document.body.classList.contains('nav-open'));
        });
    }
    /* V5.4.1：抽屉右上角收起键（显式关闭入口） */
    const navClose = document.querySelector('.nav-close');
    if (navClose) {
        navClose.addEventListener('click', function () { setNavOpen(false); });
    }
    if (overlay) {
        overlay.addEventListener('click', function () { setNavOpen(false); });
    }
    /* V5.4.1：全面屏手势——抽屉向左滑 / 遮罩向左滑 均可收起 */
    let touchStartX = null;
    const drawerEl = document.querySelector('.nav-links');
    function bindSwipeClose(el, threshold) {
        if (!el) return;
        el.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        el.addEventListener('touchend', function (e) {
            if (touchStartX === null) return;
            var dx = e.changedTouches[0].clientX - touchStartX;
            if (dx < -threshold) setNavOpen(false);
            touchStartX = null;
        }, { passive: true });
    }
    bindSwipeClose(drawerEl, 60);
    bindSwipeClose(overlay, 40);
    if (nav) {
        nav.querySelectorAll('.nav-links a').forEach(function (a) {
            a.addEventListener('click', function () { setNavOpen(false); });
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setNavOpen(false);
    });
    window.addEventListener('resize', function () {
        if (window.innerWidth > 860) setNavOpen(false);
    });

    window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // 下拉菜单：点击（触屏）切换，点击外部关闭
    document.querySelectorAll('.nav-item.has-drop .nav-parent').forEach(function (parent) {
        parent.addEventListener('click', function (e) {
            const dd = parent.parentElement.querySelector('.dropdown');
            if (!dd) return;
            if (!parent.closest('a[href]')) {
                e.preventDefault();
                document.querySelectorAll('.dropdown.open').forEach(function (d) { if (d !== dd) d.classList.remove('open'); });
                dd.classList.toggle('open');
            }
        });
    });
    // 二级子菜单：点击展开/收起
    document.querySelectorAll('.dropdown .sub-parent').forEach(function (p) {
        p.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const sm = p.parentElement.querySelector('.submenu');
            if (!sm) return;
            document.querySelectorAll('.submenu.open').forEach(function (s) { if (s !== sm) s.classList.remove('open'); });
            sm.classList.toggle('open');
        });
    });
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.has-drop')) {
            document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
        }
    });

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // 网格卡片交错入场：同组子项按顺序微延迟，形成呼吸感（克制：单组最多约 0.5s）
    document.querySelectorAll('.home-cards, .comics-grid, .ip-grid, .store-grid, .voice-grid, .landing-grid, .route-timeline, .pipeline-grid, .model-grid').forEach(function (grid) {
        Array.prototype.forEach.call(grid.children, function (child, i) {
            if (child.classList.contains('reveal')) child.style.transitionDelay = Math.min(i * 80, 480) + 'ms';
        });
    });

    /* V5.4.1：Hero 滚动视差（Apple 式）——文字先走、主图缓行 + 轻微缩放；
       仅 transform/opacity，rAF 节流，reduced-motion 时关闭。 */
    const hero = document.getElementById('hero');
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hero && !reducedMotion) {
        const heroText = hero.querySelector('.hero-text');
        const heroWrap = hero.querySelector('.hero-img-wrap');
        let ticking = false;
        function heroParallax() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                const y = window.scrollY;
                if (y <= window.innerHeight * 1.4) {
                    if (heroText) {
                        heroText.style.transform = 'translate3d(0,' + (y * 0.32) + 'px,0)';
                        heroText.style.opacity = String(Math.max(1 - y / 520, 0));
                    }
                    if (heroWrap) {
                        const scale = Math.max(1 - y * 0.00012, 0.94);
                        heroWrap.style.transform = 'translate3d(0,' + (y * 0.16) + 'px,0) scale(' + scale + ')';
                    }
                }
                ticking = false;
            });
        }
        window.addEventListener('scroll', heroParallax, { passive: true });
        heroParallax();
    }
})();
