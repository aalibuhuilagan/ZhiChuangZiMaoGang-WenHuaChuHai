/* 导航滚动状态 + 滚动入场动画 */
(function () {
    const nav = document.getElementById('navbar');
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
})();
