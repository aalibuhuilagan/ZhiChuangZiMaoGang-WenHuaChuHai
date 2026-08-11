/* 三键双语切换：中文 / English / 中英对照 */
(function () {
    const body = document.body;
    const btns = document.querySelectorAll('.lang-btn');
    const saved = localStorage.getItem('ganmimi-lang') || 'zh';

    function apply(lang) {
        body.dataset.lang = lang;
        btns.forEach(function (b) {
            b.classList.toggle('active', b.dataset.lang === lang);
        });
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        localStorage.setItem('ganmimi-lang', lang);
        // 通知小游戏等模块刷新文案
        window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
    }

    btns.forEach(function (b) {
        b.addEventListener('click', function () { apply(b.dataset.lang); });
    });
    apply(saved);

    // 主题曲：中文模式用中文版（V2），EN/中英对照用纯英文版
    const theme = document.getElementById('theme-song');
    if (theme) {
        function updateTheme(lang) {
            const src = (lang === 'zh') ? theme.dataset.srcZh : theme.dataset.srcEn;
            if (theme.getAttribute('src') !== src) {
                const wasPlaying = !theme.paused;
                theme.setAttribute('src', src);
                theme.load();
                if (wasPlaying) theme.play().catch(function () {});
            }
        }
        window.addEventListener('langchange', function (e) { updateTheme(e.detail); });
        updateTheme(saved);
    }

    // 故事二 AI 短视频：三键切换视频（中 / EN / 中英对照，字幕已烧录在画面内）
    const storyVideo = document.getElementById('story2-video');
    if (storyVideo) {
        function updateStoryVideo(lang) {
            const key = lang === 'zh' ? 'Zh' : (lang === 'en' ? 'En' : 'Both');
            const src = storyVideo.dataset['src' + key];
            if (src && storyVideo.getAttribute('src') !== src) {
                const t = storyVideo.currentTime;
                const wasPlaying = !storyVideo.paused && !storyVideo.ended;
                storyVideo.setAttribute('src', src);
                storyVideo.load();
                storyVideo.currentTime = t;
                if (wasPlaying) storyVideo.play().catch(function () {});
            }
        }
        window.addEventListener('langchange', function (e) { updateStoryVideo(e.detail); });
        updateStoryVideo(saved);
    }
})();
