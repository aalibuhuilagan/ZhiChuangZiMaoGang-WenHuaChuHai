/* 渲染 IP 漫画：按字幕数据生成每格图片 + 三键动态对白 */
(function () {
    const data = window.COMIC_SUBTITLES || {};
    document.querySelectorAll('[data-story]').forEach(function (wrap) {
        const story = wrap.dataset.story;
        const list = data[story] || [];
        list.forEach(function (item) {
            const fig = document.createElement('figure');
            fig.className = 'comic-panel';

            const img = document.createElement('img');
            img.src = 'assets/' + story + '/panel-' + item.panel + '.webp';
            img.alt = '漫画第' + item.panel + '格 / Comic panel ' + item.panel;

            const cap = document.createElement('figcaption');
            cap.className = 'comic-caption';
            const zh = document.createElement('span');
            zh.className = 'zh';
            zh.textContent = item.zh;
            const en = document.createElement('span');
            en.className = 'en';
            en.textContent = item.en;
            cap.appendChild(zh);
            cap.appendChild(en);

            fig.appendChild(img);
            fig.appendChild(cap);
            wrap.appendChild(fig);
        });
    });
})();
