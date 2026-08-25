/* 全站导航 + 页脚注入（5 主菜单 + 下拉 + 落地蓝图二级子菜单）
 * 每页 <body data-page="..."> 决定高亮；导航结构只在此维护。 */
(function () {
    function t(zh, en) { return '<span class="zh">' + zh + '</span><span class="en">' + en + '</span>'; }
    var page = (document.body && document.body.getAttribute('data-page')) || '';
    var MORE_PAGES = ['game', 'stickers', 'solar', 'world-seasons', 'world-spots', 'world-merch', 'world-festival', 'world-expo', 'world-social', 'voices', 'about'];
    var COMIC_PAGES = ['comics', 'story-1', 'story-2', 'story-3'];
    var PRODUCT_PAGES = ['product', 'world-merch'];
    var isMore = MORE_PAGES.indexOf(page) >= 0;
    var isComics = COMIC_PAGES.indexOf(page) >= 0;
    var isProduct = PRODUCT_PAGES.indexOf(page) >= 0;
    function linkCls(name) { return name === page ? ' class="nav-link active"' : ' class="nav-link"'; }
    function parentCls(on) { return on ? ' class="nav-link nav-parent active"' : ' class="nav-link nav-parent"'; }
    var html =
        '<div class="nav-container">' +
        '<a href="index.html" class="logo">FC-OPC Next iCreate·东方初芯AI原生内容创作大赛</a>' +
        '<div class="nav-links">' +
        '<div class="nav-item"><a href="ip.html"' + linkCls('ip') + '>' + t('IP形象馆', 'The Duo') + '</a></div>' +
        '<div class="nav-item"><a href="legend.html"' + linkCls('legend') + '>' + t('甘工鸟传说', 'The Legend') + '</a></div>' +
        '<div class="nav-item has-drop">' +
        '<span' + parentCls(isComics) + ' role="button" tabindex="0">' + t('IP漫画', 'Comics') + '<span class="caret">▾</span></span>' +
        '<div class="dropdown">' +
        '<a href="story-1.html">' + t('故事一 · 黎锦传说', 'Story 1 · Li Brocade') + '</a>' +
        '<a href="story-2.html">' + t('故事二 · 文昌航天', 'Story 2 · Wenchang Space') + '</a>' +
        '<a href="story-3.html">' + t('故事三 · 南洋骑楼', 'Story 3 · Nanyang Qilou') + '</a>' +
        '</div></div>' +
        '<div class="nav-item"><a href="video.html"' + linkCls('video') + '>' + t('IP视频', 'Film') + '</a></div>' +
        '<div class="nav-item has-drop">' +
        '<span' + parentCls(isProduct) + ' role="button" tabindex="0">' + t('IP产品', 'Store') + '<span class="caret">▾</span></span>' +
        '<div class="dropdown">' +
        '<a href="product.html">' + t('IP 手办商店', 'IP Figure Store') + '</a>' +
        '<a href="world-merch.html">' + t('快闪物料', 'Pop-up Merch') + '</a>' +
        '</div></div>' +
        '<div class="nav-item has-drop">' +
        '<span' + parentCls(isMore) + ' role="button" tabindex="0">' + t('更多内容', 'More') + '<span class="caret">▾</span></span>' +
        '<div class="dropdown">' +
        '<a href="game.html">' + t('游戏 · 表情包', 'Game & Stickers') + '</a>' +
        '<div class="has-sub">' +
        '<span class="sub-parent" role="button" tabindex="0">' + t('落地蓝图', 'IP World') + '<span class="caret">▸</span></span>' +
        '<div class="submenu">' +
        '<a href="world-seasons.html">' + t('四季 · 变装与海报', 'Four Seasons & Posters') + '</a>' +
        '<a href="world-spots.html">' + t('景区 · 节庆 · 文创', 'Spots · Festivals · Goods') + '</a>' +
        '</div></div>' +
        '<a href="voices.html">' + t('多语之声', 'Voices') + '</a>' +
        '<div class="has-sub">' +
        '<span class="sub-parent" role="button" tabindex="0">' + t('创作说明', 'About') + '<span class="caret">▸</span></span>' +
        '<div class="submenu">' +
        '<a href="about.html">' + t('创作者说明', 'About the Creators') + '</a>' +
        '<a href="world-social.html">' + t('社媒传播', 'Social Media') + '</a>' +
        '</div></div>' +
        '</div></div>' +
        '</div>' +
        '<div class="lang-switch" role="group" aria-label="语言切换">' +
        '<button class="lang-btn active" data-lang="zh">中文</button>' +
        '<button class="lang-btn" data-lang="en">EN</button>' +
        '<button class="lang-btn" data-lang="both">中英对照</button>' +
        '</div>' +
        '</div>';
    var nav = document.getElementById('navbar');
    if (nav) nav.innerHTML = html;
    var foot = document.getElementById('page-footer');
    if (foot) {
        foot.innerHTML =
            '<p>© 2026 东方初芯 · 智创自贸港 · 文化出海 / Smart Innovation FTEP · Culture Going Global</p>' +
            '<p class="footer-note">' + t('IP：甘米米 × 呱噜噜 · 图文漫剧 · AI 视频 · 互动网页', 'IP: Ganmimi × Gualulu · Comics · AI Video · Interactive Web') + '</p>';
    }
    // 互动宠物：只在首页展示（V2.6：收敛，避免干扰子页面内容与评审视线）
    if (page === 'home' && !document.getElementById('ip-pets')) {
        var s = document.createElement('script');
        s.src = 'js/pet.js';
        document.body.appendChild(s);
    }
})();
